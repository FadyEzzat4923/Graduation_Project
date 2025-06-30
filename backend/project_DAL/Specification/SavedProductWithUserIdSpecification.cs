using project_DAL.Entities;
using project_DAL.Specification.ProductSpec;

public class SavedProductWithUserIdSpecification : BaseSpecifications<SavedProduct>
{
    public SavedProductWithUserIdSpecification(string userId)
        : base(sp => sp.UserId == userId)
    {
        AddInclude(sp => sp.Product.User);


    }
}
