using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System;
namespace BRIM.BackendClassLibrary
{
	public interface IInventoryManager
	{
		List<Item> ItemList{get;set;}
		List<Recipe> RecipeList{get;set;}
		List<Tag> TagList{get;set;}
		void ReplaceDBManager(IDatabaseManager dbm);
		int AddItem(Item item);
		int UpdateItem(Item item);
		int RemoveItem(Item item);
		int PurchaseItem(Recipe recipe);
		void parseAPIPOSUpdate(JObject message);
		int GetItemList();
		int GetTagList();
		int AddTag(string name);
		int RemoveTag(int tagID);
		int GetRecipeList();
		int AddRecipe(Recipe recipe);
		int UpdateRecipe(Recipe recipe);
		int RemoveRecipe(Recipe recipe);
		List<DrinkStat> GetDrinkStats(Drink drink);
		List<DrinkStat> GetDrinkStatsByDate(Drink drink,DateTime start,DateTime end);
		List<DrinkStat> GetAllDrinkStats(DateTime start,DateTime end);
		List<RecipeStat> GetRecipeStats(Recipe recipe);
		List<RecipeStat> GetRecipeStatsByDate(Recipe recipe,DateTime start,DateTime end);
		List<RecipeStat> GetAllRecipeStats(DateTime start,DateTime end);


	}
}