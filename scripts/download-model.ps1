param(
  [string]$Model = "qwen2.5-1.5b-instruct-q4_k_m.gguf"
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$modelsDir = Join-Path $root "models"
New-Item -ItemType Directory -Force -Path $modelsDir | Out-Null

$target = Join-Path $modelsDir $Model

if (Test-Path $target) {
  Write-Host "Model already exists at $target"
  exit 0
}

$url = "https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF/resolve/main/$Model"
Write-Host "Downloading $Model ..."
curl.exe -L $url --output $target
Write-Host "Saved to $target"
