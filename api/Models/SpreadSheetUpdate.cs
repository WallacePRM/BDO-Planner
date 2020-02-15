using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpreadSheetApi.Models
{
    public class SpreadSheetUpdate
    {
        public string Title { get; set; }
        public List<string> Columns { get; set; }
    }
}
