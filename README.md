## DataGridUXDemo for iMac and Windows

### DataGridUXDemo is an advanced jQuery DataTable that demonstrates drag-and-drop column 
grouping via a visual group zone with clear visual indicators. 
The view supports runtime theme switching between light and dark modes using 
Bootstrap 5’s global theming, while also allowing the table header theme to 
be toggled independently.

## DataGridUXDemo is an Electron.NET ASP.NET 10 CORE 10 Web App (Model-View-Controller)

- EXPLANATION OF CORE NAMING

In November 2020, Microsoft released .NET 5.0, dropping the "Core” branding so all 
versions of .NET after 5.0 are "Core" apps. Commonly you will see .NET 8 applications 
refrred to as a "Core 8" applications because .NET 8 is a Core application.

# MD Editors

- https://stackedit.io/
- https://pandao.github.io/editor.md/

### Install These Packages
- Microsoft.Extensions.Hosting (Version="10.0.2")
- System.Windows.Extensions (Version="10.0.2")
- Newtonsoft.Json (Version="13.0.4")
- Microsoft.AspNetCore.Mvc.NewtonsoftJson (Version="10.0.2")

### Install Microsoft.Data Packages
- Microsoft.Data.SqlClient (Version="6.1.4")
- Microsoft.Data.Sqlite.Core (Version="10.0.2") 

### Install SQLite Packages
- SQLitePCLRaw.bundle_e_sqlite3 (Version="3.0.2")  
- SQLitePCLRaw.bundle_green (Version="2.1.11")
- SQLitePCLRaw.core (Version="3.0.2")  
- SQLitePCLRaw.provider.dynamic_cdecl (Version="3.0.2")  

### Install Electron.NET (optional for iMac)
- ElectronNET.API (Version="23.6.2")












- xMicrosoft.DotNet.UpgradeAssistant.Extensions.Default.Analyzers (Version="0.4.421302") 
- xMicrosoft.Extensions.Logging (Version="8.0.0")
- xMicrosoft.VisualStudio.Web.CodeGeneration.Design (Version="8.0.5")
















  <ItemGroup>
    <PackageReference Include="Google.Apis.Auth" Version="1.70.0" />
    <PackageReference Include="Google.Apis.PeopleService.v1" Version="1.69.0.3785" />
  </ItemGroup>

- ### Other Packages You Can Add
- xExcelDataReader (Version="3.7.0")
- xMarkdig (Version="0.37.0")

xxx dotnet remove package Microsoft.Office.Interop.Outlook

- ### Other Packages You Can Add
- dotnet add package Google.Apis.PeopleService.v1
- dotnet add package Google.Apis.Auth

### Amazon Packages You Can Add
### 📦 Required NuGet Packages
- Install-Package RestSharp -Version 106.15.0

- Install-Package AWSSDK.SecurityToken
- (Optional: If you plan to load your credentials 
- and app settings from appsettings.json)
- Install-Package Microsoft.Extensions.Configuration.Json

Install-Package RestSharp -Version 106.15.0
Install-Package AWSSDK.SecurityToken
Install-Package AWSSDK.Core


## PDF & WORD EXPORTS
var r_header_title: 'Header Title Here';
var r_main_title = 'Sample Report';
var r_messageTop = 'Sample Number: 12345 | Type: Example Type';
var r_footer_text = 'Footer text here';
title: 'Sample Report',  // Set the title of the exported PDF
messageTop: '";"


## IMAGES & EMOJIS SYMBOLS: ™, ®, ©, 

Here are some emojis you can use directly in html:
https://unicode.org/emoji/charts/full-emoji-list.html
https://emojipedia.org/travel-places/
https://emojihub.org/
https://emoji-copy-paste.com/

## Fonts - Use calc

Use the `calc()` function to dynamically calculate the font size based on the width of the viewport (`vw`). This technique is often used to create fluid typography on web pages, making the font size responsive to the screen size without the need for media queries. Here's a breakdown of how it works:

```css
font-size: calc(13px + (15 - 13) * ((100vw - 300px) / (1600 - 300)));
```

