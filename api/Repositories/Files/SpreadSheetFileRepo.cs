using Microsoft.AspNetCore.Hosting;
using SpreadSheetApi.Exceptions;
using SpreadSheetApi.Models;
using SpreadSheetApi.Repositories.Abstract;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace SpreadSheetApi.Repositories.Files
{
    public class SpreadSheetFileRepo : ISpreadSheetRepository
    {
        private readonly string _workDir;

        public SpreadSheetFileRepo(IWebHostEnvironment webHost)
        {
            _workDir = Path.Combine(webHost.ContentRootPath, "spreadsheets");

            if (!Directory.Exists(_workDir))
                Directory.CreateDirectory(_workDir);
        }

        public async Task<SpreadSheet> Get(string spreadSheetId)
        {
            var filename = Path.Combine(_workDir, spreadSheetId);

            if (!File.Exists(filename))
                throw new AppValidationException("Spreadsheet not found");

            var json = await File.ReadAllTextAsync(filename);
            var savedSpreadSheet = JsonSerializer.Deserialize<SpreadSheet>(json);

            return savedSpreadSheet;
        }

        public async Task<SpreadSheet> Insert(SpreadSheet spreadSheet)
        {
            var filename = Path.Combine(_workDir, spreadSheet.Id);
            var json = JsonSerializer.Serialize(spreadSheet);

            await File.WriteAllTextAsync(filename, json);

            return spreadSheet;
        }        

        public async Task<SpreadSheet> Update(SpreadSheet spreadSheet)
        {
            var filename = Path.Combine(_workDir, spreadSheet.Id);

            if (!File.Exists(filename))
                throw new AppValidationException("Spreadsheet not found");

            var json = await File.ReadAllTextAsync(filename);
            var savedSpreadSheet = JsonSerializer.Deserialize<SpreadSheet>(json);

            savedSpreadSheet.Title = spreadSheet.Title ?? savedSpreadSheet.Title;
            savedSpreadSheet.Columns = spreadSheet.Columns ?? savedSpreadSheet.Columns;

            json = JsonSerializer.Serialize(savedSpreadSheet);
            await File.WriteAllTextAsync(filename, json);

            return savedSpreadSheet;
        }

        public async Task<IEnumerable<SpreadSheetRow>> InsertRow(string spreadSheetId, IEnumerable<SpreadSheetRow> rows)
        {
            var filename = Path.Combine(_workDir, spreadSheetId);

            if (!File.Exists(filename))
                throw new AppValidationException("Spreadsheet not found");

            var json = await File.ReadAllTextAsync(filename);
            var savedSpreadSheet = JsonSerializer.Deserialize<SpreadSheet>(json);

            savedSpreadSheet.Rows ??= new List<SpreadSheetRow>();
            savedSpreadSheet.Rows.AddRange(rows);

            json = JsonSerializer.Serialize(savedSpreadSheet);
            await File.WriteAllTextAsync(filename, json);

            return rows;
        }

        public async Task<SpreadSheetRow> UpdateRow(string spreadSheetId, SpreadSheetRow row)
        {
            var filename = Path.Combine(_workDir, spreadSheetId);

            if (!File.Exists(filename))
                throw new AppValidationException("Spreadsheet not found");

            var json = await File.ReadAllTextAsync(filename);
            var savedSpreadSheet = JsonSerializer.Deserialize<SpreadSheet>(json);

            var savedRow = savedSpreadSheet.Rows?.FirstOrDefault(x => x.Id == row.Id);
            if (savedRow == null)
                throw new AppValidationException("Spreadsheet row not found");

            foreach(var pair in row.Data)
            {
                if (savedRow.Data.ContainsKey(pair.Key))
                    savedRow.Data[pair.Key] = pair.Value;
                else
                    savedRow.Data.Add(pair.Key, pair.Value);
            }

            json = JsonSerializer.Serialize(savedSpreadSheet);
            await File.WriteAllTextAsync(filename, json);

            return savedRow;
        }

        public async Task DeleteRow(string spreadSheetId, string rowId)
        {
            var filename = Path.Combine(_workDir, spreadSheetId);

            if (!File.Exists(filename))
                throw new AppValidationException("Spreadsheet not found");

            var json = await File.ReadAllTextAsync(filename);
            var savedSpreadSheet = JsonSerializer.Deserialize<SpreadSheet>(json);

            var savedRow = savedSpreadSheet.Rows?.RemoveAll(x => x.Id == rowId);            
            
            json = JsonSerializer.Serialize(savedSpreadSheet);
            await File.WriteAllTextAsync(filename, json);            
        }
    }
}
