param([string]$BuildRoot = "$env:LOCALAPPDATA\YouTubeFocusGuardBuild")
$ErrorActionPreference = 'Stop'
$sourceRoot = Split-Path $PSScriptRoot -Parent
if (-not $env:JAVA_HOME) { throw 'Set JAVA_HOME to your JDK 17 directory first.' }
if (-not $env:ANDROID_HOME) { throw 'Set ANDROID_HOME to your Android SDK directory first.' }
# Unique staging folder prevents stale source from entering the build.
$stage = Join-Path $BuildRoot ([guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Force $stage | Out-Null
& robocopy.exe $sourceRoot $stage /E /XD .git .gradle build artifacts .venv /XF local.properties /NFL /NDL /NJH /NJS | Out-Null
if ($LASTEXITCODE -ge 8) { throw "Source copy failed: $LASTEXITCODE" }
Push-Location $stage
try {
    & .\gradlew.bat assembleDebug lintDebug --console plain
    if ($LASTEXITCODE -ne 0) { throw "Build failed: $LASTEXITCODE" }
    $output = Join-Path $sourceRoot 'artifacts'
    New-Item -ItemType Directory -Force $output | Out-Null
    Copy-Item 'app\build\outputs\apk\debug\app-debug.apk' (Join-Path $output 'youtube-focus-guard.apk')
    Get-FileHash (Join-Path $output 'youtube-focus-guard.apk') -Algorithm SHA256
} finally { Pop-Location }
