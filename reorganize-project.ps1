# ============================================================================
# SCRIPT RIORGANIZZAZIONE PROGETTO H4PPYKIDS
# ============================================================================
# Questo script sposta i file nella nuova struttura features-based
# ============================================================================

Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "  RIORGANIZZAZIONE PROGETTO H4PPYKIDS" -ForegroundColor Cyan
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host ""

# Verifica di essere nella root del progetto
if (-not (Test-Path "frontend\src")) {
    Write-Host "ERRORE: Non sei nella root del progetto!" -ForegroundColor Red
    Write-Host "Esegui lo script dalla cartella: C:\Users\Domen\Desktop\Boolean\coding\PERSONAL\digital-store-happykids" -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] Directory corretta trovata!" -ForegroundColor Green
Write-Host ""

# ============================================================================
# STEP 0: BACKUP AUTOMATICO
# ============================================================================
Write-Host "[STEP 0] Creazione backup..." -ForegroundColor Yellow
$backupName = "src_BACKUP_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
Copy-Item -Path "frontend\src" -Destination "frontend\$backupName" -Recurse
Write-Host "[OK] Backup creato: frontend\$backupName" -ForegroundColor Green
Write-Host ""

# ============================================================================
# STEP 1: CREA NUOVE CARTELLE
# ============================================================================
Write-Host "[STEP 1] Creazione nuove cartelle..." -ForegroundColor Yellow

$folders = @(
    "frontend\src\features\landing\components\shared",
    "frontend\src\features\landing\components\detox",
    "frontend\src\features\landing\components\workbooks",
    "frontend\src\features\landing\components\conversion",
    "frontend\src\features\landing\pages",
    "frontend\src\features\products\components",
    "frontend\src\features\products\pages",
    "frontend\src\features\cart\components",
    "frontend\src\features\cart\pages",
    "frontend\src\features\checkout\components",
    "frontend\src\features\checkout\pages",
    "frontend\src\features\contacts\pages",
    "frontend\src\features\legal\pages",
    "frontend\src\features\admin\components",
    "frontend\src\features\admin\pages",
    "frontend\src\components\common"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Path $folder -Force | Out-Null
    Write-Host "  [+] $folder" -ForegroundColor Gray
}

Write-Host "[OK] Cartelle create!" -ForegroundColor Green
Write-Host ""

# ============================================================================
# STEP 2: SPOSTA HEADER/NAVBAR
# ============================================================================
Write-Host "[STEP 2] Spostamento Header/Navbar in common..." -ForegroundColor Yellow

if (Test-Path "frontend\src\components\landing\workbooks\components\Header.tsx") {
    Move-Item -Path "frontend\src\components\landing\workbooks\components\Header.tsx" -Destination "frontend\src\components\common\Header.tsx" -Force
    Write-Host "  [+] Header.tsx" -ForegroundColor Gray
}

if (Test-Path "frontend\src\components\landing\workbooks\components\Navbar.tsx") {
    Move-Item -Path "frontend\src\components\landing\workbooks\components\Navbar.tsx" -Destination "frontend\src\components\common\Navbar.tsx" -Force
    Write-Host "  [+] Navbar.tsx" -ForegroundColor Gray
}

if (Test-Path "frontend\src\components\landing\workbooks\components\ProductsDropdown.tsx") {
    Move-Item -Path "frontend\src\components\landing\workbooks\components\ProductsDropdown.tsx" -Destination "frontend\src\features\landing\components\shared\ProductsDropdown.tsx" -Force
    Write-Host "  [+] ProductsDropdown.tsx" -ForegroundColor Gray
}

Write-Host "[OK] Componenti comuni spostati!" -ForegroundColor Green
Write-Host ""

# ============================================================================
# STEP 3: SPOSTA LANDING PAGES
# ============================================================================
Write-Host "[STEP 3] Spostamento Landing Pages..." -ForegroundColor Yellow

