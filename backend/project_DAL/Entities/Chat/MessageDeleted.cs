using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using project_BLL.Identity;

namespace project_DAL.Entities
{
    
public class MessageDeleted
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string UserId { get; set; }
        public AppUser User { get; set; }

        public Guid MessageId { get; set; }
        public Message Message { get; set; }
    }
}
