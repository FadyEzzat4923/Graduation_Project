using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using project.Dots;
using project.Dtos;
using project_BLL.Identity;
using Project_BLL.Interfaces;
using project_DAL.Data;
using project_DAL.Identity;

namespace project.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly StoreContext _dbContext;
        private readonly ITokenServices _tokenServices;
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly SignInManager<AppUser> _signInManager;

        public AccountController(StoreContext dbContext, ITokenServices tokenServices, UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration, SignInManager<AppUser> signInManager)
        {
            _dbContext = dbContext;
            _tokenServices = tokenServices;
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _signInManager = signInManager;
        }



        [HttpPost("register")]
        public async Task<ActionResult<object>> Register(RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    email = registerDto.Email,
                    password = "Invalid request data"
                });
            }

            var existingUser = await _userManager.FindByEmailAsync(registerDto.Email);
            if (existingUser != null)
            {
                return BadRequest(new
                {
                    email = "This email is already taken",
                    password = (string?)null
                });
            }

            var passwordValidator = new PasswordValidator<AppUser>();
            var passwordResult = await passwordValidator.ValidateAsync(_userManager, null, registerDto.Password);

            if (!passwordResult.Succeeded)
            {
                return BadRequest(new
                {
                    email = (string?)null,
                    password = "Password must be at least 8 characters, include uppercase, lowercase, and a number"
                });
            }

            var user = new AppUser()
            {
                Email = registerDto.Email,
                UserName = registerDto.Email.Split('@')[0],
                PhoneNumber = registerDto.PhoneNumber,
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded)
            {
                return BadRequest(new
                {
                    email = "Error creating user",
                    password = (string?)null
                });
            }

            return Ok(new UserDto()
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Email = user.Email,
                Token = await _tokenServices.CreateToken(user, _userManager),
                Id = user.Id,
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<object>> Login(LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    email = loginDto.Email,
                    password = "Invalid request data"
                });
            }

            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null)
            {
                return Unauthorized(new
                {
                    email = "Email not found",
                    password = (string?)null
                });
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if (!result.Succeeded)
            {
                return Unauthorized(new
                {
                    email = (string?)null,
                    password = "Incorrect password"
                });
            }

            var token = await _tokenServices.CreateToken(user, _userManager);

            return Ok(new UserDto()
            {
                Email = user.Email,
                Token = token,
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
            });
        }


        [HttpPut("update-profile")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult<UserDto>> UpdateProfile([FromBody] UpdateProfileDto updateDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized(new { message = "User not found" });

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound(new { message = "User not found" });

            var existingUser = await _userManager.FindByEmailAsync(updateDto.Email);
            if (existingUser != null && existingUser.Id != userId)
            {
                return BadRequest(new { message = "Email is already in use" });
            }

            user.FirstName = updateDto.FirstName;
            user.LastName = updateDto.LastName;
            user.Email = updateDto.Email;
            user.PhoneNumber = updateDto.PhoneNumber;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded) return BadRequest(result.Errors);

            var token = await _tokenServices.CreateToken(user, _userManager);

            return Ok(new UserDto()
            {
                Email = user.Email,
                Token = token,
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName
            });
        }
        [HttpPost("forget-password")]
        public async Task<IActionResult> ForgetPassword(ForgotPasswordDto forgotPasswordDto, [FromServices] IEmailService emailService)
        {
            var user = await _userManager.FindByEmailAsync(forgotPasswordDto.Email);
            if (user == null) return NotFound(new { message = "User not found" });

            var resetCode = new Random().Next(100000, 999999).ToString();
            user.ResetCode = resetCode;
            user.ResetCodeExpiration = DateTime.UtcNow.AddMinutes(5);

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded) return BadRequest(new { message = "Error updating user's reset code" });

            var subject = "Password Reset Code";
            var body = $"<p>Your password reset code is: <strong>{resetCode}</strong></p><p>This code is valid for 5 minutes.</p>";

            await emailService.SendEmailAsync(user.Email, subject, body);

            return Ok(new { message = "Reset code sent to your email successfully." });
        }
        [HttpPost("validate-token")]
        public async Task<IActionResult> ValidateToken([FromBody] TokenRequest tokenRequest)
        {
            if (string.IsNullOrEmpty(tokenRequest.Token))
                return BadRequest(new { isValid = false, message = "Token is required" });

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes("8FCcBttNG8DHk+9JsmuvNAH0tXkIBQDJjMIMScp+2WU=");

            try
            {
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                var principal = tokenHandler.ValidateToken(tokenRequest.Token, validationParameters, out var validatedToken);

                if (validatedToken is not JwtSecurityToken jwtToken)
                    return Ok(new { isValid = false });

                var userIdClaim = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim))
                    return Ok(new { isValid = false });

                var user = await _userManager.FindByIdAsync(userIdClaim);
                if (user == null)
                    return Ok(new { isValid = false });

                return Ok(new { isValid = true });
            }
            catch
            {
                return Ok(new { isValid = false });
            }
        }


        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            var user = await _userManager.FindByEmailAsync(resetPasswordDto.Email);
            if (user == null) return NotFound(new { message = "User not found" });

            if (user.ResetCode != resetPasswordDto.ResetCode || user.ResetCodeExpiration < DateTime.UtcNow)
            {
                return BadRequest(new { message = "Invalid or expired reset code" });
            }

            var passwordHasher = new PasswordHasher<AppUser>();
            var passwordVerificationResult = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, resetPasswordDto.NewPassword);

            if (passwordVerificationResult == PasswordVerificationResult.Success || passwordVerificationResult == PasswordVerificationResult.SuccessRehashNeeded)
            {
                return BadRequest(new { message = "New password must be different from the old password" });
            }

            var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, resetToken, resetPasswordDto.NewPassword);

            if (!result.Succeeded) return BadRequest(result.Errors);

            user.ResetCode = null;
            user.ResetCodeExpiration = null;
            await _userManager.UpdateAsync(user);

            return Ok(new { message = "Password reset successfully" });
        }


        [HttpPost("verify-reset-code")]
        public async Task<IActionResult> VerifyResetCode(VerifyResetCodeDto verifyResetCodeDto)
        {
            var user = await _userManager.FindByEmailAsync(verifyResetCodeDto.Email);
            if (user == null) return NotFound(new { message = "User not found" });

            if (user.ResetCode != verifyResetCodeDto.ResetCode || user.ResetCodeExpiration < DateTime.UtcNow)
            {
                return BadRequest(new { message = "Invalid or expired reset code" });
            }

            return Ok(new { message = "Reset code is valid" });
        }

    }

}
 














