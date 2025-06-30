using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using project_BLL.Identity;

namespace project_DAL.Entities
{
    public class BabyRecord
    {
        public int Id { get; set; } 
        public string FileName { get; set; }

        public string FilePath { get; set; }
         public DateTime UploadedAt { get; set; }
        public string? prediction {  get; set; }
        public string AIName { get; set; }
        public string UserId { get; set; }
        public AppUser User { get; set; }
        public string FileUrl { get; set; }


    }
}
