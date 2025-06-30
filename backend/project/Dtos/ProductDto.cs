using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace project.Dtos
{
    public class ProductDto
    {
        [Required]
        public IFormFile ImageFile { get; set; } 

        [Required]
        public string Title { get; set; }

        [Required]
        public string State { get; set; }

        [Required]
        public string PhoneNumber { get; set; }

        [Required]
        public string WhatsappNumber { get; set; }

        [Required]
        public decimal Price { get; set; }

        public bool IsLove { get; set; }

        [Required]
        public string Details { get; set; }
    }
}
