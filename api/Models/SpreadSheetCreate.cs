using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpreadSheetApi.Models
{
    public class SpreadSheetCreate
    {
        public string email { get; set; }
        public string Title { get; set; }
        public List<string> Columns { get; set; }
        public List<SpreadSheetCreateRow> Rows { get; set; }

        public class SpreadSheetCreateRow 
        {
            public Dictionary<string, string> Data { get; set; }
        }
    }
}