if (Test-Path "frontend\src\components\landing\LandingPageDetox.tsx") {
    Move-Item -Path "frontend\src\components\landing\LandingPageDetox.tsx" -Destination "frontend\src\features\landing\pages\LandingPageDetox.tsx" -Force
    Write-Host "  [+] LandingPageDetox.tsx" -ForegroundColor Gray
}

if (Test-Path "frontend\src\components\landing\LandingPageWorkbooks.tsx") {
    Move-Item -Path "frontend\src\components\landing\LandingPageWorkbooks.tsx" -Destination "frontend\src\features\landing\pages\LandingPageWorkbooks.tsx" -Force
    Write-Host "  [+] LandingPageWorkbooks.tsx" -ForegroundColor Gray
}

# Modals shared
$sharedModals = @("LookInsideModal.tsx", "WorkbookPreviewModal.tsx", "Lookinsidesect.tsx")
foreach ($modal in $sharedModals) {
    if (Test-Path "frontend\src\components\landing\$modal") {
        Move-Item -Path "frontend\src\components\landing\$modal" -Destination "frontend\src\features\landing\components\shared\$modal" -Force
        Write-Host "  [+] $modal" -ForegroundColor Gray
    }
}

Write-Host "[OK] Landing pages spostate!" -ForegroundColor Green
Write-Host ""

# ============================================================================
# STEP 4: SPOSTA SECTIONS DETOX
# ============================================================================
Write-Host "[STEP 4] Spostamento sections detox..." -ForegroundColor Yellow

if (Test-Path "frontend\src\components\landing\sections\detox") {
    Get-ChildItem "frontend\src\components\landing\sections\detox\*" | ForEach-Object {
        Move-Item -Path $_.FullName -Destination "frontend\src\features\landing\components\detox\" -Force
        Write-Host "  [+] $($_.Name)" -ForegroundColor Gray
    }
}

Write-Host "[OK] Sections detox spostate!" -ForegroundColor Green
Write-Host ""

# ============================================================================
# STEP 5: SPOSTA SECTIONS WORKBOOKS
# ============================================================================
Write-Host "[STEP 5] Spostamento sections workbooks..." -ForegroundColor Yellow

if (Test-Path "frontend\src\components\landing\workbooks\sections") {
    Get-ChildItem "frontend\src\components\landing\workbooks\sections\*" | ForEach-Object {
        Move-Item -Path $_.FullName -Destination "frontend\src\features\landing\components\workbooks\" -Force
        Write-Host "  [+] $($_.Name)" -ForegroundColor Gray
    }
}

Write-Host "[OK] Sections workbooks spostate!" -ForegroundColor Green
Write-Host ""

# ============================================================================
# STEP 6: SPOSTA CONVERSION COMPONENTS
# ============================================================================
Write-Host "[STEP 6] Spostamento conversion components..." -ForegroundColor Yellow

if (Test-Path "frontend\src\components\landing\conversion") {
    Get-ChildItem "frontend\src\components\landing\conversion\*" | ForEach-Object {
        Move-Item -Path $_.FullName -Destination "frontend\src\features\landing\components\conversion\" -Force
        Write-Host "  [+] $($_.Name)" -ForegroundColor Gray
    }
}

Write-Host "[OK] Conversion components spostati!" -ForegroundColor Green
Write-Host ""

# ============================================================================
# STEP 7: SPOSTA PRODUCTS E CONTACTS
# ============================================================================
Write-Host "[STEP 7] Spostamento Products e Contacts..." -ForegroundColor Yellow

if (Test-Path "frontend\src\components\landing\workbooks\pages\ProductsPage.tsx") {
    Move-Item -Path "frontend\src\components\landing\workbooks\pages\ProductsPage.tsx" -Destination "frontend\src\features\products\pages\ProductsPage.tsx" -Force
    Write-Host "  [+] ProductsPage.tsx" -ForegroundColor Gray
}

