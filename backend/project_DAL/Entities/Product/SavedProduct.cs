using project_BLL.Identity;
using Project_DAL.Entities.Product;

public class SavedProduct : BaseEntity
{

   public string UserId { get; set; }
   public AppUser User { get; set; }
   public string ProductId { get; set; }
   public Product Product { get; set; }
}
