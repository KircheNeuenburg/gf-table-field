function TableFieldModifyPreview( field_id ) {
    // if no field is given, modify for all
    if( typeof( field_id ) === 'undefined' || field_id === null ) {
        jQuery.each( form.fields, function( id, field ) {
            if( typeof( field ) === 'undefined' || field === null || typeof( field.rows ) === 'undefined' || field.rows === null ) { return; }
            
            TableFieldModifyPreview( field.id );
        });
        
        return;
    }
    
    var field = TableFieldGetField( field_id );
    if( field === false ) { return false; }
    
    var html_id = field.id;
    
    // get ids
    var table = jQuery( "#input_" + html_id );
    var dummy_id = jQuery( "#dummy_input_" + html_id );
    // get the tables data
    var cols = field.cols;
    var rows = field.rows;
    
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
            table += "<tr>";
                    table += "<th>" + row + "</th>";
                table += "<td></td>".repeat( Object.keys( cols ).length );
            table += "</tr>";
        });
    
    
    table += "<tbody></table>";
    
    // show the new table
    dummy_id.after( table );
}

function TableFieldGetField( target ) {
    var field = false;
    var id = null;
    
    // get field by id
    if( Number.isInteger( target ) ) {
        id = target;
    }
    else {
        // get field by target
        var wrapper = jQuery( target ).closest( ".gfield" );
        if( wrapper.length === 0 ) { return false; }
        // get the fields id
        id = wrapper.attr( "id" ).replace( "field_", "" );
    }
    
    // get the actual field
    jQuery.each( form.fields, function( index, value ) {
        if( value.id == id ) {
            field = value;
            return false;
        }
    });
    return field;
}

function TableFieldAdd( e, type ) {
    if( type != 'col' && type != 'row' ) { return; }
    // get the fields id
    var field = TableFieldGetField( e.target );
    console.log( field );
    if( field === false ) { return; }
    
    // check if data for this field already exists
    if( typeof( field.rows ) === "undefined" || field.rows === null ) {
        field.rows = {};
        field.cols = {};
        field.next_row_id = 0;
        field.next_col_id = 0;
    }
    
    // generate the cols or rows id
    var id_num = type == 'col' ? field.next_col_id : field.next_row_id;
    
    var html_id = "table_field_" + type + "_" + id_num + "_title";
    // add the col or row
    TableFieldCreateOption( html_id, field.id, id_num, type, e.target );

    // register it
    if( type == 'row' ){
        field.rows[ id_num ] = '';
        field.next_row_id++;
    }
    else {
        field.cols[ id_num ] = '';
        field.next_col_id++;
    }
    
    // modify preview
    TableFieldModifyPreview( field.id );
}

function TableFieldCreateOption( html_id, field_id, id_num, type, target, value ) {
    if( type != 'col' && type != 'row' ) { return; }
    if( typeof( value ) === 'undefined' || value === null ) { value = ''; }
    
    jQuery( '<div class="table-field-setting-wrapper"><input type="text" value="' + value + '" id="' + html_id + '" onkeyup="TableFieldChangeLabel(event, ' + field_id + ', ' + id_num + ', \'' + type + '\')" onchange="TableFieldChangeLabel(event, ' + field_id + ', ' + id_num + ', \'' + type + '\')"><button class="remove" onclick="TableFieldRemove(' + id_num + ', \'' + type + '\');">X</button></div>' ).insertBefore( target );
}

function TableFieldRemove( id_num, type ) {
    if( type != 'col' && type != 'row' ) { return; }
    
    var id = "table_field_" + type + "_" + id_num + "_title";
    var element = jQuery( "#" + id );
    // get the fields id
    var field = TableFieldGetField( element );
    if( field === false ) { return; }
    
    // remove the setting
    element.parent().remove();
    // unregister it
    if( type == 'row' ) {
        delete field.rows[ id_num ];
    }
    else if( type == 'col' ) {
        delete field.cols[ id_num ];
    }
    
    // modify preview
    TableFieldModifyPreview( field.id );
}

function TableFieldChangeLabel( e, field_id, id_num, type ) {
    if( type != 'col' && type != 'row' ) { return; }
    
    var field = TableFieldGetField( field_id );
    
    if( type == 'row' ) {
        field.rows[ id_num ] = e.target.value;
    }
    else if( type == 'col' ) {
        field.cols[ id_num ] = e.target.value;
    }
    
    TableFieldModifyPreview( field.id );
}

jQuery( document ).on( "gform_load_field_settings", function( e, field ) {
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
        var html_id = "table_field_col_" + id_num + "_title";
        var target = jQuery( ".table_field_add_col_button", field_element_id );
        
        TableFieldCreateOption( html_id, field.id, id_num, 'col', target, value );
    });
    
    // add a setting for every existing row
    jQuery.each( field.rows, function( id_num, value ) {
        var html_id = "table_field_row_" + id_num + "_title";
        var target = jQuery( ".table_field_add_row_button", field_element_id );

        TableFieldCreateOption( html_id, field.id, id_num, 'row', target, value );
    });
});