if (Test-Path "frontend\src\components\landing\workbooks\pages\ContactsPage.tsx") {
    Move-Item -Path "frontend\src\components\landing\workbooks\pages\ContactsPage.tsx" -Destination "frontend\src\features\contacts\pages\ContactsPage.tsx" -Force
    Write-Host "  [+] ContactsPage.tsx" -ForegroundColor Gray
}

Write-Host "[OK] Products e Contacts spostati!" -ForegroundColor Green
Write-Host ""

# ============================================================================
# STEP 8: SPOSTA LEGAL PAGES
# ============================================================================
Write-Host "[STEP 8] Spostamento Legal pages..." -ForegroundColor Yellow

if (Test-Path "frontend\src\pages\CookiePolicyPage.tsx") {
    Move-Item -Path "frontend\src\pages\CookiePolicyPage.tsx" -Destination "frontend\src\features\legal\pages\CookiePolicyPage.tsx" -Force
    Write-Host "  [+] CookiePolicyPage.tsx" -ForegroundColor Gray
}

if (Test-Path "frontend\src\pages\PrivacyPolicyPage.tsx") {
    Move-Item -Path "frontend\src\pages\PrivacyPolicyPage.tsx" -Destination "frontend\src\features\legal\pages\PrivacyPolicyPage.tsx" -Force
    Write-Host "  [+] PrivacyPolicyPage.tsx" -ForegroundColor Gray
}

if (Test-Path "frontend\src\pages\RefundPolicyPage.tsx") {
    Move-Item -Path "frontend\src\pages\RefundPolicyPage.tsx" -Destination "frontend\src\features\legal\pages\RefundPolicyPage.tsx" -Force
    Write-Host "  [+] RefundPolicyPage.tsx" -ForegroundColor Gray
}

if (Test-Path "frontend\src\pages\ProductPage.tsx") {
    Move-Item -Path "frontend\src\pages\ProductPage.tsx" -Destination "frontend\src\features\products\pages\ProductPage.tsx" -Force
    Write-Host "  [+] ProductPage.tsx" -ForegroundColor Gray
}

Write-Host "[OK] Legal pages spostate!" -ForegroundColor Green
Write-Host ""

# ============================================================================
# STEP 9: SPOSTA CHECKOUT
# ============================================================================
Write-Host "[STEP 9] Spostamento Checkout..." -ForegroundColor Yellow

if (Test-Path "frontend\src\components\StripePaymentForm.tsx") {
    Move-Item -Path "frontend\src\components\StripePaymentForm.tsx" -Destination "frontend\src\features\checkout\components\StripePaymentForm.tsx" -Force
    Write-Host "  [+] StripePaymentForm.tsx" -ForegroundColor Gray
}

if (Test-Path "frontend\src\pages\PaymentSuccess.tsx") {
    Move-Item -Path "frontend\src\pages\PaymentSuccess.tsx" -Destination "frontend\src\features\checkout\pages\PaymentSuccess.tsx" -Force
    Write-Host "  [+] PaymentSuccess.tsx" -ForegroundColor Gray
}

if (Test-Path "frontend\src\pages\PaymentCancel.tsx") {
    Move-Item -Path "frontend\src\pages\PaymentCancel.tsx" -Destination "frontend\src\features\checkout\pages\PaymentCancel.tsx" -Force
    Write-Host "  [+] PaymentCancel.tsx" -ForegroundColor Gray
}

Write-Host "[OK] Checkout spostato!" -ForegroundColor Green
Write-Host ""

# ============================================================================
# STEP 10: SPOSTA ADMIN
# ============================================================================
Write-Host "[STEP 10] Spostamento Admin..." -ForegroundColor Yellow

if (Test-Path "frontend\src\components\admin") {
    Get-ChildItem "frontend\src\components\admin\*" | ForEach-Object {
        Move-Item -Path $_.FullName -Destination "frontend\src\features\admin\components\" -Force
        Write-Host "  [+] $($_.Name)" -ForegroundColor Gray
    }
}

