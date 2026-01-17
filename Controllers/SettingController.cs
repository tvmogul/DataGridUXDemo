using DataGridUXDemo.Helpers;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Data.Sqlite;
using Microsoft.Win32;
using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Media;
using System.Runtime.InteropServices;
using System.Runtime.Versioning;
using System.Security.Principal;
using System.Threading.Tasks;

[Route("Settings/[action]")]
public class SettingController : Controller
{
    private static readonly string AppID = "NP1732";
    private static readonly string ConnectionString = "Data Source=162.214.202.56;Initial Catalog=Software;User ID=rssfeeds;Password=Besom137$;Integrated Security=False;MultipleActiveResultSets=True;TrustServerCertificate=True;";

    bool bRequire = false;
    public string? ExceptionMessage;

    private readonly IServer _server;
    private readonly IConfiguration _config;
    private readonly IWebHostEnvironment _env;
    //private readonly Serilog.ILogger _logger;
    private readonly IHttpContextAccessor _httpContextAccessor;
    //private readonly YouTubeAdsService _youTubeAdsService;
    //private readonly YourServiceWithGetYouTubeAds _youTubeAdsLoader;

    public SettingController(
        IServer server,
        IConfiguration config,
        IWebHostEnvironment env,
        //Serilog.ILogger logger,
        IHttpContextAccessor httpContextAccessor)
    {
        _server = server;
        _config = config;
        _env = env;
        //_logger = logger;
        _httpContextAccessor = httpContextAccessor;
    }

    [HttpPost]
    public IActionResult SaveSelectedDatabase(string databaseName)
    {
        if (string.IsNullOrWhiteSpace(databaseName))
        {
            return BadRequest("databaseName is required.");
        }

        try
        {
            // 🔥 DIRECT write into SQLite Settings table, no GlobalState, no extra logic
            AppSettings.Set("SelectedDatabase", databaseName);

            return Ok(new { success = true });
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Error saving SelectedDatabase: " + ex.Message);
        }
    }

