using project_DAL.Entities;
using project.Specifications;
using System.Linq.Expressions;
using project_DAL.Specification.ProductSpec;
using Project_DAL.Entities.Product;

namespace project.Specifications.ProductSpec
{
    public class ProductKeywordSearchSpecification : BaseSpecifications<Product>
    {
        public ProductKeywordSearchSpecification(string keyword)
            : base(x =>
                string.IsNullOrEmpty(keyword) || x.Name.Contains(keyword) || x.Description.Contains(keyword) || x.State.Contains(keyword)
            )
        {
        }
    }
}

