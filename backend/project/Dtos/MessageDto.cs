using project_DAL.Identity;

namespace project.Dots
{
    public class MessageDto
    {
        public string Text { get; set; } = null!;
        public bool IsEdited { get; set; }
        public bool CanEdit { get; set; }


    }
}
