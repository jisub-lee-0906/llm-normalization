$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$releaseDir = Join-Path $root "src-tauri\target\release"
$appExe = Join-Path $releaseDir "app.exe"
$modelFile = Join-Path $root "models\qwen2.5-1.5b-instruct-q4_k_m.gguf"
$runtimeDir = Join-Path $root "bin\llama.cpp\runtime"
$portableRoot = Join-Path $root "dist\portable"
$portableAppDir = Join-Path $portableRoot "AI-답변-정리기-portable"
$zipPath = Join-Path $portableRoot "AI-답변-정리기-portable.zip"

$runtimeKeep = @(
  "ggml-base.dll",
  "ggml-cpu-*.dll",
  "ggml-rpc.dll",
  "ggml.dll",
  "libomp140.x86_64.dll",
  "llama.dll",
  "llama-cli.exe"
)

if (!(Test-Path $appExe)) {
  throw "Missing app executable: $appExe"
}

if (!(Test-Path $modelFile)) {
  throw "Missing model file: $modelFile"
}

if (!(Test-Path $runtimeDir)) {
  throw "Missing llama.cpp runtime directory: $runtimeDir"
}

Remove-Item -LiteralPath $portableAppDir -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $portableAppDir | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $portableAppDir "models") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $portableAppDir "bin\llama.cpp\runtime") | Out-Null

Copy-Item -LiteralPath $appExe -Destination (Join-Path $portableAppDir "AI-답변-정리기.exe") -Force
Copy-Item -LiteralPath $modelFile -Destination (Join-Path $portableAppDir "models") -Force

foreach ($pattern in $runtimeKeep) {
  Get-ChildItem -Path $runtimeDir -Filter $pattern -File | ForEach-Object {
    Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $portableAppDir "bin\llama.cpp\runtime") -Force
  }
}

$readme = @"
AI 답변 정리기 포터블

- 설치 없이 이 폴더에서 `AI-답변-정리기.exe`를 바로 실행합니다.
- 삭제하려면 이 폴더 전체를 지우면 됩니다.
- `models` 또는 `bin` 폴더 구조를 바꾸면 로컬 본문 추출이 동작하지 않을 수 있습니다.
"@

Set-Content -LiteralPath (Join-Path $portableAppDir "README.txt") -Value $readme -Encoding UTF8

Remove-Item -LiteralPath $zipPath -Force -ErrorAction SilentlyContinue
Compress-Archive -LiteralPath $portableAppDir -DestinationPath $zipPath -Force

Get-Item $portableAppDir, $zipPath | Select-Object FullName, Length, LastWriteTime
