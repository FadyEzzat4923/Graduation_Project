//using project_BLL;
//using project.Repository;

//using System.Collections;
//using project.Contract;
//using project_DAL.Data;
//using project.Repositories.Contract;
//using Project_DAL.Entities.Product;

//namespace project.Repository
//{
//    public class UnitOfWork : IUnitOfWork
//    {
//        private readonly StoreDbContext _dbContext;
//        private Hashtable _repositories;

//        public UnitOfWork(StoreDbContext dbContext)
//        {
//            _dbContext = dbContext;
//            _repositories = new Hashtable();
//        }

//        public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
//        {
//            var Key = typeof(TEntity).Name;

//            if (!_repositories.ContainsKey(Key))
//            {
//                var repository = new GenericRepository<TEntity>(_dbContext); // Create Obj From IGenericRepository

//                _repositories.Add(Key, repository);
//            }

//            return _repositories[Key] as IGenericRepository<TEntity>;
//        }

//        public async Task<int> CompleteAsync()
//        {
//            return await _dbContext.SaveChangesAsync();
//        }

//        public async ValueTask DisposeAsync()
//        {
//            await _dbContext.DisposeAsync();
//        }
//    }
//}
using project.Repositories.Contract;
using Microsoft.EntityFrameworkCore;
using System.Collections;
using project.Contract;
using Project_DAL.Entities.Product;
using project_BLL.Identity;

namespace project.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly StoreContext _dbContext;
        private Hashtable _repositories;

        public UnitOfWork(StoreContext dbContext)
        {
            _dbContext = dbContext;
            _repositories = new Hashtable();
        }

        public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
        {
            var key = typeof(TEntity).Name;

            if (!_repositories.ContainsKey(key))
            {
                var repository = new GenericRepository<TEntity>(_dbContext); // Create Obj From IGenericRepository

                _repositories.Add(key, repository);
            }

            return _repositories[key] as IGenericRepository<TEntity>;
        }

        public async Task<int> CompleteAsync()
        {
            return await _dbContext.SaveChangesAsync();
        }

        public async ValueTask DisposeAsync()
        {
            await _dbContext.DisposeAsync();
        }
    }
}

