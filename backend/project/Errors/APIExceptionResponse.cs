namespace project.Errors
{
    public class APIExceptionResponse : APIResponce
    {
        // For ServerError Exception  
        public APIExceptionResponse(int statusCode, string? massage = null, string? detalis = null)
                    : base(statusCode, massage)
        {
            Detalis = detalis;
        }

        public string? Detalis { get; set; }
    }
}
