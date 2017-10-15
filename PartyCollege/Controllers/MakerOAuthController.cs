using PartyCollege.Model.MakerApi;
using PartyCollege.Tools;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace PartyCollege.Controllers
{
    public class MakerOAuthController : ApiController
    {
		
		[Route("oauth/authorize")]
		[HttpGet]
		public dynamic authorizeMaker()
		{
			dynamic returnInfo = new ExpandoObject();
			

			return "";
		}

		
    }
}
