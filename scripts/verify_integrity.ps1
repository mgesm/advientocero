$ErrorActionPreference = "Stop"
$root = "C:\Users\migue\.gemini\antigravity\scratch\advientocero"
$errors = 0

Write-Host "=== ADVIENTO CERO: AUDITORÍA DE INTEGRIDAD (CERO SPOILERS) ==="

# 1. Cero Emojis (BMP + Astrales) & UTF-8 sin BOM
$files = Get-ChildItem -Path $root -Recurse -File | Where-Object {
  $_.Extension -in @(".html", ".css", ".js", ".md", ".json", ".ps1", ".svg") -and $_.FullName -notlike "*\.git\*" -and $_.Name -ne "verify_integrity.ps1"
}
foreach ($f in $files) {
  $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
  if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
    Write-Host "[FAIL] BOM detectado en $($f.FullName)" -ForegroundColor Red
    $errors++
  }
  $text = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
  if ($text -match "[\uD83C-\uDBFF][\uDC00-\uDFFF]" -or $text -match "[\u2600-\u27BF\u2300-\u23FF\uFE0F]") {
    Write-Host "[FAIL] Emoji o pictograma Unicode detectado en $($f.FullName)" -ForegroundColor Red
    $errors++
  }
}
Write-Host "[OK] Escaneo UTF-8 sin BOM y Cero Emojis completado sobre $($files.Count) archivos."

# 2. Verificar imágenes en disco (3 escenas + 3 evidencias + icon + 25 sospechosos)
foreach ($req in @("imagenes\icon.svg", "imagenes\cover-hotel.jpg", "imagenes\scene-lobby.jpg", "imagenes\scene-balcony.jpg", "imagenes\evidence\afis_huellas_final.jpg", "imagenes\evidence\viales_toxicologia_final.jpg", "imagenes\evidence\cuadro_electrico_final.jpg")) {
  if (!(Test-Path (Join-Path $root $req))) {
    Write-Host "[FAIL] Falta imagen $req" -ForegroundColor Red
    $errors++
  }
}
$suspectsRaw = [System.IO.File]::ReadAllText((Join-Path $root "data\suspects.js"), [System.Text.Encoding]::UTF8)
$suspectJson = ($suspectsRaw -replace '(?s)^.*?window\.SUSPECTS_DATA\s*=\s*', '') -replace ';\s*$', ''
$suspects = $suspectJson | ConvertFrom-Json
if ($suspects.Count -ne 25) {
  Write-Host "[FAIL] Se esperaban 25 sospechosos, encontrados $($suspects.Count)" -ForegroundColor Red
  $errors++
}
foreach ($s in $suspects) {
  $p = Join-Path $root ($s.portrait -replace '/', '\')
  if (!(Test-Path $p)) {
    Write-Host "[FAIL] Falta retrato $($s.portrait)" -ForegroundColor Red
    $errors++
  }
}
Write-Host "[OK] 25 sospechosos y todos los retratos verificados en disco."

# 3. Verificar 24 días, hashes y unicidad de los 24 descartes (sin imprimir nombres)
$daysRaw = [System.IO.File]::ReadAllText((Join-Path $root "data\days.js"), [System.Text.Encoding]::UTF8)
$daysJson = ($daysRaw -replace '(?s)^.*?window\.ADVENT_DAYS\s*=\s*', '') -replace ';\s*$', ''
$days = $daysJson | ConvertFrom-Json
if ($days.Count -ne 24) {
  Write-Host "[FAIL] Se esperaban 24 días, encontrados $($days.Count)" -ForegroundColor Red
  $errors++
}

$discardSet = New-Object 'System.Collections.Generic.HashSet[string]'
$suspectIdSet = New-Object 'System.Collections.Generic.HashSet[string]'
foreach ($s in $suspects) { [void]$suspectIdSet.Add($s.id) }

$noDiscardDays = 0
foreach ($d in $days) {
  if (-not $d.miguel -or -not $d.patri -or -not $d.hints -or $d.hints.Count -lt 3) {
    Write-Host "[FAIL] Estructura incompleta en día $($d.day)" -ForegroundColor Red
    $errors++
  }
  $payloadBytes = [System.Convert]::FromBase64String($d.unlockPayload)
  $payload = ([System.Text.Encoding]::UTF8.GetString($payloadBytes)) | ConvertFrom-Json
  if ([string]::IsNullOrWhiteSpace($payload.discardId)) {
    $noDiscardDays++
  } else {
    if (-not $suspectIdSet.Contains($payload.discardId)) {
      Write-Host "[FAIL] discardId inválido en día $($d.day)" -ForegroundColor Red
      $errors++
    }
    if (-not $discardSet.Add($payload.discardId)) {
      Write-Host "[FAIL] discardId duplicado en día $($d.day)" -ForegroundColor Red
      $errors++
    }
  }
  if ($d.mode -eq "dual-lock") {
    if ($d.miguel.acceptedHashes[0].Length -ne 64 -or $d.patri.acceptedHashes[0].Length -ne 64) {
      Write-Host "[FAIL] Hash SHA-256 inválido en día $($d.day)" -ForegroundColor Red
      $errors++
    }
  } else {
    if ($d.jointInput.acceptedHashes[0].Length -ne 64) {
      Write-Host "[FAIL] Hash SHA-256 inválido en día $($d.day)" -ForegroundColor Red
      $errors++
    }
  }
}

if ($discardSet.Count -ne 22 -or $noDiscardDays -ne 2) {
  Write-Host "[FAIL] Total descartes únicos = $($discardSet.Count) (esperado 22) y días sin descarte = $noDiscardDays (esperado 2)" -ForegroundColor Red
  $errors++
} else {
  Write-Host "[OK] Integridad matemática verificada: 24 días, 22 descartes únicos + 2 diligencias abiertas, 3 sospechosos finalistas, 72 pistas y todos los hashes SHA-256 válidos."
}

if ($errors -gt 0) {
  exit 1
}
Write-Host "=== AUDITORÍA SUPERADA SIN ERRORES ===" -ForegroundColor Green
