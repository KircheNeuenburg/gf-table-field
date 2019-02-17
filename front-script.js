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
	
	function registerComposeValueTriggers() {
		jQuery( '.table_field' ).each( function( i, object ) {
			var table = object;
			
			composeValue( table );
			
			jQuery( 'input', table ).each( function( i, v ) {
				console.log( v );
			});
			
			jQuery( 'input', table ).on( 'keyup', function() {
				console.log( 'keyup' );
				composeValue( table );
			});
		});
	}
	
	function composeValue( table ) {
		var prevIndex = -1;
		var tableValuesMatrix = new Array();
		
		jQuery( 'input[data-type="table-cell"]', table ).each( function( i, cell ) {
			cell = jQuery( cell );
			
			var col = cell.attr( 'data-col' );
			var row = cell.attr( 'data-row' );
			
			if( row != prevIndex ) {
				tableValuesMatrix.push( new Array() );
				prevIndex = row;
			}
			
			tableValuesMatrix[ prevIndex ].push( cell.val() );
		});
		
		jQuery( '.composedTableValue', table ).val( JSON.stringify( tableValuesMatrix ) );
	}
	
	registerComposeValueTriggers();
});