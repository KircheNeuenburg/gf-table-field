var gf_table_field_rows = [];
var gf_table_field_cols = [];

function TableFieldModifyPreview() {
    
}

function TableFieldAddRow( e ) {
    // generate the rows id
    var id_num = gf_table_field_rows.length;
    var id = "table_field_row_" + id_num + "_title";
    // add the row
    jQuery( '<div class="row"><input type="text" id="' + id + '"><button class="remove" onclick="TableFieldRemoveRow(\'' + id_num + '\');">X</button></div>' ).insertBefore( e.target );
    // register it
    gf_table_field_rows[id_num] = '';
    // modify preview
    TableFieldModifyPreview();
}

function TableFieldRemoveRow( id_num ) {
    var id = "table_field_row_" + id_num + "_title";
    // remove the setting
    jQuery( "#" + id ).parent().remove();
    // unregister it
    gf_table_field_rows[id_num] = null;
    // modify preview
    TableFieldModifyPreview();
}

function TableFieldAddCol( e ) {
    // generate the cols id
    var id_num = gf_table_field_cols.length;
    var id = "table_field_col_" + id_num + "_title";
    // add the col
    jQuery( '<div class="col"><input type="text" id="' + id + '"><button class="remove" onclick="TableFieldRemoveCol(\'' + id_num + '\');">X</button></div>' ).insertBefore( e.target );
    // register it
    gf_table_field_cols[id_num] = '';
    // modify preview
    TableFieldModifyPreview();
}

function TableFieldRemoveCol( id_num ) {
    var id = "table_field_col_" + id_num + "_title";
    // remove the setting
    jQuery( "#" + id ).parent().remove();
    // unregister it
    gf_table_field_cols[id_num] = null;
    // modify preview
    TableFieldModifyPreview();
}
