using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace BRIM.BackendClassLibrary
{
    public interface IPOSManager
    {
        //General method to get all orders ever. This is used when a 
        //LastUpdate.txt file cannot be found to tell the application when information
        //was last read for an update.
        JObject GetAllOrders();

        //Takes in a DateTime and grabs all orders on or ater that time
        //Returns the JObject that comes from the the REST request to Clover
        JObject GetAllOrders(DateTime time);

        //This will take in information on an order in the future
        //Most likely will be used to create orders in clover to be used for testing purposes
        public void SendOrder();
    }
}
