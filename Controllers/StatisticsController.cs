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

        public StatisticsController(ILogger<InventoryController> logger, IInventoryManager inventory)
        {
            _logger = logger;
            _logger.LogInformation("In inventory");
            _inventory = inventory;
            //initialize the inventory
            _inventory.GetItemList();
        }
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
            DateTime endDate = DateTime.Today;
            DateTime startDate = DateTime.Today.AddDays(-3);

            List<DrinkStat> statList = _inventory.GetAllDrinkStats(startDate, endDate);

            var statJson = statList.Select( p => new
            {
                ID = p.ID,
                date = p.date,
                quantity = p.quantity,
            }).ToList();

            foreach (DrinkStat drink in statList)
            {
                Console.WriteLine("drink ID: {0}, drink quantity: {1}, drink date: {2}", drink.ID, drink.quantity, drink.date);
            }

            return new JsonResult(new
            {
                stats = statJson.AsReadOnly()
            });

        }
    }
}
