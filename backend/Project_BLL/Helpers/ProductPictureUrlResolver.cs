using AutoMapper;
using Microsoft.Extensions.Configuration;
using Project_DAL.Entities.Product;
using Project_DAL.Entities;
using project.Dtos;
namespace project.Helpers
{
    public class ProductPictureUrlResolver : IValueResolver<Product, ProductToReturnDto, string>
    {
        private readonly IConfiguration _configuration;

        public ProductPictureUrlResolver(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string Resolve(Product source, ProductToReturnDto destination, string destMember, ResolutionContext context)
        {
            if (!string.IsNullOrEmpty(source.PictureUrl))
                return $"{_configuration["ApiPictureUrl"]}/{source.PictureUrl}";

            return string.Empty;
        }
    }
}
