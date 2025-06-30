using Microsoft.AspNetCore.Identity;
using project_BLL.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_BLL.Interfaces
{
    public interface ITokenServices
    {
        Task<string> CreateToken(AppUser user, UserManager<AppUser> userManager);
    }
}
