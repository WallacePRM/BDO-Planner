using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpreadSheetApi.Models
{
    public class SpreadSheet
    {
        public string Id { get; set; }
        public string email { get; set; }
        public string Title { get; set; }
        public List<string> Columns { get; set; }
        public List<SpreadSheetRow> Rows { get; set; }
    }

    public class SpreadSheetRow
    {
        public string Id { get; set; }
        public Dictionary<string, string> Data { get; set; }
    }
}
