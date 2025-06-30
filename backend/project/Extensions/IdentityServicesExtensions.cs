using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using project_BLL.Identity;
using project_DAL.Identity;
using System.Text;

namespace project.Extensions
{
    public static class IdentityServicesExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services/*, IConfiguration configuration*/)
        {
            services.AddIdentity<AppUser, IdentityRole>(options =>
            {

            }).AddEntityFrameworkStores<StoreContext>().AddDefaultTokenProviders();

            services.AddAuthentication(/*JwtBearerDefaults.AuthenticationScheme*/
                //option =>
                //{
                //    option.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                //    option.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

                //}
                );
                //.AddJwtBearer(option =>
                //{
                //    option.TokenValidationParameters = new TokenValidationParameters()
                //    {
                //        ValidateAudience = true,
                //        ValidAudience = configuration["JWT:ValidAudience"],
                //        ValidateIssuer = true,
                //        ValidIssuer = configuration["JWT:ValidIssure"],
                //        ValidateIssuerSigningKey = true,
                //        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Key"])),
                //        ValidateLifetime = true
                //    };
                //});

            return services;
        }
    }
}