    [HttpGet]
    public IActionResult GetSelectedDatabase()
    {
        try
        {
            var pm = new PathManager();

            // 1) Open pandata.aidb in Libs
            var libsFolder = pm.GetWritableFolder("Libs");
            var settingsPath = Path.Combine(libsFolder, "pandata.aidb");
            if (!System.IO.File.Exists(settingsPath))
                return NotFound("Settings database (pandata.aidb) not found.");

            string? dbFileName = null;

            using (var conn = new SqliteConnection($"Data Source={settingsPath};"))
            {
                conn.Open();

                // 🔥 THIS IS THE SQL YOU ASKED FOR
                using var cmd = conn.CreateCommand();
                cmd.CommandText = "SELECT Value FROM Settings WHERE Key = 'SelectedDatabase' LIMIT 1;";
                dbFileName = cmd.ExecuteScalar() as string;
            }

            if (string.IsNullOrWhiteSpace(dbFileName))
                return NotFound("SelectedDatabase setting not found in Settings table.");

            // sanitize just in case
            dbFileName = Path.GetFileName(dbFileName);

            // 2) Now open the actual selected company DB from Databases folder
            var dbFolder = pm.GetWritableFolder("Databases");
            var dbPath = Path.Combine(dbFolder, dbFileName);
            if (!System.IO.File.Exists(dbPath))
                return NotFound($"Database file '{dbFileName}' not found in Databases folder.");

            string? companyName = null;
            using (var connDb = new SqliteConnection($"Data Source={dbPath};"))
            {
                connDb.Open();

                // 🔥 SECOND SQL QUERY: get CompanyName
                using var cmd2 = connDb.CreateCommand();
                cmd2.CommandText = "SELECT CompanyName FROM Company LIMIT 1;";
                companyName = cmd2.ExecuteScalar()?.ToString();
            }

            // 3) Return JSON to the AJAX caller
            return Ok(new
            {
                selected = dbFileName,
                company = companyName
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Database query failed: {ex.Message}");
        }
    }

    [IgnoreAntiforgeryToken]
    [HttpGet, HttpPost]
    public IActionResult RunHardeningInstaller()
    {
        // Windows-only guard
        if (!RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
            return BadRequest("This hardening action is Windows-only. No changes were made on this OS.");

        try
        {
            // Resolve installer ONLY via PathManager under the app's install root.
            // Do NOT probe random Program Files paths to avoid launching makensis.exe by mistake.
            var pm = new PathManager();
            var exePath = pm.GetInstallationFolder(Path.Combine("Libs", "SecurityHardeningSetup.exe"));

            // Fallback to your known dev drop if not found in app Libs (kept as a fallback only).
            if (string.IsNullOrWhiteSpace(exePath) || !System.IO.File.Exists(exePath))
            {
                var devDrop = @"C:\AiProjects\AiNetProfit\Libs\SecurityHardeningSetup.exe";
                if (System.IO.File.Exists(devDrop)) exePath = devDrop;
            }

            if (string.IsNullOrWhiteSpace(exePath) || !System.IO.File.Exists(exePath))
            {
                return BadRequest($"Hardening installer not found. Expected at:\n" +
                                  $" - {pm.GetInstallationFolder(Path.Combine("Libs", "SecurityHardeningSetup.exe"))}\n" +
                                  $" - C:\\AiProjects\\AiNetProfit\\Libs\\SecurityHardeningSetup.exe");
            }

            // Extra safety: ensure we are launching the correct binary and not a compiler
            var fileName = Path.GetFileName(exePath);
            if (!fileName.Equals("SecurityHardeningSetup.exe", StringComparison.OrdinalIgnoreCase))
                return BadRequest("Refusing to launch unexpected executable. Expected 'SecurityHardeningSetup.exe'.");

            // Attempt 1: ShellExecute + runas (UAC prompt, no silent arguments as requested)
            try
            {
                var psi = new ProcessStartInfo
                {
                    FileName = exePath,
                    UseShellExecute = true,    // required for Verb=runas
                    Verb = "runas",            // triggers UAC elevation
                    WorkingDirectory = Path.GetDirectoryName(exePath)
                };
                Process.Start(psi);
                return Ok(new { message = $"Hardening installer launched: {exePath}. If prompted, approve the UAC dialog." });
            }
            catch (System.ComponentModel.Win32Exception w32ex)
            {
                // 1223 = ERROR_CANCELLED (user declined UAC)
                if (w32ex.NativeErrorCode == 1223)
                    return BadRequest("Launch canceled at UAC prompt. Please approve the elevation dialog to continue.");

                // Try a robust fallback using PowerShell's Start-Process -Verb RunAs
                try
                {
                    var pwsh = new ProcessStartInfo
                    {
                        FileName = "powershell.exe",
                        Arguments = $"Start-Process -FilePath \"{exePath}\" -Verb RunAs",
                        UseShellExecute = false,
                        CreateNoWindow = true,
                        WorkingDirectory = Path.GetDirectoryName(exePath)
                    };
                    Process.Start(pwsh);
                    return Ok(new { message = $"Hardening installer launched via PowerShell: {exePath}. Approve the UAC prompt to continue." });
                }
                catch (Exception psEx)
                {
                    return BadRequest("Failed to launch installer (ShellExecute & PowerShell). Error: " + psEx.Message);
                }
            }
        }
        catch (Exception ex)
        {
            return BadRequest("Error launching hardening installer: " + ex.Message);
        }
    }

    public IActionResult LaunchHelp()
    {
        BrowserHelper.OpenUrlInChromeOrDefault("https://ainetprofit.com/Manual#settings");
        return Ok();
    }

    //public IActionResult Index()
    //{
    //    var sounds = new List<SelectListItem>();

    //    try
    //    {
    //        var pathManager = new PathManager();
    //        var dbFolder = pathManager.GetInstallationFolder("wwwroot");
    //        var soundsDir = Path.Combine(dbFolder, "sounds");
    //        if (Directory.Exists(soundsDir))
    //        {
    //            var files = Directory.GetFiles(soundsDir, "*.wav");
    //            foreach (var file in files)
    //            {
    //                var name = Path.GetFileNameWithoutExtension(file);
    //            sounds.Add(new SelectListItem(name, name));
    //            }
    //        }
    //    }
    //    catch (Exception ex)
    //    {
    //        Debug.WriteLine("Error loading .wav sounds from wwwroot/sounds: " + ex.Message);
    //    }

    //    ViewBag.Sounds = sounds;
    //    return View();
    //}

    public IActionResult Index()
    {
        //var sounds = new List<SelectListItem>();

        //try
        //{
        //    string[] defaultSoundDirs;

        //    if (OperatingSystem.IsWindows())
        //    {
        //        var windowsMediaDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "Media");
        //        defaultSoundDirs = new[] { windowsMediaDir };
        //    }
        //    else if (OperatingSystem.IsMacOS())
        //    {
        //        defaultSoundDirs = new[]
        //        {
        //        "/System/Library/Sounds",
        //        "/Library/Sounds"
        //    };
        //    }
        //    else
        //    {
        //        defaultSoundDirs = Array.Empty<string>();
        //    }

        //    foreach (var dir in defaultSoundDirs)
        //    {
        //        if (Directory.Exists(dir))
        //        {
        //            var files = Directory.GetFiles(dir, "*.*")
        //                                 .Where(f => f.EndsWith(".wav", StringComparison.OrdinalIgnoreCase)
        //                                          || f.EndsWith(".aif", StringComparison.OrdinalIgnoreCase)
        //                                          || f.EndsWith(".aiff", StringComparison.OrdinalIgnoreCase));
        //            foreach (var file in files)
        //            {
        //                var name = Path.GetFileNameWithoutExtension(file);
        //                sounds.Add(new SelectListItem(name, file)); // Store full path as value
        //            }
        //        }
        //    }
        //}
        //catch (Exception ex)
        //{
        //    Debug.WriteLine("Error loading system sounds: " + ex.Message);
        //}

        //ViewBag.Sounds = sounds;

        PathManager path = new PathManager();
        string dbFolder = path.GetWritableFolder("Databases");

        List<string> dbFiles = Directory
            .GetFiles(dbFolder, "*.aidb", SearchOption.TopDirectoryOnly)
            .ToList();

        return View(dbFiles);

    }


    [HttpPost]
    public IActionResult PlaySound([FromBody] SoundRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.SoundKey))
        {
            return BadRequest("SoundKey is missing.");
        }

        var soundPath = GetSystemSoundPath(request.SoundKey);
        if (!string.IsNullOrEmpty(soundPath) && System.IO.File.Exists(soundPath))
        {
            var pathManager = new PathManager();
            var dbFolder = pathManager.GetInstallationFolder("wwwroot");
            var publicDir = Path.Combine(dbFolder, "sounds");

            var fileName = Path.GetFileName(soundPath);
            var destPath = Path.Combine(publicDir, fileName);

            try
            {
                if (!System.IO.Directory.Exists(publicDir))
                    System.IO.Directory.CreateDirectory(publicDir);

                if (!System.IO.File.Exists(destPath))
                    System.IO.File.Copy(soundPath, destPath);

                var urlPath = $"/sounds/{fileName}";
                return Json(new { path = urlPath });
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Error copying sound file: " + ex.Message);
                return BadRequest("Failed to prepare sound for playback.");
            }
        }

        return BadRequest("Sound not found.");
    }

    private string? GetSystemSoundPath(string soundEventKey)
    {
        if (string.IsNullOrWhiteSpace(soundEventKey))
            return null;

        var pathManager = new PathManager();
        var dbFolder = pathManager.GetInstallationFolder("wwwroot");
        var publicDir = Path.Combine(dbFolder, "sounds");

        var wavPath = Path.Combine(publicDir, $"{soundEventKey}.wav");
        return System.IO.File.Exists(wavPath) ? wavPath : null;
    }

    private void PlaySystemSound(string path)
    {
        if (OperatingSystem.IsWindows())
        {
            var player = new SoundPlayer(path);
            player.Play();
        }
        else if (OperatingSystem.IsMacOS())
        {
            Process.Start("afplay", $"\"{path}\"");
        }
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View();
    }

    public class SoundRequest
    {
        public string SoundKey { get; set; } = string.Empty;
    }
}
