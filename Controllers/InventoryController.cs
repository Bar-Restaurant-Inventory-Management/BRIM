using System.Collections.Generic;
using System.Linq;
using System;
using Microsoft.AspNetCore.Mvc;
using BRIM.BackendClassLibrary;
using Microsoft.Extensions.Logging;

namespace BRIM 
{
	public class InventoryController: Controller
	{
		private readonly ILogger<InventoryController> _logger;
		private IInventoryManager _inventory;
		


		public InventoryController(ILogger<InventoryController> logger,IInventoryManager inventory)
		{
			_logger = logger;
			_logger.LogInformation("In inventory");
			_inventory = inventory;
			//initialize the inventory
			_inventory.GetItemList();

		}
		public ActionResult Index(){
			return View(new ItemViewModel{
				Items = _inventory.ItemList.ToList()
			});
		}
		
		public ActionResult Items(){
			_logger.LogInformation("Content type"+ ControllerContext.HttpContext.Request.ContentType, DateTimeOffset.Now);
			if (ControllerContext.HttpContext.Request.ContentType == "application/json")
			{
				List<Drink> items = _inventory.ItemList.Select(p=>(Drink)p).ToList();
				return new JsonResult(new
				{
					Items= items.AsReadOnly()
				});
			}
			return View("~/Views/Home/Index.cshtml",new ItemViewModel{
				Items = _inventory.ItemList.Select(p=>(Drink)p).ToList().AsReadOnly()
			});	
		}
		
		public ActionResult SubmitItem([FromBody]DrinkSubmissionModel item){
			Drink dr;
			if(item.id==-1){

				dr = new Drink();
				//set the id to the next highest one
				dr.ID =  _inventory.ItemList.Select(p=> p.ID).Max()+1;
			}else{
				dr=(Drink)_inventory.ItemList.Where(p=>p.ID == item.id).ToList().First();
			}
			dr.Name = item.name;
			dr.Brand = item.brand;
			dr.Estimate = Convert.ToDouble(item.estimate);
			dr.Measurement= (unit) item.units;
			dr.Price = Convert.ToDouble(item.price);
			dr.IdealLevel = Convert.ToDouble(item.ideal);
			dr.ParLevel = Convert.ToDouble(item.par);
			dr.BottleSize = Convert.ToInt32(item.size);
			dr.UnitsPerCase = Convert.ToInt32(item.upc);
			dr.Tags = 
			(from i in _inventory.TagList
			join t in item.tags
			on i.ID equals t.ID
			select i).ToList();	
			
			if (item.vintage !=0) {
				dr.Vintage = Convert.ToInt32(item.vintage);
			}else{
				dr.Vintage = null;
			}
			dr.CalculateStatus();
			if(item.id == -1){
				_inventory.AddItem(dr);
			}else{
				_inventory.UpdateItem(dr);
			}
			return Content("Success");
		}
		
		
		public class ItemViewModel
		{
			public IReadOnlyList<Item> Items { get; set; }

		}

	}
}
