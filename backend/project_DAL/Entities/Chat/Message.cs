using project_BLL.Identity;

namespace project_DAL.Entities
{
    public class Message
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Text { get; set; } = null!;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public bool IsEdited { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string UserId { get; set; } 
        public AppUser User { get; set; } 
    }
}
