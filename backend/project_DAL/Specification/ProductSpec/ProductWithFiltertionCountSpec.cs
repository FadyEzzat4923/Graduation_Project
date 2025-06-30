using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace project_DAL.Specification.ProductSpec
{
    public class ProductWithFiltertionCountSpec : BaseSpecifications<Product>
    {
        public ProductWithFiltertionCountSpec(AllProductsPram pram)
      : base(P =>
            (string.IsNullOrEmpty(pram.Search) || P.Name.ToLower().Contains(pram.Search.ToLower()))  // for Search
                                    
           )
        {
        }

    }
}