1. **Base Font Size**: The calculation starts with a base font size of `13px`. This is the minimum font size that will be applied.
2. **Font Size Range**: The next part, `(15 - 13)`, calculates the range within which the font size can grow. In this case, the font size can increase by up to `2px` (from `13px` to `15px`).
3. **Viewport Width Adjustment**: `100vw` represents 100% of the viewport width. The expression `(100vw - 300px)` calculates the difference between the current viewport width and `300px`. This difference will be used to adjust the font size based on the screen width.
4. **Scaling Range**: `(1600 - 300)` calculates the total scaling range for the viewport width, which in this case is `1300px` (from `300px` to `1600px`). This defines the range over which the font size will adjust.
5. **Final Calculation**: The entire `calc()` function calculates the font size by starting with the base size (`13px`), then adds an increment that scales based on the viewport width. The increment is proportionally scaled within the range defined by `(15 - 13) * ((100vw - 300px) / (1600 - 300))`. This means as the viewport width increases from `300px` to `1600px`, the font size will linearly increase from `13px` to `15px`.

In summary, this CSS rule makes the font size start at `13px` when the viewport width is `300px` or less. As the viewport width grows, the font size increases linearly, reaching `15px` when the viewport width hits `1600px`. For viewport widths between `300px` and `1600px`, the font size will be somewhere between `13px` and `15px`, calculated based on the formula provided. This approach provides a smooth transition of font sizes across different screen widths, enhancing readability and user experience on a variety of devices.





tp1.Text = "Welcome";
WelcomeControl welcomeControl = new WelcomeControl(this);

tp2.Text = "Accounts";
AccountControl accountControl = new AccountControl(this);

tp3.Text = "Banks";
BankControl bankControl = new BankControl(this);

tp4.Text = "Import";
ImportControl importControl = new ImportControl(this);

tp5.Text = "Transactions";
TransactionControl transControl = new TransactionControl(this);

tp6.Text = "Reports";
ReportControl reportsControl = new ReportControl(this);

tp7.Text = "Categories";
CategoryControl categoryControl = new CategoryControl(this);

tp8.Text = "Export";
ExportControl exportControl = new ExportControl(this);

tp9.Text = "Settings";
SettingsControl settingsControl = new SettingsControl(this);


ELECTRON.NET ML.NET /
├── Controllers/
├── Models/
├── Data/                         ← ✅ Only company/user DBs go here
│   └── acme_corp.aidb
│   └── my_test_company.aidb
│   └── ...
├── Libs/                     ← 🔒 Libs-use only database goes here
│   └── model.zip             ← Example: shared master categories, rules, etc.
│   └── naics.xlsx            ← Example: shared master categories, rules, etc.
│   └── pandata.aidb          ← Example: shared master categories, rules, etc.
│   └── RulesEngine.dll       ← Example: shared master categories, rules, etc.
│   └── shitte.csv            ← Example: shared master categories, rules, etc.
│   └── usbanks.aidb          ← Example: shared master categories, rules, etc.
│   └── zulu.aidb             ← Example: shared master categories, rules, etc.
├── Program.cs
├── Views/Shared/
│   └── _Ads.cshtml                     ← Example: shared master categories, rules, etc.
│   └── _AuthorizeModal.cshtml          ← Example: shared master categories, rules, etc.
│   └── _BankModal.cshtml               ← Example: shared master categories, rules, etc.
│   └── _CompanyModal.cshtml            ← Example: shared master categories, rules, etc.
│   └── _DataTableWithExport.cshtml     ← Example: shared master categories, rules, etc.
│   └── _Layout.cshtml                  ← Example: shared master categories, rules, etc.
│   └── _MessageModal.cshtml            ← Example: shared master categories, rules, etc.
│   └── _SplashModal.cshtml             ← Example: shared master categories, rules, etc.
│   └── _SplitModal.cshtml              ← Example: shared master categories, rules, etc.
│   └── Error.cshtml                    ← Example: shared master categories, rules, etc.



/Users/<YourUsername>/Library/Application Support/AiNetProfit/
~/Library/Application Support/AiNetProfit/
C:\Users\Owner\AppData\Local\AiNetProfit\
├── Databases\                        ← ✅ Company-specific user databases (read/write)
│   ├── acme_corp.aidb
│   ├── my_test_company.aidb
│   └── ...
├── Libs\                         ← 🔒 Internal-use only, shared reference DBs
│   └── pandata.aidb                  ← Master categories, business rules, etc.
├── Logs\                             ← 📜 Optional: Logging for debugging/auditing
│   └── 2025-07-09.log
├── Backups\                          ← 🧾 Optional: Timestamped backup copies
│   └── acme_corp_2025-07-01.aidb
├── Settings\                         ← ⚙️ Optional: Config/JSON for app preferences
│   └── userprefs.json
└── Temp\                             ← 🧪 Optional: Temporary or extracted data
    └── session.tmp

