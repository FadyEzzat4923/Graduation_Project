using Microsoft.AspNetCore.Identity;
using project_BLL.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace project_DAL.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUserAsync(UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                var user = new AppUser()
                {
                    UserName = "abdalrhman fathy",
                    Email = "abdalrhmanfathy170@gmail.com",
                    PhoneNumber = "01143210112",
                };
                await userManager.CreateAsync(user, "Pa$$w0rd");
            }
        }
    }
}
