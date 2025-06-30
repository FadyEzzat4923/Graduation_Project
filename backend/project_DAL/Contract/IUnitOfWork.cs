using project.Repository;

//using project_BLL.Migrations;
using project_BLL.Identity;
using project.Repositories.Contract;
using Project_DAL.Entities.Product;

namespace project.Contract
{
    public interface IUnitOfWork : IAsyncDisposable
    {
        //IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity;
        //Task<int> CompleteAsync();
        IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity;
        Task<int> CompleteAsync();

    }
}
