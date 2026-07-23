# Netlify Env Push Script
# .env.local dosyasındaki tüm değerleri Netlify'a aktarır
# Kullanım: .\netlify-env-push.ps1 -SiteName "your-site-name"

param(
    [Parameter(Mandatory=$true)]
    [string]$SiteName
)

# Siteye bağlan
Write-Host "Siteye bağlanılıyor: $SiteName" -ForegroundColor Cyan
netlify link --name $SiteName

if ($LASTEXITCODE -ne 0) {
    Write-Host "Bağlantı başarısız. Site adını kontrol edin." -ForegroundColor Red
    exit 1
}

# .env.local oku ve aktar
Write-Host "`nEnv değişkenleri aktarılıyor..." -ForegroundColor Cyan

$skipKeys = @("NODE_ENV", "VERCEL", "VERCEL_ENV", "VERCEL_URL", "NX_DAEMON", "TURBO_CACHE", "TURBO_DOWNLOAD_LOCAL_ENABLED", "TURBO_REMOTE_ONLY", "TURBO_RUN_SUMMARY")

Get-Content ".env.local" | ForEach-Object {
    $line = $_.Trim()
    
    # Boş satır ve yorum satırlarını atla
    if ($line -eq "" -or $line.StartsWith("#")) { return }
    
    # KEY=VALUE parse et
    $eqIndex = $line.IndexOf("=")
    if ($eqIndex -lt 0) { return }
    
    $key   = $line.Substring(0, $eqIndex).Trim()
    $value = $line.Substring($eqIndex + 1).Trim()
    
    # Gereksiz Vercel-specific key'leri atla
    if ($skipKeys -contains $key) { return }
    
    # Boş değerleri atla
    if ($value -eq "" -or $value -eq '""') {
        Write-Host "  ATLANDI (boş): $key" -ForegroundColor Yellow
        return
    }
    
    Write-Host "  Aktarılıyor: $key" -ForegroundColor Green
    netlify env:set $key $value --context production 2>&1 | Out-Null
}

Write-Host "`nTamamlandı! Netlify dashboard'dan kontrol edin." -ForegroundColor Green
Write-Host "https://app.netlify.com/sites/$SiteName/configuration/env" -ForegroundColor Cyan
