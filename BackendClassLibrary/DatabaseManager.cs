using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace BRIM.BackendClassLibrary
{
    public class DatabaseManager : IDatabaseManager
    {
        //Should probably move this somewhere more secure eventually
        private static string connString = @"SERVER=68.84.78.85; PORT=3306; DATABASE=brim; UID=dev; PASSWORD=devpassword; convert zero datetime=True";
        private MySqlConnection conn = new MySqlConnection(connString);

        //runs any given Select Query on the Database and returns the results in a DataTable
        //Should only be used by other public methods within the Helper (unless you guys thing other wise)
        private DataTable runSelectQuery(string query) 
        {
            DataTable dt = new DataTable();
            MySqlCommand cmd = new MySqlCommand(query, conn);
            MySqlDataAdapter adapter = new MySqlDataAdapter(cmd);
            int rowsReturned;

            //Is there a reason we open and close for every query instead of just keeping it open?
            //beats me, but I'll ask the others later
            try {
                conn.Open();
                rowsReturned = adapter.Fill(dt);
                conn.Close();
            } catch (MySqlException ex) {
                Console.WriteLine("MYSQL ERROR OCCURED! ERROR MESSAGE: " + ex.Message);
                rowsReturned = 0;
            }

            if (rowsReturned == 0)
            {
                Console.WriteLine("The database query returned no data");
            }
            return dt;
        }

        // Runs the given insert, update, or delete statement to add affect the database, 
        //returns true if Command successful executes, otherwise returns false
        private bool runSqlInsertUpdateOrDeleteCommand(string query)
        {
            int rowsAffected;
            try {
                MySqlCommand cmd = new MySqlCommand(query, conn);
                conn.Open();
                rowsAffected = cmd.ExecuteNonQuery();
                conn.Close();
            } catch (MySqlException ex) {
                Console.WriteLine("MYSQL ERROR OCCURED! ERROR MESSAGE: " + ex.Message);
                return false;
            }
            
            if (rowsAffected == 0) {
                Console.WriteLine("The Command was Valid, but no Rows where affected: ");
            } else if (rowsAffected < 0){
                Console.WriteLine("The Given Query was not for an Update, or Delete Command: ");
                return false;
            }
            return true;
        }

        // Runs the given insert statement to affect the database, 
        // returns the value given to the Auto-incremented Colmun of the last insert made
        // assuming to multi-threading shenanigans happen, that should be the ID of the entry
        // this method just inserted
        // IF the command fails, returns -1 
        // NOTE: while this code CAN technically Run DELETE and UPDATE Commands, the return value will only
        // be relevant for Insert Commands
        private int runSqlInsertCommandReturnID(string query)
        {
            int rowsAffected, newValueID;
            try {
                MySqlCommand cmd = new MySqlCommand(query, conn);
                conn.Open();
                rowsAffected = cmd.ExecuteNonQuery();
                //WARNING, This method of getting the ID is the t but is NOT entirely thread safe
                newValueID = (int) (cmd.LastInsertedId);
                conn.Close();
            } catch (MySqlException ex) {
                Console.WriteLine("MYSQL ERROR OCCURED! ERROR MESSAGE: " + ex.Message);
                return -1;
            }
            
            if (rowsAffected < 0){
                Console.WriteLine("The Given Query was not for an Insert, Update, or Delete Command: ");
                return -1;
            }
            return newValueID;
        }


        //Creates then runs a delete query
        public bool deleteDrink(Drink drink)
        {
            int drinkID = drink.ID;
            string query = @"delete from brim.drinktags where drinkID = '" + drinkID + "'";
            bool result = this.runSqlInsertUpdateOrDeleteCommand(query);

            if (!result)
            {
                Console.WriteLine("Error: Associated DrinkTags for removed drink could not be deleted");

                return false;
            }

            query = @"delete from brim.drinks where drinkID = '" + drink.ID + "'";
            result = this.runSqlInsertUpdateOrDeleteCommand(query);

            if (!result)
            {
                Console.WriteLine("Error: Drink could not be deleted");

                return false;
            }

            return true;
        }

        //Creates then runs an insert query
        public bool addDrink(Drink drink)
        {
            int rowsAffected, newDrinkID;
            using (MySqlCommand cmd = new MySqlCommand(@"insert into brim.drinks (name, estimate, measurementUnit, parLevel, idealLevel, bottleSize, brand, bottlesPerCase, vintage) values 
                                                    (@Name, @Estimate, @Measurement, @ParLevel, @IdealLevel, @BottleSize, @Brand, @BottlesPerCase, @Vintage)", conn))
            {
                try
                {
                    cmd.Parameters.AddWithValue("@Name", drink.Name);
                    cmd.Parameters.AddWithValue("@Estimate", drink.Estimate);
                    cmd.Parameters.AddWithValue("@Measurement", drink.Measurement);
                    cmd.Parameters.AddWithValue("@ParLevel", drink.ParLevel);
                    cmd.Parameters.AddWithValue("@IdealLevel", drink.IdealLevel);
                    cmd.Parameters.AddWithValue("@BottleSize", drink.BottleSize);
                    cmd.Parameters.AddWithValue("@Brand", drink.Brand);
                    cmd.Parameters.AddWithValue("@BottlesPerCase", drink.BottleSize);
                    if (drink.Vintage != null)
                    {
                        cmd.Parameters.AddWithValue("@Vintage", drink.Vintage);
                    }
                    else
                    {
                        cmd.Parameters.AddWithValue("@Vintage", DBNull.Value);
                    }
                    conn.Open();
                    rowsAffected = cmd.ExecuteNonQuery();
                    newDrinkID = (int)(cmd.LastInsertedId);
                    conn.Close();
                } catch(MySqlException ex)
                {
                    Console.WriteLine("MYSQL ERROR OCCURED! ERROR MESSAGE: " + ex.Message);
                    return false;
                }
            }
            
            if (newDrinkID == -1)
            {
                Console.WriteLine("Error: Drink could not be added");
                return false;
            }

            //Find the tag ids in the dtaabse and add them to this drink in drinkTable
            foreach (Tag T in drink.Tags)
            {
                string tagQuery = @"insert into brim.drinktags (drinkID, tagID) values ('" + drink.ID + "', '" + T.ID + "')";
                int newTagID = this.runSqlInsertCommandReturnID(tagQuery);

                if (newTagID == -1)
                {
                    Console.WriteLine("Error: Tag could not be added");
                    return false;
                }
            }

            return true;
        }

        //Creates then runs an update query
        public bool updateDrink(Drink drink)
        {
            int rowsAffected;
            using (MySqlCommand cmd = new MySqlCommand(@"update brim.drinks set name = @Name, estimate = @Estimate, measurementUnit = @Measurement, parLevel = @ParLevel, 
                                                            idealLevel = @IdealLevel, bottleSize = @BottleSize, brand = @Brand, bottlesPerCase = @BottlesPerCase, vintage = @Vintage 
                                                            where drinkID = @DrinkID", conn))
            {
                try
                {
                    cmd.Parameters.AddWithValue("@Name", drink.Name);
                    cmd.Parameters.AddWithValue("@Estimate", drink.Estimate);
                    cmd.Parameters.AddWithValue("@Measurement", drink.Measurement);
                    cmd.Parameters.AddWithValue("@ParLevel", drink.ParLevel);
                    cmd.Parameters.AddWithValue("@IdealLevel", drink.IdealLevel);
                    cmd.Parameters.AddWithValue("@BottleSize", drink.BottleSize);
                    cmd.Parameters.AddWithValue("@Brand", drink.Brand);
                    cmd.Parameters.AddWithValue("@BottlesPerCase", drink.BottleSize);
                    if (drink.Vintage != null)
                    {
                        cmd.Parameters.AddWithValue("@Vintage", drink.Vintage);
                    }
                    else
                    {
                        cmd.Parameters.AddWithValue("@Vintage", DBNull.Value);
                    }
                    cmd.Parameters.AddWithValue("@DrinkID", drink.ID);
                    conn.Open();
                    rowsAffected = cmd.ExecuteNonQuery();
                    conn.Close();
                }
                catch (MySqlException ex)
                {
                    Console.WriteLine("MYSQL ERROR OCCURED! ERROR MESSAGE: " + ex.Message);
                    return false;
                }
            }

            if (rowsAffected == 0)
            {
                Console.WriteLine("The Command was Valid, but no Rows where affected: ");
            }
            else if (rowsAffected < 0)
            {
                Console.WriteLine("The Given Query was not for an Update, or Delete Command: ");
                Console.WriteLine("Error: Drink could not be updated");
                return false;
            }

            return true;
        }

        //Querys the database for all entries in the drinks table and returns them as a list
        public List<Item> getDrinks()
        {
            List<Item> newDrinkList = new List<Item>();
            string queryString = @"select * from brim.drinks";

            DataTable dt = this.runSelectQuery(queryString);

            foreach(DataRow dr in dt.Rows) {
                Drink tempDrink = new Drink(dr);

                queryString = @"SELECT T.ID, T.name FROM BRIM.tags T, BRIM.drinktags DT, BRIM.drinks D WHERE DT.drinkID = '" + tempDrink.ID + "' AND DT.tagID = T.ID";
                DataTable drinkTags = this.runSelectQuery(queryString);

                foreach (DataRow tagRow in drinkTags.Rows)
                {
                    tempDrink.Tags.Add(new Tag(tagRow.Field<int>("ID"), tagRow.Field<string>("name")));
                }

                newDrinkList.Add(tempDrink);
            }
            return newDrinkList;
        }

        public List<Tag> getTags()
        {
            List<Tag> newTagList = new List<Tag>();
            string queryString = @"select * from brim.tags";

            DataTable dt = this.runSelectQuery(queryString);

            foreach(DataRow dr in dt.Rows)
            {
                Tag tempTag = new Tag(dr);

                newTagList.Add(tempTag);
            }

            return newTagList;
        }

        //Creates then runs a delete query for entry IN RECIPES TABLE ONLY
        //NOTE: DO NOT ATTEMPT TO USE THIS BEFORE DELETING ALL CONNECTED ENTRIES IN DRINKRECIPE TABLE 
        public bool deleteRecipe(int recipeID)
        {
            string query = @"delete from brim.recipes where recipeID = '" + recipeID + "';";
            bool result = this.runSqlInsertUpdateOrDeleteCommand(query);

            if (!result)
            {
                Console.WriteLine("Error: Recipe Entry could not be deleted");
                return false;
            }

            return true;
        }

        //Delete all entries in the drinkTags Table with a certain drinkID
        public bool deleteDrinkTagsByDrinkID(int drinkID)
        {
            string query = @"delete from brim.drinktags where drinkID = '" + drinkID +"';";
            bool result = this.runSqlInsertUpdateOrDeleteCommand(query);

            if (!result)
            {
                Console.WriteLine("Error: DrinkTag Entries could not be deleted");
                return false;
            }

            return true;
        }

        //Deletes all entries in the drinkRecipes Table with a certain recipeID
        public bool deleteDrinkRecipesByRecipeID(int recipeID)
        {
            string query = @"delete from brim.drinkrecipes where recipeID = '" + recipeID + "';";
            bool result = this.runSqlInsertUpdateOrDeleteCommand(query);

            if (!result)
            {
                Console.WriteLine("Error: DrinkRecipe Entries could not be deleted");
                return false;
            }

            return true;
        }

        //Creates then runs an insert query FOR JUST THE RECIPES TABLE
        //returns the ID of the newly Inserted Recipe
        public int addRecipe(string name, string baseLiquor)
        {
            string query = @"INSERT INTO brim.recipes (name, baseLiquor) VALUES ('" + name + "', '" + baseLiquor + "');";
            int newRecipeID = this.runSqlInsertCommandReturnID(query);

            if (newRecipeID == -1)
            {
                Console.WriteLine("Error: Recipe Entry Could not be Added");
            }
            return newRecipeID;
        }

        //Creates then runs an insert query FOR JUST THE DRINKRECIPES TABLE
        //ASSUMES THAT RECIPE AND DRINK IDS ARE VALID. AKA THAT THEY BELONG TO DRINKS AND RECIPES THAT EXIST 
        public int addDrinkRecipe(int recipeID, int drinkID, double itemQuantity) 
        {
            string query = @"INSERT INTO brim.drinkrecipes (itemQuantity, recipeID, drinkID) "
                + "VALUES ('" + itemQuantity + "', '" + recipeID + "', '" + drinkID + "');";
            int newDrinkRecipeID = this.runSqlInsertCommandReturnID(query);

            if (newDrinkRecipeID == -1)
            {
                Console.WriteLine("Error: DrinkRecipe Entry Could not be Added");
            }
            return newDrinkRecipeID;
        }

        //Creates and runs an insert query for just the DrinkTags table
        //Assumes that the drink and tag IDs are valid
        public bool addDrinkTag(int drinkID, int tagID)
        {
            string query = @"INSERT INTO brim.drinktags (drinkID, tagID) VALUES ('" + drinkID +"', '" + tagID +"');";
            bool result = this.runSqlInsertUpdateOrDeleteCommand(query);

            if (!result)
            {
                Console.WriteLine("Error: COuld not add tag to database");
                return false;
            }

            return true;
        }

        //Creates and runs an insert query for just the tags table
        //returns the ID of the tag after it is added
        public int addTag(string name)
        {
            string query = @"insert into brim.tags (name) values ('" + name + "');";
            int result = this.runSqlInsertCommandReturnID(query);

            if (result == -1)
            {
                Console.WriteLine("Error: Tag could not be added");
                return -1;
            }

            return result;
        }

        //Deletes a tag from the tags table by ID
        public bool deleteTag(int ID)
        {
            string query = @"delete from brim.drinktags where tagID = '" + ID + "'";
            bool result = this.runSqlInsertUpdateOrDeleteCommand(query);

            if (!result)
            {
                Console.WriteLine("Error: Associated DrinkTags for removed Tag could not be deleted");

                return false;
            }

            query = @"delete from brim.tags where ID = '" + ID + "';";
            result = this.runSqlInsertUpdateOrDeleteCommand(query);

            if (!result)
            {
                Console.WriteLine("Error: Tag entry could not be deleted");
                return false;
            }

            return true;
        }

        // Creates then runs an UPDATE query FOR ONLY THE ENTRY IN THE RECIPES TABLE
        // only sends the ID, name, and baseLiquor since RecipeObjects can get large from the itemList
        // even though Entries is Recipes Table itself only have column that will really be modified
        public bool updateRecipe(int recipeID, string name, string baseLiquor)
        {
            string query = @"UPDATE brim.recipes SET name = '" + name + "', baseLiquor = '" + baseLiquor + "'"
                + " WHERE recipeID = '" + recipeID + "';";
            bool result = this.runSqlInsertUpdateOrDeleteCommand(query);

            if (!result)
            {
                Console.WriteLine("Error: Recipe Entry Could not be Updated");
            }
            return result;
        }

        /* IMPORTANT!: DrinkRecipe Table Updates for am existing Recipe will be handled by Deleting and 
        all DrinkRecipe Entries related to that table and re-adding/replacing the entries with entire ItemList
        of the updated Recipe Object, for Simplicity's sake. */

        // Querys the database for all entries in the drinkrecipes, and the pertinent information  
        // of their respectively referenced Recipe and Drink entries
        public List<Recipe> getRecipes()
        {
            List<Recipe> newRecipeList = new List<Recipe>();
            //Want to talk to Alex about what he's expecting to send and get front end from recipes
            //because most of this drink information really shouldn't be neccesary for looking at, or updating, 
            //recipe components
            string queryString = @"SELECT brim.recipes.name AS recipeName, brim.recipes.baseLiquor, brim.recipes.recipeID, " 
            + "brim.drinks.drinkID, brim.drinks.name, brim.drinks.estimate, " 
            + "brim.drinkrecipes.itemQuantity, brim.drinks.measurementUnit, brim.drinks.parLevel, "
            + "brim.drinks.parLevel, brim.drinks.idealLevel, brim.drinks.bottleSize, brim.drinks.brand, "
            + "brim.drinks.bottlesPerCase, brim.drinks.vintage, brim.drinks.price "
            + "FROM brim.drinkrecipes "
            + "INNER JOIN recipes ON drinkrecipes.recipeID = recipes.recipeID " 
            + "INNER JOIN drinks ON drinkrecipes.drinkID = drinks.drinkID;";

            DataTable dt = this.runSelectQuery(queryString);
            //get list of recipe IDs
            var recipeIDs = dt.AsEnumerable()
                .Select(dr=>new { ID = dr.Field<int>("recipeID"), name = dr.Field<string>("recipeName"), baseLiquor = dr.Field<string>("baseLiquor") })
                .Distinct();
            foreach(var recipe in recipeIDs) {
                var recipeIngredients = dt.AsEnumerable()
                    .Select(dr=>dr)
                    .Where(dr=>dr.Field<int>("recipeID") == recipe.ID);
                Recipe tempDrink = new Recipe(recipe.ID, recipe.name, recipe.baseLiquor, recipeIngredients);
                newRecipeList.Add(tempDrink);
            }

            return newRecipeList;
        }

        //Takes in the id, date, and amount for a drink and either updates an existing entry by that amount
        //or inserts a new entry into the drinkstats table
        public bool incrementDrinkStat(int id, string date, double amt) 
        {
            //Select to see if entry already exists
            //if it does, update it, if not insert it
            string query = @"SELECT * FROM brim.drinkstats WHERE DrinkID = '" + id + "' AND Date = '" + date + "';";

            DataTable stats = this.runSelectQuery(query);

            bool result;
            if (stats.Rows.Count > 0)
            {
                //update
                query = @"UPDATE brim.drinkstats SET Quantity = Quantity + " + amt + " WHERE DrinkID = '" + id + "' AND Date = '" + date + "';";
                result = this.runSqlInsertUpdateOrDeleteCommand(query);
                if (!result)
                {
                    Console.WriteLine("Error: DrinkStats could not be updated for drink ID " + id);
                }

            } else
            {
                //insert
                query = @"INSERT INTO brim.drinkstats (DrinkID, Date, Quantity) VALUES ('" + id + "', '" + date + "', '" + amt + "');";
                result = this.runSqlInsertUpdateOrDeleteCommand(query);
                if (!result)
                {
                    Console.WriteLine("Error: DrinkStats could not insert drink ID " + id);
                }
            }
            return result;
        }

        //Takes in the id, date, and amount for a recipe and either updates an existing entry by that amount
        //or inserts a new entry into the recipestats table
        public bool incrementRecipeStat(int id, string date, double amt)
        {
            //Select to see if entry already exists
            //if it does, update it, if not insert it
            string query = @"SELECT * FROM brim.recipestats WHERE RecipeID = '" + id + "' AND Date = '" + date + "';";

            DataTable stats = this.runSelectQuery(query);
            bool result;
            if (stats.Rows.Count > 0)
            {
                //update
                query = @"UPDATE brim.recipestats SET Quantity = Quantity + " + amt + " WHERE RecipeID = '" + id + "' AND Date = '" + date + "';";
                result = this.runSqlInsertUpdateOrDeleteCommand(query);
                if (!result)
                {
                    Console.WriteLine("Error: RecipeStats could not be updated for recipe ID " + id + " on date " + date);
                }
            }
            else
            {
                //insert
                query = @"INSERT INTO brim.recipestats (RecipeID, Date, Quantity) VALUES ('" + id + "', '" + date + "', '" + amt + "');";
                result = this.runSqlInsertUpdateOrDeleteCommand(query);
                if (!result)
                {
                    Console.WriteLine("Error: RecipeStats could not insert recipe ID " + id + " on date " + date);
                }
            }
            
            return result;
        }

        //Takes in an ID, a start date, and an end date. It returns a list of drink stats for that drink that are between those dates
        public List<DrinkStat> getDrinkStatsByDateRange(int DrinkID, string StartDate, string EndDate)
        {
            string query = @"SELECT * FROM brim.drinkstats WHERE DrinkID = '" + DrinkID + "' AND Date >= '" + StartDate + "' AND Date <= '" + EndDate + "';";
            List<DrinkStat> drinkStats = new List<DrinkStat>();
            
            DataTable stats = this.runSelectQuery(query);

            foreach (DataRow dr in stats.Rows)
            {
                drinkStats.Add(new DrinkStat(dr));
            }

            return drinkStats;
        }

        //Takes in an ID, a start date, and an end date. It returns a list of recipe stats for that recipe that are between those dates for that recipe
        public List<RecipeStat> getRecipeStatsByDateRange(int RecipeID, string StartDate, string EndDate)
        {
            string query = @"SELECT * FROM brim.recipestats WHERE RecipeID = '" + RecipeID + "' AND Date >= '" + StartDate + "' AND Date <= '" + EndDate + "';";
            List<RecipeStat> recipeStats = new List<RecipeStat>();

            DataTable stats = this.runSelectQuery(query);

            foreach (DataRow dr in stats.Rows)
            {
                recipeStats.Add(new RecipeStat(dr));
            }

            return recipeStats;
        }

        //Takes in a start date, and an end date. It returns a list of drink stats from the drinkstats table that are between those dates
        public List<DrinkStat> getAllDrinkStatsByDateRange(string StartDate, string EndDate)
        {
            string query = @"SELECT * FROM brim.drinkstats WHERE Date >= '" + StartDate + "' AND Date <= '" + EndDate + "';";
            List<DrinkStat> drinkStats = new List<DrinkStat>();

            DataTable stats = this.runSelectQuery(query);

            foreach (DataRow dr in stats.Rows)
            {
                drinkStats.Add(new DrinkStat(dr));
            }

            return drinkStats;
        }

        //Takes in a start date, and an end date. It returns a list of recipe stats from the recipestats table that are between those dates
        public List<RecipeStat> getAllRecipeStatsByDateRange(string StartDate, string EndDate)
        {
            string query = @"SELECT * FROM brim.recipestats WHERE Date >= '" + StartDate + "' AND Date <= '" + EndDate + "';";
            List<RecipeStat> recipeStats = new List<RecipeStat>();

            DataTable stats = this.runSelectQuery(query);

            foreach (DataRow dr in stats.Rows)
            {
                recipeStats.Add(new RecipeStat(dr));
            }

            return recipeStats;
        }

        //Takes in a drink id and gets a list of all entries from the DrinkStats table with that DrinkID
        //Returns that list of stats
        public List<DrinkStat> getDrinkStats(int DrinkID)
        {
            string query = @"SELECT * FROM brim.drinkstats WHERE DrinkID = '" + DrinkID + "';";
            List<DrinkStat> drinkStats = new List<DrinkStat>();

            DataTable stats = this.runSelectQuery(query);

            foreach (DataRow dr in stats.Rows)
            {
                drinkStats.Add(new DrinkStat(dr));
            }

            return drinkStats;
        }

        //Takes in a recipe id and gets a list of all entries from the RecipeStats table with that recipeID
        //returns that list of stats
        public List<RecipeStat> getRecipeStats(int RecipeID)
        {
            string query = @"SELECT * FROM brim.recipestats WHERE RecipeID = '" + RecipeID + "';";
            List<RecipeStat> recipeStats = new List<RecipeStat>();

            DataTable stats = this.runSelectQuery(query);

            foreach (DataRow dr in stats.Rows)
            {
                recipeStats.Add(new RecipeStat(dr));
            }

            return recipeStats;
        }
    }
}