using System;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using BRIM.BackendClassLibrary;
using System.Timers;
using Newtonsoft.Json.Linq;
using System.IO;
//why is This Using Directive unneccesary? Is it because it's not in a 
//separate Project, but rather a free-floating file in the project that contain the Class Library? 

//namespace React.Sample.Webpack.CoreMvc
namespace BRIM
{
	public class Program
	{
		static POSManager pos = new POSManager();
		static Inventory inventory = new Inventory();

		public static void Main(string[] args)
		{
			Timer posUpdates = new Timer();
			posUpdates.Interval = 300000; //5 minutes in milliseconds
			posUpdates.AutoReset = true;
			posUpdates.Elapsed += new ElapsedEventHandler(TimerElapsed);
			posUpdates.Start();

			BuildWebHost(args).Run();
		}

		public static void TimerElapsed(object sender, ElapsedEventArgs e)
        {
			inventory.GetItemList();
			inventory.GetRecipeList();
			string path = Path.Combine(AppContext.BaseDirectory, "LastUpdate.txt");
			DateTime current = DateTime.Now;
			JObject json;

			if (File.Exists(path))
            {
				DateTime lastUpdate = DateTime.Parse(File.ReadAllText(path));
				json = pos.GetAllOrders(lastUpdate);
			} else
            {
				json = pos.GetAllOrders();
            }

			//send json to the posUpdates method in inventory
			inventory.parseAPIPOSUpdate(json);

			File.WriteAllText(path, current.ToString());
        }

		public static IWebHost BuildWebHost(string[] args) =>
			WebHost.CreateDefaultBuilder(args)
			.ConfigureLogging(logging =>
			{
				logging.ClearProviders();
				logging.AddDebug();
			})
				.UseStartup<Startup>()
				.Build();
	}
}
