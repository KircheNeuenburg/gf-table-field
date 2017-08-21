function TableFieldModifyPreview( field_id ) {
    // if no field is given, modify for all
    if( typeof( field_id ) === 'undefined' || field_id === null ) {
        jQuery.each( form.fields, function( id, field ) {
            TableFieldModifyPreview( id );
        });
        
        return;
    }
    
    var html_id = field_id + 1;
    
    // get ids
    var table = jQuery( "#input_" + html_id );
    var dummy_id = jQuery( "#dummy_input_" + html_id );
    // get the tables data
    var cols = form.fields[ field_id ].cols;
    var rows = form.fields[ field_id ].rows;
    
    // remove the current table
    table.remove();
    
    // build the new table
    table = "<table id=\"input_" + html_id + "\"><thead>";
        table += "<tr>";
            table += "<th></th>";
            jQuery.each( cols, function( key, col ) {
                table += "<th>" + col + "</th>";
            });
        table += "</tr>";
    table += "</thead><tbody>";
        jQuery.each( rows, function( key, row ) {
            table += "<tr>"
                    table += "<th>" + row + "</th>";
                table += "<td></td>".repeat( Object.keys( cols ).length );
            table += "</tr>";
        });
    
    
    table += "<tbody></table>";
    
    // show the new table
    dummy_id.after( table );
}

function TableFieldGetFieldId( target ) {
    var wrapper = jQuery( target ).closest( ".gfield" );
    if( wrapper.length === 0 ) { return false; }
    
    return wrapper.attr( "id" ).replace( "field_", "" ) - 1;
}

function TableFieldAddRow( e ) {
    // get the fields id
    var field_id = TableFieldGetFieldId( e.target );
    if( field_id === false ) { return; }
    // check if data for this field already exists
    if( typeof( form.fields[ field_id ].rows ) === "undefined" || form.fields[ field_id ].rows === null ) {
        form.fields[ field_id ].rows = {};
        form.fields[ field_id ].cols = {};
        form.fields[ field_id ].next_row_id = 0;
        form.fields[ field_id ].next_col_id = 0;
    }
    
    // generate the rows id
    var id_num = form.fields[ field_id ].next_row_id;
    var id = "table_field_row_" + id_num + "_title";
    // add the row
    jQuery( '<div class="table-field-setting-wrapper"><input type="text" id="' + id + '" onkeyup="TableFieldChangeRowLabel(event, ' + field_id + ', ' + id_num + ')" onchange="TableFieldChangeRowLabel(event, ' + field_id + ', ' + id_num + ')"><button class="remove" onclick="TableFieldRemoveRow(\'' + id_num + '\');">X</button></div>' ).insertBefore( e.target );
    
    // register it
    form.fields[ field_id ].rows[ id_num ] = '';
    form.fields[ field_id ].next_row_id++;
    // modify preview
    TableFieldModifyPreview( field_id );
}

function TableFieldRemoveRow( id_num ) {
    var id = "table_field_row_" + id_num + "_title";
    var element = jQuery( "#" + id );
    // get the fields id
    var field_id = TableFieldGetFieldId( element );
    if( field_id === false ) { return; }
    
    // remove the setting
    element.parent().remove();
    // unregister it
    delete form.fields[ field_id ].rows[ id_num ];
    // modify preview
    TableFieldModifyPreview( field_id );
}

function TableFieldChangeRowLabel( e, field_id, id_num ) {
    form.fields[ field_id ].rows[ id_num ] = e.target.value;
    TableFieldModifyPreview( field_id );
}

function TableFieldAddCol( e ) {
    // get the fields id
    var field_id = TableFieldGetFieldId( e.target );
    if( field_id === false ) { return; }
    // check if data for this field already exists
    if( typeof( form.fields[ field_id ] ) === "undefined" || form.fields[ field_id ] === null ) {
        form.fields[ field_id ] = { "rows": {}, "cols": {}, "next_row_id": 0, "next_col_id": 0 };
    }
    
    // generate the cols id
    var id_num = form.fields[ field_id ].next_col_id;
    var id = "table_field_col_" + id_num + "_title";
    // add the col
    jQuery( '<div class="table-field-setting-wrapper"><input type="text" id="' + id + '" onkeyup="TableFieldChangeColLabel(event, ' + field_id + ', ' + id_num + ')" onchange="TableFieldChangeColLabel(event, ' + field_id + ', ' + id_num + ')"><button class="remove" onclick="TableFieldRemoveCol(\'' + id_num + '\');">X</button></div>' ).insertBefore( e.target );
    
    // register it
    form.fields[ field_id ].cols[ id_num ] = '';
    form.fields[ field_id ].next_col_id++;
    // modify preview
    TableFieldModifyPreview( field_id );
}

