using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace BRIM.BackendClassLibrary
{
    public class POSManager : IPOSManager
    {
        public JObject GetAllOrders()
        {
            var client = new RestClient("https://sandbox.dev.clover.com/v3/merchants/RYBHTZ2AMPQY1/orders?expand=lineItems%2ClineItems.modifications&access_token=8fe4215a-a338-4fbe-4f74-193919caa02c");
            var request = new RestRequest(Method.GET);
            request.AddHeader("Accept", "application/json");
            IRestResponse response = client.Execute(request);

            return JsonConvert.DeserializeObject<JObject>(response.Content);
        }

        public JObject GetAllOrders(DateTime time)
        {
            var client = new RestClient("https://sandbox.dev.clover.com/v3/merchants/RYBHTZ2AMPQY1/orders?filter=createdTime>"
                                            + ((DateTimeOffset)time).ToUnixTimeSeconds()
                                            + "&expand=lineItems%2ClineItems.modifications&access_token=8fe4215a-a338-4fbe-4f74-193919caa02c");
            var request = new RestRequest(Method.GET);
            request.AddHeader("Accept", "application/json");
            IRestResponse response = client.Execute(request);

            return JsonConvert.DeserializeObject<JObject>(response.Content);
        }

        public void SendOrder() 
        {
            /*
            Head here to setup more orders
            https://docs.clover.com/reference#ordercreateatomicorder

            Creates an order with potentially multiple elements. 
            Need to have order type information, :vaulted card information" whatever that means, and order ID numbers. if using modifications you need an ID for that
            Functionality does not seem to work though
            */

            var client = new RestClient("https://sandbox.dev.clover.com/v3/merchants/RYBHTZ2AMPQY1/atomic_order/orders?access_token=8fe4215a-a338-4fbe-4f74-193919caa02c");
            var request = new RestRequest(Method.POST);
            request.AddHeader("Accept", "application/json");
            request.AddHeader("Content-Type", "application/json");
            request.AddParameter("application/json",
                                    "{\"orderCart\":{\"lineItems\":[{\"item\":{\"id\":\"V341Y5136FFMP\"},\"printed\":\"false\",\"exchangedLineItem\":{},\"exchanged\":" + 
                                    "\"false\",\"modifications\":[],\"refunded\":\"false\",\"refund\":{\"orderRef\":{},\"device\":{},\"payment\":{},\"employee\":{}," + 
                                    "\"overrideMerchantTender\":{},\"serviceChargeAmount\":{},\"germanInfo\":{},\"appTracking\":{},\"cardTransaction\":{\"extra\":{}," + 
                                    "\"vaultedCard\":{\"first6\":\"777777\",\"last4\":\"7777\"}},\"transactionInfo\":{\"identityDocument\":{\"payment\":{}},\"isTokenBasedTx\"" + 
                                    ":\"false\",\"emergencyFlag\":\"false\",\"promotionalMessage\":{},\"sepaElvTransactionInfo\":{}},\"merchant\":{}},\"isRevenue\":\"false\"," + 
                                    "\"printGroup\":{},\"price\":0,\"name\":\"TestDrink1\"}],\"orderType\":{\"taxable\":true,\"isDefault\":true,\"filterCategories\":\"false\"," + 
                                    "\"isHidden\":\"false\",\"isDeleted\":\"false\",\"id\":\"1Z288B5A2B0F8\",\"labelKey\":\"com.clover.order.type.dine_in\",\"label\":\"Test\"," + 
                                    "\"hoursAvailable\":\"BUSINESS\",\"systemOrderTypeId\":\"DINE-IN-TYPE\"},\"groupLineItems\":\"false\"}}", 
                                    ParameterType.RequestBody);
            IRestResponse response = client.Execute(request);

            JObject result = JsonConvert.DeserializeObject<JObject>(response.Content);
        }
    }
}
