using DataGridUXDemo.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace DataGridUXDemo.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Index2()
        {
            return View();
        }

        public IActionResult Legal()
        {
            return View();
        }

        public IActionResult Mobile()
        {
            return View();
        }
        public IActionResult Desktop()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