🖥️ Windows
✅ Default App Install Location:
If you're using a typical installer (e.g., NSIS, Inno Setup, WiX):
C:\Program Files (x86)\AiNetProfit\
C:\Program Files\AiNetProfit\

🍎 macOS
✅ Default App Install Location:
When distributed as a .app bundle and dragged into Applications folder:
/Applications/AiNetProfit.app/
├── Contents/
│   ├── MacOS/               ← 🔧 Native binary launcher
│   ├── Resources/           ← 📦 Your Electron app files (HTML, DLLs, JS, assets)
│   └── Info.plist           ← 📄 App metadata
cd /Applications/AiNetProfit.app/Contents/Resources/app/
This is the equivalent of your AppContext.BaseDirectory.

| Platform | App Install Path                             | Writable? | Purpose                      |
| -------- | -------------------------------------------- | --------- | ---------------------------- |
| Windows  | `C:\Program Files (x86)\AiNetProfit\`        | ❌ No      | Executables, DLLs, assets    |
| macOS    | `/Applications/AiNetProfit.app/`             | ❌ No      | `.app` bundle, all app files |
| Windows  | `%LocalAppData%\AiNetProfit\`                | ✅ Yes     | SQLite DBs, logs, backups    |
| macOS    | `~/Library/Application Support/AiNetProfit/` | ✅ Yes     | SQLite DBs, logs, backups    |


## ✅ Theme Colors

| Color Class   | CSS Variable       | Description            |
|---------------|--------------------|-------------------------|
| `primary`     | `--bs-primary`     | 🔵 Blue (default primary brand color) |
| `secondary`   | `--bs-secondary`   | ⚪ Gray (neutral)       |
| `success`     | `--bs-success`     | 🟢 Green (for success states) |
| `danger`      | `--bs-danger`      | 🔴 Red (for errors)     |
| `warning`     | `--bs-warning`     | 🟡 Yellow (for cautions) |
| `info`        | `--bs-info`        | 🔵 Light blue / Cyan    |
| `light`       | `--bs-light`       | ⚪ Very light gray       |
| `dark`        | `--bs-dark`        | ⚫ Very dark gray        |

---

## Database Path Notes for PathManager.GetAnyFolder("Databases")

### Windows
**Path:**
C:\Users\Owner\AppData\Local\AiNetProfit\Databases\logo.png

yaml
Copy
Edit

**Details:**
- Based on `Environment.SpecialFolder.LocalApplicationData`
- Consistent across Visual Studio and Electron.NET builds
- User-specific and persistent

---

### macOS
**Path:**
/Users/<YourUsername>/Library/Application Support/AiNetProfit/Databases

markdown
Copy
Edit

**Details:**
- Built using `~/Library/Application Support/AiNetProfit`
- Best practice location for storing app data on macOS
- User-specific and sandbox-safe


**NEW Company:**

- CompanyData.EnsureDemoDatabaseExists();

- CategoryMasterTableManager categoryMgr = new CategoryMasterTableManager();
- categoryMgr.CopyAllCategoriesToUserCategories();

- AccountManager accountMgr = new AccountManager();

- // After DB exists, fetch first account
- GlobalState.SelectedAccountID = accountMgr.GetFirstAccountId("demo_company.aidb");

- TransactionManager transactionManager = new TransactionManager();
- transactionManager.CreateTransactionsTable2();

- Accounts
- Batch
- Company
- Rules
- Transactions
- UserCategories




electronize init
electronize start

electronize build /target win


electronize build /target win /PublishSingleFile false


Modify your ElectronNET.CLI build command to include a post-build step.
Add this to your csproj:
<Target Name="PostBuild" AfterTargets="Build">
  <Exec Command="powershell -ExecutionPolicy Bypass -File $(ProjectDir)ExportInstaller.ps1" />
</Target>

# ✅ Instructions for Code Signing the EXE

Code signing ensures your installer appears **safe and verified** in Windows SmartScreen, reducing security warnings for your users.

---

## **Steps to Sign Your Installer**

### 1. **Buy or Create a Code Signing Certificate**
- Purchase from trusted Certificate Authorities:
  - [DigiCert](https://www.digicert.com)
  - [Sectigo](https://sectigo.com)
- Or create a **self-signed certificate** for internal testing:
  ```powershell
  New-SelfSignedCertificate -Type CodeSigningCert -Subject "CN=YourCompanyName" -CertStoreLocation "Cert:\LocalMachine\My"


  # ✅ Distribution and Code Signing Instructions for AiNetProfit

