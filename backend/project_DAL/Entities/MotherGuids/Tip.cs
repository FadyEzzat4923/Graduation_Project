using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using project_DAL.Entities.MotherGuids;

namespace project_DAL.Identity
{
    public class Tip
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public ICollection<UserTip> UserTips { get; set; } = new List<UserTip>();
    }
}
