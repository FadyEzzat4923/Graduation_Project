using project_DAL.Entities;
using project_DAL.Services.Contract;
using project.Repositories.Contract;
using project.Contract;
using project.Specifications.ProductSpec;
using Project_DAL.Entities.Product;
using project_DAL.Specification.ProductSpec;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace project.Services
{
    public class ProductService : IProductService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ProductService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Product?> GetProductByIdAsync(string id)
        {
            var productSpec = new ProductSpecification(productId: id);  // هتستخدم id الخاص بالمنتج هنا
            return await _unitOfWork.Repository<Product>().GetByIdWithSpecAsync(productSpec);
        }



        public async Task<int> GetCountAsync(AllProductsPram pram)
        {
            var countSpec = new ProductWithFiltertionCountSpec(pram);
            var count = await _unitOfWork.Repository<Product>().GetCountAsync(countSpec);
            return count;
        }


        public async Task<Product> CreateProductAsync(Product product)
        {
            _unitOfWork.Repository<Product>().Add(product);
            var result = await _unitOfWork.CompleteAsync();
            if (result <= 0) return null;

            return product;
        }


        public async Task<Product> UpdateProductAsync(Product product)
        {
            _unitOfWork.Repository<Product>().Update(product);
            var result = await _unitOfWork.CompleteAsync();

            if (result > 0)
            {
                return product;
            }

            return null;
        }

        public async Task<bool> DeleteProductAsync(Product product)
        {
            _unitOfWork.Repository<Product>().Delete(product);
            var result = await _unitOfWork.CompleteAsync();

            return result > 0;
        }

        public async Task<IReadOnlyList<Product>> SearchProductsByKeywordAsync(string keyword)
        {
            var spec = new ProductKeywordSearchSpecification(keyword);
            var products = await _unitOfWork.Repository<Product>().GetAllWithSpecAsync(spec);
            return products;
        }
        public async Task<IReadOnlyList<Product>> GetProductsByUserIdAsync(string userId)
        {
            var productSpec = new ProductSpecification(userId: userId);  // هتستخدم userId الخاص بالمستخدم هنا
            return await _unitOfWork.Repository<Product>().GetAllWithSpecAsync(productSpec);
        }
        public async Task<IReadOnlyList<Product>> GetSavedProductsByUserIdAsync(string userId)
        {
           var spec = new SavedProductWithUserIdSpecification(userId);
        
           var savedProducts = await _unitOfWork.Repository<SavedProduct>().GetAllWithSpecAsync(spec);

            var products = savedProducts.Select(sp => sp.Product).ToList();



            return products;
        }



        public async Task<SavedProduct> CreateSavedProductAsync(SavedProduct savedProduct)
        {
            _unitOfWork.Repository<SavedProduct>().Add(savedProduct);
            var result = await _unitOfWork.CompleteAsync();
            if (result <= 0) return null;

            return savedProduct;
        }

        public async Task<bool> IsProductSavedAsync(string userId, string productId)
        {
            return await _unitOfWork.Repository<SavedProduct>()
            .AnyAsync(sp => sp.UserId == userId && sp.ProductId == productId);
        }


        public async Task<bool> DeleteSavedProductAsync(string userId,string productId)
        {

            var savedProduct = await _unitOfWork.Repository<SavedProduct>()
            .FirstOrDefaultAsync(sp => sp.UserId == userId && sp.ProductId == productId);

            if (savedProduct is null)
            {
                return false;
            }
            
                _unitOfWork.Repository<SavedProduct>().Delete(savedProduct);
                 var result = await _unitOfWork.CompleteAsync();
                 
            
            return result > 0;
        }

        public async Task<IReadOnlyList<Product>> GetProductsAsync(AllProductsPram pram)
        {
            var products = await _unitOfWork.Repository<Product>().GetAllAsync(); // أو GetAllWithSpecAsync لو عندك فلترة
            return products;
        }

    }
}

