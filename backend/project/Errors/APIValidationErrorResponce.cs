namespace project.Errors
{
    public class APIValidationErrorResponce : APIResponce
    {
        public IEnumerable<String> Errors { get; set; }
        public APIValidationErrorResponce() : base(400)
        {
            Errors = new List<string>();
        }
    }
}
