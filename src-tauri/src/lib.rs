use serde::Serialize;
use std::path::PathBuf;
use std::process::{Command, Stdio};
use std::time::{Duration, Instant};
use tauri::Manager;
use wait_timeout::ChildExt;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct RuntimeInfo {
  mode: &'static str,
  model_path: Option<String>,
  model_exists: bool,
  resource_dir: Option<String>,
  llama_cli_path: Option<String>,
  llm_available: bool,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct LlmCleanupResult {
  output: String,
  duration_ms: u64,
  backend: &'static str,
}

#[tauri::command]
fn get_runtime_info(app: tauri::AppHandle) -> RuntimeInfo {
  let resource_dir = app.path().resource_dir().ok();
  let model_path: Option<PathBuf> = resource_dir
    .as_ref()
    .map(|dir: &PathBuf| dir.join("models").join("qwen2.5-1.5b-instruct-q4_k_m.gguf"));
  let llama_cli_path: Option<PathBuf> = resource_dir
    .as_ref()
    .map(|dir: &PathBuf| dir.join("bin").join("llama.cpp").join("runtime").join("llama-cli.exe"));
  let model_exists = model_path.as_ref().is_some_and(|path: &PathBuf| path.exists());
  let llama_exists = llama_cli_path.as_ref().is_some_and(|path: &PathBuf| path.exists());

  RuntimeInfo {
    mode: "desktop",
    model_exists,
    model_path: model_path.as_ref().map(path_to_string),
    resource_dir: resource_dir.as_ref().map(path_to_string),
    llama_cli_path: llama_cli_path.as_ref().map(path_to_string),
    llm_available: model_exists && llama_exists,
  }
}

#[tauri::command]
fn run_llm_cleanup(app: tauri::AppHandle, input: String) -> Result<LlmCleanupResult, String> {
  let trimmed = input.trim();
  if trimmed.is_empty() {
    return Err("empty_input".to_string());
  }

  let resource_dir = app
    .path()
    .resource_dir()
    .map_err(|error| format!("resource_dir_error:{error}"))?;
  let model_path = resource_dir.join("models").join("qwen2.5-1.5b-instruct-q4_k_m.gguf");
  let llama_cli_path = resource_dir
    .join("bin")
    .join("llama.cpp")
    .join("runtime")
    .join("llama-cli.exe");

  if !model_path.exists() {
    return Err("model_missing".to_string());
  }

  if !llama_cli_path.exists() {
    return Err("llama_cli_missing".to_string());
  }

  let runtime_dir = llama_cli_path
    .parent()
    .ok_or_else(|| "runtime_dir_missing".to_string())?;
  let prompt = build_cleanup_prompt(trimmed);
  let thread_count = std::thread::available_parallelism()
    .map(|value| value.get().clamp(2, 8))
    .unwrap_or(4)
    .to_string();
  let started_at = Instant::now();

  let mut child = Command::new(&llama_cli_path)
    .current_dir(runtime_dir)
    .arg("-m")
    .arg(&model_path)
    .arg("--no-display-prompt")
    .arg("--simple-io")
    .arg("--ctx-size")
    .arg("2048")
    .arg("--threads")
    .arg(thread_count)
    .arg("--n-predict")
    .arg("220")
    .arg("--temp")
    .arg("0.1")
    .arg("--top-p")
    .arg("0.9")
    .arg("-p")
    .arg(prompt)
    .stdout(Stdio::piped())
    .stderr(Stdio::piped())
    .spawn()
    .map_err(|error| format!("spawn_error:{error}"))?;

  let timeout = Duration::from_secs(20);
  match child
    .wait_timeout(timeout)
    .map_err(|error| format!("wait_error:{error}"))?
  {
    Some(_) => {}
    None => {
      let _ = child.kill();
      let _ = child.wait();
      return Err("timeout".to_string());
    }
  }

  let output = child
    .wait_with_output()
    .map_err(|error| format!("output_error:{error}"))?;

  if !output.status.success() {
    let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();
    return Err(if stderr.is_empty() {
      "llama_failed".to_string()
    } else {
      format!("llama_failed:{stderr}")
    });
  }

  let cleaned = postprocess_llm_output(String::from_utf8_lossy(&output.stdout).to_string());
  if cleaned.is_empty() {
    return Err("empty_output".to_string());
  }

  Ok(LlmCleanupResult {
    output: cleaned,
    duration_ms: started_at.elapsed().as_millis() as u64,
    backend: "llama.cpp",
  })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![get_runtime_info, run_llm_cleanup])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

fn path_to_string(path: &PathBuf) -> String {
  path.to_string_lossy().to_string()
}

fn build_cleanup_prompt(input: &str) -> String {
  format!(
    concat!(
      "You clean AI-generated text.\n",
      "Keep only the informative main content in Korean or English.\n",
      "Remove conversational filler, apologies, acknowledgements, setup sentences, wrap-up sentences, and recommendation tails.\n",
      "Preserve bullet points and numbered lists when they contain real information.\n",
      "Do not add commentary.\n",
      "Do not summarize beyond removing filler.\n",
      "Return plain text only.\n\n",
      "Input:\n{}"
    ),
    input
  )
}

fn postprocess_llm_output(output: String) -> String {
  let mut text = output.replace("\r\n", "\n").trim().to_string();

  if let Some(stripped) = text.strip_prefix("```") {
    text = stripped.to_string();
  }

  if let Some(stripped) = text.strip_suffix("```") {
    text = stripped.to_string();
  }

  let lines = text
    .lines()
    .map(str::trim)
    .filter(|line| !line.is_empty())
    .filter(|line| !line.eq_ignore_ascii_case("plain text"))
    .filter(|line| !line.eq_ignore_ascii_case("cleaned text"))
    .collect::<Vec<_>>();

  lines.join("\n").trim().to_string()
}
