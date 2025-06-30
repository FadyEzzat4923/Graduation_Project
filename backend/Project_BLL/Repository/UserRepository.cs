using Microsoft.EntityFrameworkCore;
using Project_BLL.Interfaces;
using project_BLL.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_BLL.Repository
{
    public class UserRepository<T> : IUserRepository<T> where T : class
    {
        private readonly StoreContext context;

        public UserRepository(StoreContext context)
        {
            this.context = context;
        }


        public async Task<T?> GetByIdAsync(Guid id)

            => await context.Set<T>().FindAsync(id);


        public async Task<int> Add(T spec)
        {
            context.Set<T>().Add(spec);
            return await context.SaveChangesAsync();
        }

        public async Task<int> Update(T entity)
        {
            context.Set<T>().Update(entity);
            return await context.SaveChangesAsync();
        }

        public async Task<int> Delete(T spec)
        {
            context.Set<T>().Remove(spec);
            return await context.SaveChangesAsync();
        }
    }
}
