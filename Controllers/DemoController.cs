using Microsoft.AspNetCore.Mvc;

namespace DataGridUXDemo.Controllers
{
    public class DemoController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
