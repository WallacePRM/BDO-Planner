
/* ========== Generic ========== */

function enableNewSpreadsheet() {

    if (window.location.search === '?newspreadsheet') {
        
        $('.mns-background').addClass('show');
    }
}

function loadSpreadsheet() {

    // pegar o id na url do site
    var parameters = window.location.search;
    var urlParameters = new URLSearchParams(parameters);
    var id = urlParameters.get('id');
    
    if (id !== null) {

        // Enviar uma requisicao pedindo os dados da planilha
        var promise = getSpreadsheet(id);

        promise.then(function(spreadsheet) {

            // chamar a funcao showSpreadsheet() e passar os dados da planilha 
            showSpreadsheet(spreadsheet);


            $('.wrapper-link .link').html(window.location.href);
            $('.wrapper-link').addClass('show'); 

            blockEditRows();
        });  
    }

}

function blockEditRows() {

    var parameters = window.location.search;
    var urlParameters =  new URLSearchParams(parameters);
    var rowId = urlParameters.get('rowid');
    var rows = $('.spreadsheet tbody .row').toArray();

    if (rowId !== null) {
        for (var i = 0; i < rows.length; i++) {

            if (rowId !== $(rows[i]).attr('data-id')) {
                $(rows[i]).find('input').attr('disabled', 'disabled');
                $(rows[i]).addClass('disabled');
            } 
        }
    }
}

/*
    spreadsheet = {
        title: string,
        id: string,
        rows: [{
            id: string,
            data: {
                columnName: string
            }
        }],
        columns: [string]
    };
*/

function showSpreadsheet(spreadsheet) {

    $('.spreadsheet').attr('data-id', spreadsheet.id);

    var $header = $('.spreadsheet .header');

    for (var i = 0; i < spreadsheet.columns.length; i++) {
        $header.append(
            `<th class="column header"><span>${spreadsheet.columns[i]}</span></th>`
        );
    }

    for (var i = 0; i < spreadsheet.rows.length; i++) {

        var columnName = spreadsheet.columns[0];
        var $row = $(`
            <tr class="row" data-id="${spreadsheet.rows[i].id}">                           
                <td class="column">
                    <div class="number-wrapper">
                        <span class="number"> ${i + 1} </span>
                        <i onclick="handleCopyRowLink(event)" class="fas fa-link row-link"></i>
                    </div>
                    <input onChange="handleColumnChange(event)" value="${spreadsheet.rows[i].data[columnName] || ''}"/>
                </td>               
            </tr>
        `);

        for (var c = 1; c < spreadsheet.columns.length; c++) {
            var columnName = spreadsheet.columns[c];
            $row.append(`<td class="column"><input onChange="handleColumnChange(event)" value="${spreadsheet.rows[i].data[columnName] || ''}"/></td>`);
        }
               
        $('.spreadsheet tbody').append($row);
    }

    $('[name="nameGuild"]').val(spreadsheet.title);
    $('.spreadsheet').addClass('show');
}
 
function generateLink(id) {

    var link = `${window.location.origin}${window.location.pathname}?id=${id}`;

    return link;
}

function generateRowLink(id, rowId) {

    var link = generateLink(id);
    link = link + '&rowid=' + rowId;

    return link;
}

function getSpreadsheetId() {

    var spreadsheetId = $('.spreadsheet').attr('data-id');
    return spreadsheetId;
}

function copyTextToClipboard(text) {

    var $input = $('<input/>');
    $input.val(text);
    $('body').append($input);
    $input[0].select();
    document.execCommand('copy');
    $input.remove();
}

function showLinkCopied() {
    var text = 'Copiado!';

    showMessageBlock(text);
}

function getColumnsName() {

    // Obter os nomes da coluna
    var columnName = [];
    var columns = $('.spreadsheet .column.header span').toArray();

    for (var i = 0; i < columns.length; i++) {
        columnName.push($(columns[i]).html());
    }

    return columnName;
}

function showMessageBlock(text) {

    $('.message-block span').html(text);
    $('.message-block').fadeIn();

    setTimeout(function() {
        $('.message-block').fadeOut();
    }, 5000);
}

/* ========== Handles ========== */

