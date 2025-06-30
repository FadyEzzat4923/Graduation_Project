using project.Repository;


using Microsoft.EntityFrameworkCore;

using System.Linq;
using Project_DAL.Entities.Product;
using project_DAL.Specification;

namespace project.Repository
{
    public static class SpecificationsEvaluator<TEntity> where TEntity : BaseEntity
    {
        public static IQueryable<TEntity> GetQuery(IQueryable<TEntity> inputQuery, ISpecifications<TEntity> spec)
        {
            var query = inputQuery; // _dbcontect.set<TEntity>()
            
            if (spec.Criteria is not null)
                query = query.Where(spec.Criteria); // _dbcontect.set<TEntity>().where(T => T.id == 1)

            if (spec.OrderByAsce is not null)
                query = query.OrderBy(spec.OrderByAsce); // _dbcontect.set<TEntity>().where(T => T.id == 1).OrderBy(P => P.Name or Price)
            else if (spec.OrderByDesc is not null)
                query = query.OrderByDescending(spec.OrderByDesc); // _dbcontect.set<TEntity>().where(T => T.id == 1).OrderByDescending(P => P.Price)

            if (spec.IsPaginationEnabled) // If ? IsPaginationEnabled == True : Else Set Default(pageSize(5), pageindex(1))  
                query = query.Skip(spec.Skip).Take(spec.Take); // _dbcontect.set<TEntity>().where(T => T.id == 1).OrderByDescending(P => P.Price).skip((1-1)*5).take(5)

            query = spec.Includes.Aggregate(query, (currentQuery, includeExpression) => currentQuery.Include(includeExpression)); //_dbcontect.set<TEntity>().where(T => T.id == 1).include(e => e.brand).OrderBy(Descending)(P => P.Name or Price).skip((1-1)*5).take(5)



            return query;
        }
    }
}