if (Test-Path "frontend\src\pages\admin") {
    Get-ChildItem "frontend\src\pages\admin\*" | ForEach-Object {
        Move-Item -Path $_.FullName -Destination "frontend\src\features\admin\pages\" -Force
        Write-Host "  [+] $($_.Name)" -ForegroundColor Gray
    }
}

Write-Host "[OK] Admin spostato!" -ForegroundColor Green
Write-Host ""

# ============================================================================
# STEP 11: CLEANUP CARTELLE VUOTE
# ============================================================================
Write-Host "[STEP 11] Rimozione cartelle vuote..." -ForegroundColor Yellow

$foldersToRemove = @(
    "frontend\src\components\landing\sections\detox",
    "frontend\src\components\landing\sections",
    "frontend\src\components\landing\workbooks\sections",
    "frontend\src\components\landing\workbooks\components",
    "frontend\src\components\landing\workbooks\pages",
    "frontend\src\components\landing\workbooks",
    "frontend\src\components\landing\conversion",
    "frontend\src\components\landing",
    "frontend\src\components\admin",
    "frontend\src\pages\admin"
)

foreach ($folder in $foldersToRemove) {
    if (Test-Path $folder) {
        $items = Get-ChildItem $folder -Force
        if ($items.Count -eq 0) {
            Remove-Item -Path $folder -Force
            Write-Host "  [-] Rimossa: $folder" -ForegroundColor Gray
        } else {
            Write-Host "  [SKIP] Non vuota: $folder" -ForegroundColor Yellow
        }
    }
}

Write-Host "[OK] Cleanup completato!" -ForegroundColor Green
Write-Host ""

# ============================================================================
# STEP 12: GENERA TREE NUOVA STRUTTURA
# ============================================================================
Write-Host "[STEP 12] Generazione tree nuova struttura..." -ForegroundColor Yellow

tree /F /A frontend\src\features > "tree-features-NEW.txt"
tree /F /A frontend\src\components > "tree-components-NEW.txt"

Write-Host "[OK] Tree generati:" -ForegroundColor Green
Write-Host "  -> tree-features-NEW.txt" -ForegroundColor Cyan
Write-Host "  -> tree-components-NEW.txt" -ForegroundColor Cyan
Write-Host ""

# ============================================================================
# RIEPILOGO FINALE
# ============================================================================
Write-Host "============================================================================" -ForegroundColor Green
Write-Host "  [OK] RIORGANIZZAZIONE COMPLETATA!" -ForegroundColor Green
Write-Host "============================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "NUOVA STRUTTURA:" -ForegroundColor Cyan
Write-Host "  -> frontend/src/features/          (Features applicazione)" -ForegroundColor White
Write-Host "  -> frontend/src/components/common/ (Componenti globali)" -ForegroundColor White
Write-Host ""
Write-Host "BACKUP:" -ForegroundColor Cyan
Write-Host "  -> frontend/$backupName" -ForegroundColor White
Write-Host ""
Write-Host "FILE TREE:" -ForegroundColor Cyan
Write-Host "  -> tree-features-NEW.txt" -ForegroundColor White
Write-Host "  -> tree-components-NEW.txt" -ForegroundColor White
Write-Host ""
Write-Host "PROSSIMI STEP:" -ForegroundColor Yellow
Write-Host "  1. Verifica i tree generati" -ForegroundColor White
Write-Host "  2. Aggiorna gli import nei file (cerca/sostituisci nel tuo IDE)" -ForegroundColor White
Write-Host "  3. Testa che l'app compili: npm run dev" -ForegroundColor White
Write-Host "  4. Se tutto OK, elimina il backup" -ForegroundColor White
Write-Host ""
Write-Host "============================================================================" -ForegroundColor Green

# Apri i tree automaticamente
Start-Process notepad.exe "tree-features-NEW.txt"
Start-Process notepad.exe "tree-components-NEW.txt"