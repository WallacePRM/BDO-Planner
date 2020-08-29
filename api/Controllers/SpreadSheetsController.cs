using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SpreadSheetApi.Models;

using SpreadSheetApi.Repositories.Abstract;

namespace SpreadSheetApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SpreadSheetsController : ControllerBase
    {        
        private readonly ILogger<SpreadSheetsController> _logger;
        private readonly ISpreadSheetRepository _spreadSheetRepo;

        public SpreadSheetsController(ILogger<SpreadSheetsController> logger, ISpreadSheetRepository spreadSheetRepository)
        {
            _logger = logger;
            _spreadSheetRepo = spreadSheetRepository;
        }

        [HttpPost("")]
        [ProducesResponseType(typeof(SpreadSheet), StatusCodes.Status201Created)]
        public async Task<IActionResult> CreateSpreadSheet([FromBody]SpreadSheetCreate model)
        {
            if(!ModelState.IsValid)
            {
                return null;
            }

            SpreadSheet spreadSheet = new SpreadSheet
            {
                Id = Guid.NewGuid().ToString(),
                email = model.email,
                Title = model.Title ?? "Sem título",
                Columns = model.Columns,
                Rows = model.Rows?.Select(x => new SpreadSheetRow 
                { 
                    Id = Guid.NewGuid().ToString(),
                    Data = x.Data
                }).ToList()
            };

            await _spreadSheetRepo.Insert(spreadSheet);

            return Ok(spreadSheet);
        }
    
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(SpreadSheet), StatusCodes.Status200OK)]
        public async Task<IActionResult> UpdateSpreadSheet(string id, [FromBody]SpreadSheetUpdate model)
        {
            SpreadSheet spreadSheet = new SpreadSheet
            {
                Id = id,
                Title = model.Title,
                Columns = model.Columns
            };

            var saved = await _spreadSheetRepo.Update(spreadSheet);

            spreadSheet.Title = saved.Title;
            spreadSheet.Columns = saved.Columns;

            return Ok(spreadSheet);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(SpreadSheet), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetSpreadSheet(string id)
        {
            var spreadSheet = await _spreadSheetRepo.Get(id);

            spreadSheet.email = null;

            return Ok(spreadSheet);
        }
    

        [HttpPost("{id}/rows")]
        [ProducesResponseType(typeof(SpreadSheetRow[]), StatusCodes.Status201Created)]
        public async Task<IActionResult> InsertRow(string id, [FromBody]Dictionary<string, string>[] model)
        {
            var spreadSheetRows = model.Select(row => new SpreadSheetRow
            {
                Id = Guid.NewGuid().ToString(),
                Data = row,
            }).ToList();

            await _spreadSheetRepo.InsertRow(id, spreadSheetRows);

            return Ok(spreadSheetRows);
        }
   
        [HttpPut("{id}/rows/{rowId}")]
        [ProducesResponseType(typeof(SpreadSheetRow), StatusCodes.Status200OK)]
        public async Task<IActionResult> UpdateRow(string id, string rowId, [FromBody]Dictionary<string, string> model)
        {
            var row = new SpreadSheetRow
            {
                Id = rowId,
                Data = model
            };

            var savedRow = await _spreadSheetRepo.UpdateRow(id, row);

            return Ok(savedRow);
        }

        [HttpDelete("{id}/rows/{rowId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteRow(string id, string rowId)
        {
            await _spreadSheetRepo.DeleteRow(id, rowId);
            return Ok();
        }
    }
}
