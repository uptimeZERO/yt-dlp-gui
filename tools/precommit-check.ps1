$ErrorActionPreference = "Stop"

Set-Location (Resolve-Path (Join-Path $PSScriptRoot ".."))
$env:PWD = (Get-Location).Path

$checks = @(
  @{ Name = "build"; Args = @("run", "build") },
  @{ Name = "lint"; Args = @("run", "lint") },
  @{ Name = "test"; Args = @("run", "test:ci") }
)

foreach ($check in $checks) {
  & npm.cmd @($check.Args)

  if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
  }

  Write-Host "precommit: $($check.Name) passed"
}
