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