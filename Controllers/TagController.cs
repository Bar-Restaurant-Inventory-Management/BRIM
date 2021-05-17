using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using BRIM.BackendClassLibrary;

namespace BRIM
{
	public class TagController : Controller
	{
		private IInventoryManager _inventory;
		public TagController(IInventoryManager inventory){
			_inventory=inventory;
			_inventory.GetTagList();	
		}

		public ActionResult GetTags()
		{
			return new JsonResult(new{
				tags=_inventory.TagList.AsReadOnly()
			});
		}
		public ActionResult AddTag(Tag tag)
		{
			_inventory.AddTag(tag.Name);
			return Content("success");
		}
		public ActionResult DelTag(Tag tag)
		{
			_inventory.RemoveTag(tag.ID);
			return Content("success");
		}
		public class TagListModel
		{
			public IReadOnlyList<Tag> tags{get;set;}
		}
	}
}