using Project_DAL.Entities.Product;
using project_DAL.Specification.ProductSpec;

public class ProductSpecification : BaseSpecifications<Product>
{
    public ProductSpecification(string? productId = null, string? userId = null)
        : base(p =>
            (productId != null && p.Id == productId) || (userId != null && p.UserId == userId) 
        )
    {
        Includes.Add(p => p.User);
    }
}
