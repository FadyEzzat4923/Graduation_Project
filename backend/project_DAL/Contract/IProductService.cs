using Project_DAL.Entities.Product;
using project_DAL.Specification.ProductSpec;

namespace project_DAL.Services.Contract
{
    public interface IProductService
    {
        Task<IReadOnlyList<Product>> GetProductsAsync(AllProductsPram pram);
        Task<int> GetCountAsync(AllProductsPram pram);
        Task<Product?> GetProductByIdAsync(string id);
        Task<Product> CreateProductAsync(Product product);
        Task<Product> UpdateProductAsync(Product product);
        Task<bool> DeleteProductAsync(Product product);
        Task<IReadOnlyList<Product>> SearchProductsByKeywordAsync(string keyword);
        Task<IReadOnlyList<Product>> GetProductsByUserIdAsync(string userId);
        Task<SavedProduct> CreateSavedProductAsync(SavedProduct savedProduct);
        Task<IReadOnlyList<Product>> GetSavedProductsByUserIdAsync(string userId);
        Task<bool> IsProductSavedAsync(string userId, string productId);
        Task<bool> DeleteSavedProductAsync(string userId,string productId);
    }
}

