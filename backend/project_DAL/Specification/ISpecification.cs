using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using Project_DAL.Entities.Product;

namespace project_DAL.Specification
{
    public interface ISpecifications<T> where T : BaseEntity
    {
        Expression<Func<T, bool>>? Criteria { get; set; }
        List<Expression<Func<T, object>>> Includes { get; set; }
        Expression<Func<T, object>> OrderByAsce { get; set; }
        Expression<Func<T, object>> OrderByDesc { get; set; }
        int Skip { get; set; }
        int Take { get; set; }
        bool IsPaginationEnabled { get; set; }
    }
}
