using SpreadSheetApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpreadSheetApi.Repositories.Abstract
{
    public interface ISpreadSheetRepository
    {
        Task<SpreadSheet> Insert(SpreadSheet spreadSheet);
        Task<SpreadSheet> Update(SpreadSheet spreadSheet);
        Task<SpreadSheet> Get(string spreadSheetId);
        Task<IEnumerable<SpreadSheetRow>> InsertRow(string spreadSheetId, IEnumerable<SpreadSheetRow> rows);
        Task<SpreadSheetRow> UpdateRow(string spreadSheetId, SpreadSheetRow row);
        Task DeleteRow(string spreadSheetId, string rowId);
    }
}
