namespace project.Errors
{
    public class APIResponce
    {
        public string? Massage { get; set; }
        public int StatusCode { get; set; }

        public APIResponce(int statusCode, string? massage = null)
        {
            StatusCode = statusCode;
            Massage = massage ?? GetDefulteMassageForStatusCode();
        }

        private string? GetDefulteMassageForStatusCode()
        {
            return StatusCode switch
            {
                400 => "The request cannot be fulfilled due to bad syntax", // Bad Request or Validation Error 
                401 => "You Are Not Authorized", // Unauthorized
                404 => "Resource Was Not Found", // Not Found
                500 => "Well, This is unexpected. An Error has occurred, and we are working to fix the problem! We will be up and running shortly", // Server Error
                _ => null // Other
            };
        }
    }
}
