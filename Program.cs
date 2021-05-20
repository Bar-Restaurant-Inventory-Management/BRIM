using System;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using BRIM.BackendClassLibrary;
using System.Timers;
using Newtonsoft.Json.Linq;
using System.IO;

//namespace React.Sample.Webpack.CoreMvc
namespace BRIM
{
	public class Program
	{
		//static POSManager pos = new POSManager();
		//static Inventory inventory = new Inventory();

		public static void Main(string[] args)
		{
			BuildWebHost(args).Run();
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
