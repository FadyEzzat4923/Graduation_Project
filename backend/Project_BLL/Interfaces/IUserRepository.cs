using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_BLL.Interfaces
{
    public interface IUserRepository<T> where T : class
    {
        Task<T?> GetByIdAsync(Guid id);

        Task<int> Update(T spec);

        Task<int> Add(T spec);

        Task<int> Delete(T spec);
    }
}
