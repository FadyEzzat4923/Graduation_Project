using Microsoft.AspNetCore.Identity;
using project_DAL.Entities;
using project_DAL.Entities.MotherGuids;

namespace project_BLL.Identity
{
    public class AppUser : IdentityUser
    {
        public ICollection<Message> Messages { get; set; } = new List<Message>();
        public ICollection<MessageDeleted> MessagesDeleted { get; set; } = new List<MessageDeleted>();
        public string? ResetCode { get; set; }
        public DateTime? ResetCodeExpiration { get; set; }
        public string  FirstName { get; set; }

        public string LastName { get; set; }
        public ICollection<Product> Products { get; set; }
        public ICollection<SavedProduct> SavedProducts { get; set; }

        public ICollection<UserTip> UserTips { get; set; } = new List<UserTip>();

    }
}
