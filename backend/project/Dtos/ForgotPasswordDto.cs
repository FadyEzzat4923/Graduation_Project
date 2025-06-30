using System.ComponentModel.DataAnnotations;

namespace project.Dots
{
    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email   { get; set; }
    }
}
