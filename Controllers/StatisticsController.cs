using System.Collections.Generic;
using System.Linq;
using System;
using Microsoft.AspNetCore.Mvc;
using BRIM.BackendClassLibrary;
using Microsoft.Extensions.Logging;

namespace BRIM
{
    public class StatisticsController : Controller
    {
        private readonly ILogger<InventoryController> _logger;
        private IInventoryManager _inventory;
        /*
                public ActionResult GetDrinkStatsByDate([FromBody] DrinkSubmissionModel item, DateTime startDate, DateTime endDate)
                {
                    Drink dr;
                    dr = new Drink();

                    dr.ID = item.id;

                    List<DrinkStat> statList = _inventory.GetDrinkStatsByDate(dr, startDate, endDate);

                    return new JsonResult(new
                    {
                        stats = statList.AsReadOnly()
                    });
                }*/

        public ActionResult GetDrinkStatsByDate()
        {
            return new JsonResult(new
            {
                test = "working"
            });
        }
    }
}
