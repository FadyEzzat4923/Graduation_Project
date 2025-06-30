
using System.Linq.Expressions;
using project_DAL.Specification;
using Project_DAL.Entities.Product;

namespace project.Repositories.Contract
{
    public interface IGenericRepository<T> where T : BaseEntity
    {
        Task<T?> GetByIdAsync(string id);
        Task<IReadOnlyList<T>> GetAllAsync();
        Task<IReadOnlyList<T>> GetAllWithSpecAsync(ISpecifications<T> spec);
        Task<T?> GetByIdWithSpecAsync(ISpecifications<T> spec);
        Task<int> GetCountAsync(ISpecifications<T> spec);
        IQueryable<T> SearchByName(ISpecifications<T> spec);
        void Add(T TEntity);
        void Update(T TEntity);
        void Delete(T TEntity);

        Task<bool> AnyAsync(Expression<Func<T, bool>> predicate);
        Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate);

    }
}