function handleShowBackgroundRow() {

   // $('.background-row').toggleClass('show');
   var $backgroundRow = $('.background-row');

   if ($backgroundRow.attr('style') === 'display: block;') {
        $backgroundRow.fadeOut();
   }
   else {
       $backgroundRow.fadeIn();
   }
}

function handleNewColumn() {

    var $column = $(`
        <div class="field">
            <input name="columnName" type="text" placeholder="Nome da coluna">
            <i onclick="handleRemoveColumn(event)" class="fa fa-times"></i>
        </div>
    `);

    $column.insertBefore('[name="btnNewColumn"]');
}

function handleRemoveColumn(event) {

    $(event.currentTarget).closest('.field').remove();
}

function handleCreateSpreadsheet() {
    
    var columnName = [];
    
    // Pegar valores das colunas
    var fields = $('.mns-background [name="columnName"]').toArray();

    for (var i = 0; i < fields.length; i++) {
        
        columnName.push($(fields[i]).val());
    }
    
    var rows = [];
    
    for (var c = 0; c < 10; c++) {

        var rowData = {};

        for (var i = 0; i < columnName.length; i++) {

            rowData[columnName[i]] = '';
        }

        rows.push({ data: rowData });
    }

    var spreadsheet = {
        title: '',
        columns: columnName,
        rows: rows
    };

    var $btnConfirm = $('[name="btnConfirm"]');
    $btnConfirm.html(`
        <i class="fas fa-spinner fa-pulse"></i>
         Criando planilha
    `);
    $btnConfirm.attr('disabled', 'disabled');

    var promise = saveSpreadsheet(spreadsheet);

    promise.then(function(response) {

        spreadsheet = response;
        
        showSpreadsheet(spreadsheet);
        $('.mns-background').removeClass('show');

        // Criar link
        var link = generateLink(spreadsheet.id);

        $('.wrapper-link .link').html(link);
        $('.wrapper-link').addClass('show'); 
        
        $btnConfirm.html('Confirmar');
        $btnConfirm.attr('disabled', null);

        window.location.assign(link);
    });


    promise.catch(function(error) {
        
        $btnConfirm.html('Confirmar');
        $btnConfirm.attr('disabled', null);

        alert(error);
    });   
}

function handleColumnChange(event) {

    var $input = $(event.currentTarget);
    var inputValue = $input.val();
    var $column = $input.closest('.column');
    var inputIndex = $column.index();
    var $header = $('.column.header').eq(inputIndex);
    var header = $header.find('span').html();
    
    var rowData = {
        [header]: inputValue
    };

    var spreadsheetId = getSpreadsheetId();
    var rowId = $input.closest('.row').attr('data-id');

    updateRow(spreadsheetId, rowId, rowData);
    
}

function handleChangeNameGuild() {

    var id = getSpreadsheetId();
    var spreadsheet = {
        title: $('[name="nameGuild"]').val()
    };

    updateSpreadsheet(id, spreadsheet);
}

function handleCopyLink() {

    var link = $('.link').html();

    copyTextToClipboard(link);
    showLinkCopied();   
}

function handleSearchText() {

    // Obter valores
    var $filedSearch = $('.field-search');
    var searchValue = $filedSearch.val().toLowerCase(); 

    // Verificar se o valor obtido esta presente na planilha
    var rows = $('.spreadsheet tbody .row').toArray();

    for (var r = 0; r < rows.length; r++) {

        var columns = $(rows[r]).find('.column').toArray();

        for (var i = 0; i < columns.length; i++) {
            var columnValue = $(columns[i]).find('input').val().toLowerCase();

            if (columnValue.indexOf(searchValue) !== -1 && searchValue !== '') {
                $(columns[i]).closest('.row').addClass('selected');
                break;
            }
            else {
                $(columns[i]).closest('.row').removeClass('selected');
            }
        }
    }
}

function handleShowOptions() {

    $('.popup-background').toggleClass('show');
}

