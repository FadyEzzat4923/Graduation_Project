using AutoMapper;
using project.Dtos;
using project.Errors;
using project.Helpers;
using Microsoft.AspNetCore.Mvc;
using Project_DAL.Entities.Product;
using project_DAL.Specification.ProductSpec;
using project_DAL.Services.Contract;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace project.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : BaseApiController
    {
        private readonly IProductService _productService;
        private readonly IMapper _mapper;

        public ProductsController(IProductService productService, IMapper mapper)
        {
            _productService = productService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<Pagination<ProductToReturnDto>>> GetProducts([FromQuery] AllProductsPram pram)
        {
            var products = await _productService.GetProductsAsync(pram);
            var count = await _productService.GetCountAsync(pram);

            var data = products.Select(product => new ProductToReturnDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                PictureUrl = product.PictureUrl,
                State = product.State,
                Price = product.Price,
                UserName = product.User?.UserName ?? string.Empty,
                PhoneNumber = product.PhoneNumber,
                WhatsappNumber = product.WhatsappNumber
            }).ToList();

            return Ok(new Pagination<ProductToReturnDto>(pram.PageIndex, pram.PageSize, count, data));
        }

        [ProducesResponseType(typeof(ProductToReturnDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(APIResponce), StatusCodes.Status404NotFound)]
        [HttpGet("{id}")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult<ProductDetailsDto>> GetProductById(string id)
        {
            var product = await _productService.GetProductByIdAsync(id);

            if (product is null)
                return NotFound(new APIResponce(404));

            var productToReturn = new ProductDetailsDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                PictureUrl = product.PictureUrl,
                State = product.State,
                Price = product.Price,
                PhoneNumber = product.PhoneNumber,
                WhatsappNumber = product.WhatsappNumber,
                UserName = $"{product.User.FirstName} {product.User.LastName}"

            };

            return Ok(productToReturn);
        }




        [HttpPost]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult<ProductToReturnDto>> CreateProduct([FromForm] ProductDto productDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest(new { message = "User ID not found", statusCode = 400 });
            }

            string pictureUrl = null;
            if (productDto.ImageFile != null)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                Directory.CreateDirectory(uploadsFolder);
                var uniqueFileName = Guid.NewGuid().ToString() + "_" + productDto.ImageFile.FileName;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await productDto.ImageFile.CopyToAsync(fileStream);
                }
                pictureUrl = "/images/" + uniqueFileName;
            }


            var product = new Product
            {
                Name = productDto.Title,
                Description = productDto.Details,
                PictureUrl = pictureUrl,
                State = productDto.State,
                Price = productDto.Price,
                IsLove = productDto.IsLove,
                PhoneNumber = productDto.PhoneNumber,
                WhatsappNumber = productDto.WhatsappNumber,
                UserId = userId
            };

            var createdProduct = await _productService.CreateProductAsync(product);

            if (createdProduct == null)
            {
                return BadRequest(new APIResponce(400, "Problem creating product"));
            }

            var userName = User.FindFirstValue(ClaimTypes.GivenName);
            var productToReturn = new ProductToReturnDto
            {
                Id = createdProduct.Id,
                Name = createdProduct.Name,
                Description = createdProduct.Description,
                PictureUrl = createdProduct.PictureUrl,
                State = createdProduct.State,
                Price = createdProduct.Price,
                PhoneNumber = createdProduct.PhoneNumber,
                WhatsappNumber = createdProduct.WhatsappNumber,
                UserName = userName
            };

            return Ok(productToReturn);
        }





        [HttpPut("{id}")]
        public async Task<ActionResult<ProductToReturnDto>> UpdateProduct(string id, [FromForm] ProductDto productDto)
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null)
            {
                return NotFound(new APIResponce(404, "Product not found"));
            }

            product.Name = productDto.Title;
            product.Description = productDto.Details;
            product.State = productDto.State;
            product.Price = productDto.Price;
            product.IsLove = productDto.IsLove;
            product.PhoneNumber = productDto.PhoneNumber;
            product.WhatsappNumber = productDto.WhatsappNumber;

            if (productDto.ImageFile != null)
            {
                if (!string.IsNullOrEmpty(product.PictureUrl))
                {
                    var oldImagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", product.PictureUrl.TrimStart('/'));
                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }
                }

                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                Directory.CreateDirectory(uploadsFolder);
                var uniqueFileName = Guid.NewGuid().ToString() + "_" + productDto.ImageFile.FileName;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await productDto.ImageFile.CopyToAsync(fileStream);
                }
                product.PictureUrl = "/images/" + uniqueFileName;
            }

            var updatedProduct = await _productService.UpdateProductAsync(product);

            if (updatedProduct == null)
            {
                return BadRequest(new APIResponce(400, "Problem updating product"));
            }

            var productToReturn = new ProductToReturnDto
            {
                Id = updatedProduct.Id,
                Name = updatedProduct.Name,
                Description = updatedProduct.Description,
                PictureUrl = updatedProduct.PictureUrl,
                State = updatedProduct.State,
                Price = updatedProduct.Price,
                PhoneNumber = updatedProduct.PhoneNumber,
                WhatsappNumber = updatedProduct.WhatsappNumber,
                UserName = $"{product.User.FirstName} {product.User.LastName}"
            };

            return Ok(productToReturn);
        }




        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(string id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null)
            {
                return NotFound(new APIResponce(404, "Product not found"));
            }

            if (!string.IsNullOrEmpty(product.PictureUrl))
            {
                var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", product.PictureUrl.TrimStart('/'));
                if (System.IO.File.Exists(imagePath))
                {
                    System.IO.File.Delete(imagePath);
                }
            }

            var deletedProduct = await _productService.DeleteProductAsync(product);
            if (!deletedProduct)
            {
                return BadRequest(new APIResponce(400, "Problem deleting product"));
            }

            return NoContent();
        }

        [HttpGet("search")]
        public async Task<ActionResult<IReadOnlyList<ProductToReturnDto>>> SearchProducts([FromQuery] string keyword)
        {
            var products = await _productService.SearchProductsByKeywordAsync(keyword);

            var productsToReturn = products.Select(product => new ProductToReturnDto
            {
                Id = product.Id.ToString(),
                Name = product.Name,
                Description = product.Description,
                PictureUrl = product.PictureUrl,
                State = product.State,
                Price = product.Price,
                PhoneNumber = product.PhoneNumber,
                WhatsappNumber = product.WhatsappNumber,
                UserName = product.User != null ? product.User.UserName : ""
            }).ToList();

            return Ok(productsToReturn);
        }
        [HttpGet("my-products")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult<IReadOnlyList<ProductToReturnDto>>> GetMyProducts()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var products = await _productService.GetProductsByUserIdAsync(userId);

            var productsToReturn = products.Select(product => new ProductToReturnDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                PictureUrl = product.PictureUrl,
                State = product.State,
                Price = product.Price,
                PhoneNumber = product.PhoneNumber,
                WhatsappNumber = product.WhatsappNumber,
                UserName = product.User.UserName
            }).ToList();

            return Ok(productsToReturn);
        }






        [HttpPost("saved-product")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult<IReadOnlyList<ProductToReturnDto>>> CreateSavedProduct(string productId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var product = await _productService.GetProductByIdAsync(productId);

            if (product is null)
            {
                return NotFound("Product not found");
            }


            var IsProductSaved = await _productService.IsProductSavedAsync(userId, productId);

            if (IsProductSaved)
            {
                return BadRequest("Product is already saved");
            }

            var savedProduct = new SavedProduct
            {
                UserId = userId,
                ProductId = product.Id
            };

            var result = await _productService.CreateSavedProductAsync(savedProduct);

            return Ok(new ProductToReturnDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                PictureUrl = product.PictureUrl,
                State = product.State,
                Price = product.Price,
                PhoneNumber = product.PhoneNumber,
                WhatsappNumber = product.WhatsappNumber,
                UserName = $"{product.User.FirstName} {product.User.LastName}"
            });

        }




        [HttpGet("Saved-product")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult<IReadOnlyList<ProductToReturnDto>>> GetSavedProduct()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var products = await _productService.GetSavedProductsByUserIdAsync(userId);

            string? userName = User.FindFirstValue(ClaimTypes.GivenName);

            var productsToReturn = products.Select(product => new ProductToReturnDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                PictureUrl = product.PictureUrl,
                State = product.State,
                Price = product.Price,

                PhoneNumber = product.PhoneNumber,
                WhatsappNumber = product.WhatsappNumber,
                UserName = product.User.UserName
            }).ToList();

            return Ok(productsToReturn);
        }


        [HttpGet("IsProductSavedByUser")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult<bool>> IsProductSavedByUser(string productId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var value = await _productService.IsProductSavedAsync(userId, productId);

            return Ok(value);
        }


        [HttpDelete("DeleteSavedProduct")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult> DeleteSavedProduct(string productId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);


            var product = await _productService.GetProductByIdAsync(productId);
            if (product == null)
            {
                return NotFound(new APIResponce(404, "Product not found"));
            }

            var IsProductSaved = await _productService.IsProductSavedAsync(userId, productId);

            if (IsProductSaved == false)
            {
                return NotFound(new APIResponce(404, "Product not found"));
            }

            var result = await _productService.DeleteSavedProductAsync(userId, product.Id);

            if (result == false)
                return BadRequest(new APIResponce(400, "Deleting saved product problem"));

            return NoContent();
        }

        [HttpGet("image/{id}")]
        public async Task<IActionResult> GetProductImage(string id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product?.PictureUrl == null)
            {
                return NotFound(new APIResponce(404, "Product not found or image not available"));
            }

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", product.PictureUrl.TrimStart('/'));

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound(new APIResponce(404, "Image file not found"));
            }

            var extension = Path.GetExtension(filePath).ToLower(); // Define the extension

            var contentType = extension switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                _ => "application/octet-stream"
            };

            var memory = new MemoryStream(await System.IO.File.ReadAllBytesAsync(filePath));

            return File(memory, contentType, Path.GetFileName(filePath));
        }

    }
}
