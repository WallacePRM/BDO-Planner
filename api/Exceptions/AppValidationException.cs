using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpreadSheetApi.Exceptions
{
    public class AppValidationException : Exception
    {
        public AppValidationException(string message) : base(message)
        {
        }

        public AppValidationException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
