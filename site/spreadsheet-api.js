
var urlBase = 'https://appnetcore01.azurewebsites.net/api/spreadsheets';

function saveSpreadsheet(spreadsheet) {
    
    return fetchJson(urlBase, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(spreadsheet)
    });
}

function updateRow(spreadsheetId, rowId, rowData) {

    fetch(urlBase + '/' + spreadsheetId + '/rows/' + rowId, {

        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rowData)
    });
}

function getSpreadsheet(id) {

    return fetchJson(urlBase + '/' + id);
}

function updateSpreadsheet(id, spreadsheet) {
    
    fetchJson(urlBase + '/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(spreadsheet)
    });
}

function CreatingRows(id, rows) {

    return fetchJson(urlBase + '/' + id + '/rows', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rows)
    });
}

function updateSpreadsheetColumns(id, spreadsheet) {

    return fetchJson(urlBase + '/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(spreadsheet)
    });

}