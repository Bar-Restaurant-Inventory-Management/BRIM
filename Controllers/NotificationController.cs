using System.Collections.Generic;
using System.Linq;
using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using BRIM.BackendClassLibrary;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using System.Diagnostics;

namespace BRIM
{
	public class NotificationController : Controller
	{
		private readonly IHttpContextAccessor _hCA;
		public NotificationController(IHttpContextAccessor httpContextAccessor)
		{
			_hCA = httpContextAccessor;
		}

		[HttpGet]
	    [Route("/notification/get")]
		public async Task Get()
		{
			var response = _hCA.HttpContext.Response;
            response.Headers.Add("connection","keep-alive");
			response.Headers.Add("Content-Type", "text/event-stream");
			response.StatusCode = 200;

			for (var i = 0; true; ++i)
			{
				await response
					.WriteAsync($"data: Controller {i} at {DateTime.Now}\r\r");

				//response.Body.Flush();
				await Task.Delay(5 * 1000);
			}

	    }
	}
}