This guide explains how to prepare, sign, and distribute the **AiNetProfit** installer for end-users.

---

## 📂 **Where to Find Your Built Files**

After running:
```powershell
dotnet electronize build /target win


# ✅ Steps to Sign Your Installer (AiNetProfit)

Code signing ensures your installer appears **safe and verified** in Windows SmartScreen, reducing warnings for your users.

---

## ✅ 1. Buy or Create a Code Signing Certificate
- Purchase from trusted Certificate Authorities:
  - [DigiCert](https://www.digicert.com)
  - [Sectigo](https://sectigo.com)
- Or create a **self-signed certificate** for internal testing:
  ```powershell
  New-SelfSignedCertificate -Type CodeSigningCert -Subject "CN=YourCompanyName" -CertStoreLocation "Cert:\LocalMachine\My"


  signtool sign /f "C:\certs\mycert.pfx" /p "YourPassword" /tr http://timestamp.digicert.com /td SHA256 /fd SHA256 "C:\AiProjects\AiNetProfit_new\AiNetProfit\bin\Desktop\AiNetProfit Setup 1.0.0.exe"





  electronize build /target win /PublishSingleFile false

  <YourProjectRoot>/bin/Desktop/
    └── YourApp-win32-x64/
          ├── YourApp.exe      ← Main executable
          ├── *.dll            ← Your .NET assemblies
          ├── locales/
          ├── resources/
          ├── node_modules/
          ├── Electron runtime files


if (some condution on Mac OR Windows)
{
    Directory.CreateDirectory(appRoot); // ensure root exists for writable folders

    try
    {
        var pm = new PathManager();
        var dbPath = Path.Combine(pm.GetWritableFolder("Databases"), "rssfeeds.aidb");
        var dir = Path.GetDirectoryName(dbPath)!;
        if (!Directory.Exists(dir))
            Directory.CreateDirectory(dir);

        var srcLibs = ResolveLibsFolder(exeDir);
        if (srcLibs == null)
        {
            var msgNoLibs = $"Unable to locate 'Libs' folder.\nSearched around:\n{exeDir}\n\nEnsure a 'Libs' folder exists with required files (techarchive.aidb, rssfeeds.aidb).";
            Log.Error(msgNoLibs);
            ErrorDialog.Show("Startup Copy Error", msgNoLibs);
            return;
        }

        var dstLibs = pm.GetWritableFolder("Libs");
        var dstDatabases = pm.GetWritableFolder("Databases");

        if (!Directory.Exists(dstLibs)) Directory.CreateDirectory(dstLibs);
        if (!Directory.Exists(dstDatabases)) Directory.CreateDirectory(dstDatabases);

        var srcAidb = Path.Combine(srcLibs, "rssfeeds.aidb");
        var dstAidb = Path.Combine(dstDatabases, "rssfeeds.aidb");
        if (File.Exists(srcAidb) && !File.Exists(dstAidb)) File.Copy(srcAidb, dstAidb, overwrite: false);

        // Final verification: ensure rssfeeds.aidb exist after copy attempt
        var missing = new StringBuilder();
        if (!File.Exists(Path.Combine(dstDatabases, "rssfeeds.aidb"))) missing.AppendLine("rssfeeds.aidb");

        if (missing.Length > 0)
        {
            var msg = $"Database file(s) missing after copy attempt in:\n{dstDatabases}\n\nMissing:\n{missing}\n" +
                        $"Source Libs: {srcLibs}";
            return;
        }
    }
    catch (Exception copyEx)
    {
        return;
    }
}


AiNetProfitConfig.aidb-shm
AiNetProfitConfig.aidb-wal
