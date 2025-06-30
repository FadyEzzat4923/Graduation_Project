using project.Errors;
using System.Net;
using System.Text.Json;

namespace project.MiddleWare
{
    public class ExceptionMiddleWare
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleWare> _logger;
        private readonly IWebHostEnvironment _env;

        public ExceptionMiddleWare(RequestDelegate next, ILogger<ExceptionMiddleWare> logger, IWebHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                // Before Request
                await _next.Invoke(httpContext);
                // After Request 
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message); // Log Exception in DevolpmentMode

                // Header Response
                httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError; //500
                httpContext.Response.ContentType = "application/json";

                // Body Response
                var response = _env.IsDevelopment() ?          //500                     
                      new APIExceptionResponse((int)HttpStatusCode.InternalServerError, ex.Message, ex.StackTrace.ToString())
                      :
                       new APIExceptionResponse((int)HttpStatusCode.InternalServerError);

                var font = new JsonSerializerOptions() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }; //Edit Font To CamelCase

                var json = JsonSerializer.Serialize(response, font); //From String To Json

                await httpContext.Response.WriteAsync(json);
            }
        }
    }
}
