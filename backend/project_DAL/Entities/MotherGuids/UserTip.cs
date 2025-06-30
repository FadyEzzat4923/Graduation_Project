using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using project_BLL.Identity;
using project_DAL.Identity;

namespace project_DAL.Entities.MotherGuids
{
    public class UserTip
    {
        public string UserId { get; set; }
        public AppUser User { get; set; }
        public Guid TipId { get; set; }
        public Tip Tip { get; set; }
    }
}
