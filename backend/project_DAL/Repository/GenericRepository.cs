
using project.Repositories.Contract;
using project.Specifications;
using project.Specifications.ProductSpec;
using Microsoft.EntityFrameworkCore;
using project_BLL.Identity;
using Project_DAL.Entities.Product;
//using project_DAL.Data;
using project_DAL.Specification;
using System.Linq.Expressions;

namespace project.Repository
{
    public class GenericRepository<T> : IGenericRepository<T> where T : BaseEntity
    {
        private readonly StoreContext _dbContext;
        private readonly DbSet<T> _dbSet;

        public GenericRepository(StoreContext dbContext)
        {
            _dbContext = dbContext;
             _dbSet = _dbContext.Set<T>();
        }

        public async Task<IReadOnlyList<T>> GetAllAsync()
        {
            return await _dbContext.Set<T>().ToListAsync();
        }

        public async Task<T?> GetByIdAsync(string id)
        {
            return await _dbContext.Set<T>().FindAsync(id);
        }

        public async Task<IReadOnlyList<T>> GetAllWithSpecAsync(ISpecifications<T> spec)
        {
            return await SpecificationsEvaluator<T>.GetQuery(_dbContext.Set<T>(), spec).AsNoTracking().ToListAsync();
        }

        public async Task<T?> GetByIdWithSpecAsync(ISpecifications<T> spec)
        {
            return await SpecificationsEvaluator<T>.GetQuery(_dbContext.Set<T>(), spec).FirstOrDefaultAsync();
        }

        public async Task<int> GetCountAsync(ISpecifications<T> spec)
        {
            return await SpecificationsEvaluator<T>.GetQuery(_dbContext.Set<T>(), spec).CountAsync();
        }

        public IQueryable<T> SearchByName(ISpecifications<T> spec)
        {
            return SpecificationsEvaluator<T>.GetQuery(_dbContext.Set<T>(), spec).AsNoTracking();
        }

        public void Add(T TEntity)
        {
            _dbContext.Set<T>().Add(TEntity);
        }

        public void Update(T TEntity)
        {
            _dbContext.Set<T>().Update(TEntity);
        }

        public void Delete(T TEntity)
        {
            _dbContext.Set<T>().Remove(TEntity);
        }

        public async Task<bool> AnyAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbContext.Set<T>().AnyAsync(predicate);
        }
   

        public async Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.FirstOrDefaultAsync(predicate);
        }

   
    }
}