function TableFieldRemoveCol( id_num ) {
    var id = "table_field_col_" + id_num + "_title";
    var element = jQuery( "#" + id );
    // get the fields id
    var field_id = TableFieldGetFieldId( element );
    if( field_id === false ) { return; }
    
    // remove the setting
    element.parent().remove();
    // unregister it
    delete form.fields[ field_id ].cols[ id_num ];
    // modify preview
    TableFieldModifyPreview( field_id );
}

function TableFieldChangeColLabel( e, field_id, id_num ) {
    form.fields[ field_id ].cols[ id_num ] = e.target.value;
    TableFieldModifyPreview( field_id );
}

jQuery( document ).on( "gform_load_field_settings", function( e, field ) {
    var field_id = field.id - 1;
    var field_element_id = "#field_settings";
    
    // remove all cols and rows
    jQuery( ".table-field-setting-wrapper", field_element_id ).remove();

    // if this is a new field, set the variables
    if( typeof( field.cols ) === "undefined" || field.cols === null ) {
        field.cols = {};
        field.rows = {};
        field.next_col_id = 0;
        field.next_row_id = 0;
    }
    // convert the cols and rows to dictionaries, if they are still stored as arrays
    if( Array.isArray( field.cols ) ) {
        // cols
        var cols = {};
        field.next_col_id = 0;
        jQuery.each( field.cols, function( key, value ) {
            if( value === null ) { return; }
            cols[ field.next_col_id ] = value;
            field.next_col_id++;
        });
        field.cols = cols;
    }
    if( Array.isArray( field.rows ) ) {
        // rows
        var rows = {};
        field.next_row_id = 0;
        jQuery.each( field.rows, function( key, value ) {
            if( value === null ) { return; }
            rows[ field.next_row_id ] = value;
            field.next_row_id++;
        });
        field.rows = rows;
    }

    // add a setting for every existing col
    jQuery.each( field.cols, function( id_num, value ) {
        var id = "table_field_col_" + id_num + "_title";

        jQuery( "<div class=\"table-field-setting-wrapper\"><input type=\"text\" value=\"" + value + "\" id=\"" + id + "\" onkeyup=\"TableFieldChangeColLabel(event, " + field_id + ", " + id_num + ")\" onchange=\"TableFieldChangeColLabel(event, " + field_id + ", " + id_num + ")\"><button class=\"remove\" onclick=\"TableFieldRemoveCol(" + id_num + ");\">X</button></div>" ).insertBefore( jQuery( ".table_field_add_col_button", field_element_id ) ); 
    });
    
    // add a setting for every existing row
    jQuery.each( field.rows, function( id_num, value ) {
        var id = "table_field_row_" + id_num + "_title";

        jQuery( "<div class=\"table-field-setting-wrapper\"><input type=\"text\" value=\"" + value + "\" id=\"" + id + "\" onkeyup=\"TableFieldChangeRowLabel(event, " + field_id + ", " + id_num + ")\" onchange=\"TableFieldChangeRowLabel(event, " + field_id + ", " + id_num + ")\"><button class=\"remove\" onclick=\"TableFieldRemoveRow(" + id_num + ");\">X</button></div>" ).insertBefore( jQuery( ".table_field_add_row_button", field_element_id ) ); 
    });
});

// highlight hovered cols and rows
jQuery( document ).ready( function() {
	jQuery("table.table_field").delegate('td','mouseover mouseleave', function(e) {
        if (e.type == 'mouseover') {
          jQuery(this).parent().addClass("hover");
          jQuery("colgroup").eq(jQuery(this).index()).addClass("hover");
        }
        else {
          jQuery(this).parent().removeClass("hover");
          jQuery("colgroup").eq(jQuery(this).index()).removeClass("hover");
        }
    });
});