function handleCreateRows() {

    // Obtendo valores
    var id = $('.spreadsheet').attr('data-id');
    var rowCount = parseInt($('[name="rowCount"]').val());

    var numbers = $('.number').toArray();
    var i = numbers.length - 1;
    var numberLine = parseInt($(numbers[i]).html()) + 1;

    if (isNaN(rowCount)) {
        rowCount = 0;
    }

    var columnsName = getColumnsName();
    
    
    var rows = [];

    for (var i = 0; i < rowCount; i++) {

        var rowData = {};

        for (var n = 0; n < columnsName.length; n++) {

            rowData[columnsName[n]] = '';
        }

        rows.push(rowData);
    }

    var promise = CreatingRows(id, rows);

    // Criando linhas
    promise.then(function(response) {

        rows = response;

        for (var i = 0; i < rowCount; i++) {

            var name = columnsName[0];
            var $row = $(`
                <tr class="row" data-id="${rows[i].id}">                           
                    <td class="column">
                        <div class="number-wrapper">
                            <span class="number"> ${i + numberLine} </span>
                        </div>
                        <input onChange="handleColumnChange(event)" value="${rows[i].data[name]}"/>
                    </td>               
                </tr>
            `);

            for (var c = 1; c < columnsName.length; c++) {
                var name = columnsName[c];
                $row.append(`<td class="column"><input onChange="handleColumnChange(event)" value="${rows[i].data[name]}"/></td>`);
            }
                
            $('.spreadsheet tbody').append($row);
        }

        $('.background-row').fadeOut();
        $btnConfirm.html('Confirmar');
        $btnConfirm.attr('disabled', null);
    });

    // Loading
    var $btnConfirm = $('.background-row .btn.btn-primary');

    $btnConfirm.html(`
        <i class="fas fa-spinner fa-pulse"></i>
        Criando linhas
    `);
    $btnConfirm.attr('disabled', 'disabled');  

    // Fim load

    promise.catch(function(error) {
        $btnConfirm.html('Confirmar');
        $btnConfirm.attr('disabled', null);

        alert(error);
    });
}

function handleShowUpdateColumns() {
       
    var $modal = $('.mns-background').clone();
    $modal.addClass('updated-columns');
    $modal.find('h2').html('Alterar colunas');
    $modal.find('.mns-header').append(`
        <i onclick="handleHiddenModal()" class="fa fa-times"></i>
    `);

    var columnsName = getColumnsName()

    // Criar os inputs de acordo com a quantidade de nomes
    $modal.find('.field').remove();

    // Adicionar novas colunas no modal
    for (var i = columnsName.length - 1; i >= 0; i--) {
        $modal.find('.content-fields').prepend(`
        <div class="field">
            <input name="columnName" type="text" placeholder="Nome da coluna" value="${columnsName[i]}">
            <i onclick="handleRemoveColumn(event)" class="fa fa-times" aria-hidden="true"></i>
        </div>
        `);
    }

    $modal.find('[name="btnConfirm"]').attr('onclick', 'handleUpdateColumns()');

    // Exibir o modal(clone)
    $('body').append($modal.addClass('show'));

}

function handleHiddenModal() {

    $('.mns-background.updated-columns').remove();
}

function handleUpdateColumns() {
    
    var columnsName = [];

    // obter Id da planilha
    var id = getSpreadsheetId();

    // Obter valores dos inputs
    var inputs = $('.mns-background.updated-columns').find('input').toArray();

    for (var i = 0; i < inputs.length; i++) {
        columnsName.push($(inputs[i]).val());
    }
    // Criar objeto com os valores obtidos
    var spreadsheet = {
        columns: columnsName
    };

    // Fazer requisicao PUT
    var promise = updateSpreadsheetColumns(id, spreadsheet);

    // Recriar planilha com os novos valores
    $('.spreadsheet').html(`
        <thead>
            <tr class="row header"></tr>
        </thead>
        <tbody></tbody>
    `);

    promise.then(function () {

        promise = getSpreadsheet(id);
        promise.then(showSpreadsheet);

        $('.mns-background.updated-columns').remove();
    });

}

function handleCopyRowLink(event) {

    var id = getSpreadsheetId();
    var $row = $(event.currentTarget).closest('.row');
    var rowId = $row.attr('data-id');
    var link = generateRowLink(id, rowId);
    
    var text = 'Link copiado!';

    copyTextToClipboard(link);
    showMessageBlock(text);
}

/* ========== Initial ========== */

$(document).ready(function() {

    enableNewSpreadsheet();
    loadSpreadsheet(); 
});

