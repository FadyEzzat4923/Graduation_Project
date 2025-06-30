using System.ComponentModel.DataAnnotations;

namespace project.Dots
{
    public class LoginDto
    {
     [Required]
     public string Email { get; set; }
     [Required]
     public string Password { get; set; }
    }
}
