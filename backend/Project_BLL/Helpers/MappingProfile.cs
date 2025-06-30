//using System.Security.Claims;
//using AutoMapper;
//using Microsoft.AspNetCore.Identity;
//using Project_BLL.Interfaces;
//using project_DAL.Identity;
//using project.Services;
//using project.Repository;
//using project_DAL.Entities;
//using project.Helpers;
//using Project_DAL.Entities.Product;
//using project.Dtos;  // إضافة استدعاء DTOs

//namespace project.Helpers
//{
//    public class MappingProfile : Profile
//    {
//        public MappingProfile()
//        {
//            // Mapping between Product and ProductToReturnDto
//            CreateMap<Product, ProductToReturnDto>()
//                .ForMember(D => D.Brand, O => O.MapFrom(P => P.Brand.Name))
//                .ForMember(D => D.Category, O => O.MapFrom(P => P.Category.Name))
//                .ForMember(D => D.PictureUrl, O => O.MapFrom<ProductPictureUrlResolver>())
//                .ReverseMap();

//            // Mapping between ProductDto and Product
//            CreateMap<ProductDto, Product>()
//                .ForMember(D => D.Name, O => O.MapFrom(S => S.Title)) // Map Title to Name
//                .ForMember(D => D.Description, O => O.MapFrom(S => S.Details)) // Map Details to Description
//                .ForMember(D => D.State, O => O.MapFrom(S => S.State)) // Map State to state
//                .ForMember(D => D.PictureUrl, O => O.MapFrom(S => S.Image)) // Map Image to PictureUrl
//                .ForMember(D => D.IsLove, O => O.MapFrom(S => S.IsLove)) // Map IsLove
//                .ReverseMap(); // Reverse mapping if needed
//        }
//    }
//}

using AutoMapper;
using project.Dtos;
using project.Helpers;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // خريطة بين Product و ProductToReturnDto
        CreateMap<Product, ProductToReturnDto>()
            //.ForMember(D => D.Brand, O => O.MapFrom(P => P.Brand.Name))
            //.ForMember(D => D.Category, O => O.MapFrom(P => P.Category.Name))
            .ForMember(D => D.PictureUrl, O => O.MapFrom<ProductPictureUrlResolver>())
            .ReverseMap();

        // خريطة بين ProductDto و Product
        //CreateMap<ProductDto, Product>()
        //    .ForMember(D => D.Name, O => O.MapFrom(S => S.Title))
        //    .ForMember(D => D.Description, O => O.MapFrom(S => S.Details))
        //    .ForMember(D => D.State, O => O.MapFrom(S => S.State))
        //    .ForMember(D => D.PictureUrl, O => O.MapFrom(S => S.Image));
            //.ForMember(D => D.IsLove, O => O.MapFrom(S => S.IsLove))
            //.ForMember(D => D.BrandId, O => O.MapFrom(S => S.BrandId))
            //.ForMember(D => D.CategoryId, O => O.MapFrom(S => S.CategoryId))
            //.ReverseMap();
    }
}

