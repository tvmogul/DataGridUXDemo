using System;
using System.Diagnostics;
using System.Runtime.InteropServices;

namespace DataGridUXDemo.Helpers
{
    public static class BrowserHelper
    {
        // ✅ Prevent duplicate launches within a short time window
        private static readonly object _launchLock = new object();
        private static DateTime _lastLaunchUtc = DateTime.MinValue;

        public static void OpenUrlInChromeOrDefault(string url)
        {
            try
            {
                // ✅ Suppress duplicate calls within 2 seconds
                lock (_launchLock)
                {
                    var now = DateTime.UtcNow;
                    if ((now - _lastLaunchUtc).TotalSeconds < 2)
                    {
                        Debug.WriteLine("BrowserHelper: Suppressed duplicate browser launch.");
                        return;
                    }
                    _lastLaunchUtc = now;
                }

                if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
                {
                    // ✅ Open exactly once with the default browser on Windows
                    Process.Start(new ProcessStartInfo
                    {
                        FileName = url,
                        UseShellExecute = true
                    });
                }
                else if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX))
                {
                    // macOS: open with default browser
                    Process.Start("open", url);
                }
                else
                {
                    // Linux / others
                    Process.Start("xdg-open", url);
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error opening URL: {ex.Message}");
            }
        }

        // (Optional) If you later want Chrome-specific behavior again,
        // you can reintroduce GetChromePathWindows and Chrome logic here,
        // and still keep the duplicate-suppression code above.
        private static string GetChromePathWindows()
        {
            string[] registryKeys =
            {
                @"SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe",
                @"SOFTWARE\Wow6432Node\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe"
            };

            foreach (string key in registryKeys)
            {
                using var regKey = Microsoft.Win32.Registry.LocalMachine.OpenSubKey(key);
                if (regKey?.GetValue(null) is string path)
                    return path;
            }

            return string.Empty;
        }
    }
}
