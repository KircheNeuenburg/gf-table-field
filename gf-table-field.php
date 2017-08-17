<?php
/*
Plugin Name: Gravity Forms Table Field
Plugin URI: https://github.com/KircheNeuenburg/gf-table-field
Description: Enabeling Gravity Forms to show and process table inputs
Version: 1.0
Author: Hornig Software
Author URI: https://h-software.de
Text Domain: gf-table-field
Domain Path: /lang
*/

define( 'GF_TABLE_FIELD_VERSION', '1.0' );

add_action( 'gform_loaded', array( 'GF_Table_Field_Bootstrap', 'load' ), 5 );
class GF_Table_Field_Bootstrap {
    public static function load() {
        if ( !method_exists( 'GFForms', 'include_addon_framework' ) ) {
            return;
        }
        require_once( 'class-gf-table-field.php' );
        GFAddOn::register( 'GFTableField' );
    }
}
