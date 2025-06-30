using System;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using project.Dtos;
using project_BLL.Identity;
using project_DAL.Entities;

namespace project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]

    public class BabyRecordController : ControllerBase
    {
        private readonly StoreContext _context;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IWebHostEnvironment _env;
        private readonly UserManager<AppUser> _userManager;

        public BabyRecordController(StoreContext context, IHttpClientFactory httpClientFactory, IWebHostEnvironment myenv, UserManager<AppUser> userManager)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;

            _env = myenv;
            _userManager = userManager;
        }








        [HttpPost("Upload")]
        public async Task<IActionResult> Upload([FromForm] FileDto file)
        {
            if (file == null || file.File.Length == 0)
                return BadRequest("No file uploaded.");

            var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = Path.GetFileName(file.File.FileName);
            var fileExtension = Path.GetExtension(fileName).ToLower();
            var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.File.CopyToAsync(stream);
            }

            var userId = _userManager.GetUserId(User);
            if (userId == null)
                return Unauthorized();

            var fileUrl = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}/uploads/{uniqueFileName}";

            string predictedClass = "Prediction Failed";
            try
            {
                var client = _httpClientFactory.CreateClient();
                using var form = new MultipartFormDataContent();
                using var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
                using var streamContent = new StreamContent(fileStream);
                streamContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                form.Add(streamContent, "file", uniqueFileName);

                var flaskResponse = await client.PostAsync("http://127.0.0.1:5000/predict", form);
                var predictionJson = await flaskResponse.Content.ReadAsStringAsync();

                if (flaskResponse.IsSuccessStatusCode)
                {
                    var predictionObj = JsonSerializer.Deserialize<JsonElement>(predictionJson);

                    if (predictionObj.TryGetProperty("prediction", out JsonElement predictionElement))
                    {
                        predictedClass = predictionElement.GetString() ?? "No Prediction";
                    }
                    else
                    {
                        return StatusCode(500, $"Prediction key missing. Response: {predictionJson}");
                    }

                    var record = new BabyRecord
                    {
                        FileName = uniqueFileName,
                        FilePath = filePath,
                        UploadedAt = DateTime.UtcNow,
                        UserId = userId,
                        AIName = "Siri",
                        FileUrl = fileUrl,
                        prediction = predictedClass
                    };

                    _context.BabyRecords.Add(record);
                    await _context.SaveChangesAsync();

                    return Ok(new
                    {
                        message = "File uploaded successfully"
                    });
                }
                else
                {
                    return StatusCode((int)flaskResponse.StatusCode, $"Error in prediction service. Response: {predictionJson}");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Prediction failed: {ex.Message}");
            }
        }


        [HttpGet("records")]
        public IActionResult GetUserRecords()
        {
            try
            {
                var userId = _userManager.GetUserId(User);
                if (userId == null)
                    return Unauthorized();

                var records = _context.BabyRecords
                    .Where(r => r.UserId == userId)
                    .Include(r => r.User)
                    .Select(r => new
                    {
                        r.Id,
                        r.FileName,
                        r.FilePath,
                        r.UploadedAt,
                        Prediction = r.prediction,
                        r.AIName,
                        FirstName = r.User != null ? r.User.FirstName : "Unknown",
                        LastName = r.User != null ? r.User.LastName : "User",
                        UserId = userId,
                        FileUrl = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}/uploads/{r.FileName}"
                    })
                    .OrderBy(r => r.UploadedAt)
                    .ToList();

                return Ok(records);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }




        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

        [HttpDelete("DeleteUserRecords/{userId}")]
        public async Task<IActionResult> DeleteUserRecords(string userId)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(currentUserId) || currentUserId != userId)
                return Unauthorized("You are not authorized to delete these records.");

            var userRecords = await _context.BabyRecords
                .Where(r => r.UserId == userId)
                .ToListAsync();

            if (!userRecords.Any())
                return NotFound("No records found for this user.");

            foreach (var record in userRecords)
            {
                var filePath = Path.Combine(_env.WebRootPath, "uploads", record.FileName);
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }

            _context.BabyRecords.RemoveRange(userRecords);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "All user records deleted successfully." });
        }


        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

        [HttpDelete("DeleteVoiceWithPrediction/{id}")]
        public async Task<IActionResult> DeleteVoiceWithPrediction(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var babyRecord = await _context.BabyRecords
                .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);

            if (babyRecord == null)
                return NotFound("Voice record not found or you don't have permission to delete it.");

            var filePath = Path.Combine(_env.WebRootPath, "uploads", babyRecord.FileName);
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }

            _context.BabyRecords.Remove(babyRecord);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Voice record and its prediction deleted successfully." });
        }

        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

        [HttpGet("RandomTips")]
        public IActionResult GetRandomTips()
        {
            var randomTips = _context.Tips
                .OrderBy(t => Guid.NewGuid())
                .Take(10)
                .ToList();
            return Ok(randomTips);
        }
        
    }

}
