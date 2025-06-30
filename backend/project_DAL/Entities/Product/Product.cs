using project_BLL.Identity;
using Project_DAL.Entities.Product;

public class Product : BaseEntity
{
    public Product()
    {
        Id = Guid.NewGuid().ToString();
    }

    public string Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string? State { get; set; } = "new";
    public string PictureUrl { get; set; } 
    public decimal Price { get; set; }
    public string PhoneNumber { get; set; }
    public string WhatsappNumber { get; set; }
    public bool IsLove { get; set; } = false;
 
    public string UserId { get; set; }
    public AppUser User { get; set; }

    public ICollection<SavedProduct> SavedByUsers { get; set; }
}
