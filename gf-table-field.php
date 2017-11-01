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
    private static $csv_seperator = ';';
    
    public static function load() {
        if ( !method_exists( 'GFForms', 'include_addon_framework' ) ) {
            return;
        }
        require_once( 'class-gf-table-field.php' );
        GFAddOn::register( 'GFTableField' );
        
        // register custom export action
        add_filter( 'gform_entry_list_bulk_actions', array( 'GF_Table_Field_Bootstrap', 'export_table_add_filter' ), 10, 2 );
        add_action( 'gform_entry_list_action', array( 'GF_Table_Field_Bootstrap', 'export_table' ), 10, 3 );
    }
    
    public function export_table_add_filter( $actions, $form_id ) {
        $actions['export_table'] = __( 'Export Table', 'gf-table-field' );
        return $actions;
    }
    
    public function export_table( $bulk_action, $entry_ids, $form_id ) {
        // check this is the right action
        if( $bulk_action == 'export_table' ) {
			// open file output buffer
			$file_content = [];
			
            // get the form
            $form = GFAPI::get_form( $form_id );
            
            // extract the table fields from the form
            $table_field_ids = [];
            foreach( $form["fields"] as $field ) {
                if( $field->type != "table" ) continue;
            
                // get the entry for every given entry id
                $entries = [];
                foreach( $entry_ids as $entry_id ) {
                    $entry = GFAPI::get_entry( $entry_id );
                    if( $entry ) {
                        // extract the table field values
                        $value = json_decode( $entry[ $field->id ] );

                        // get a label for the table
                        $label = $entry['3.3'] . ' ' . $entry['3.6'];       // TODO: let the user choose this

                        array_push( $entries, [ 'value' => $value, 'label' => $label ] );
                    }
                }
                
                // generate the file
                $file_content = array_merge( $file_content, self::generate_table( $entries, $field->cols, $field->rows ) );
            }
        }
		
		// create the export file
		$filename = 'gravityforms-table-export-' . date( 'Y-m-d' ) . '.csv';
		$file = fopen( __DIR__ . '/table-exports/' . $filename, 'w' );
		
		// write every line to the file
		foreach( $file_content as $line ) {
			fputcsv( $file, $line, self::$csv_seperator );
		}
        // save the file
        fclose( $file );
		
		// let the user download the file
		header( "Location: " . plugin_dir_url( __FILE__ ) . 'table-exports/' . $filename );
		die();
    }
        
    /*
     * generate a file for the given entries
     * 
     * @param array $entries        the entries to be processed
     * @param array $cols       the cols that serve as labels for the section
     * @param array $rows       the rows that serve as labels for the rows
     * 
     * @return array       the generated file as an array
     */
    private static function generate_table( $entries, $cols, $rows ) {
        $table = [];
        
        // create the sections
        foreach( $cols as $cid => $col ) {
            // add a heading for each section
            array_push( $table, [ $col ] );
			$line = self::generate_table_body( $entries, $cid, $rows );
            // get the sections body
            $table = array_merge( $table, $line );
			// add empty line
			array_push( $table, [] );
			array_push( $table, [] );
        }
        
        return $table;
    }
    
    /*
     * generate a file for the given entries
     * 
     * @param array $entries        the entries to be processed
     * @param array $cols       the cols that serve as labels for the section
     * @param array $rows       the rows that serve as labels for the rows
     * 
     * @return array       the generated section as an array
     */
    private static function generate_table_body( $entries, $cid, $rows ) {
        $return = [];
        
        // add a heading line
        $line = [ '' ];
        foreach( $entries as $entry ) {
            array_push( $line, $entry['label'] );
        }
        array_push( $return, $line );
        
        // add a row for every entry
        foreach( $rows as $rid => $row ) {
            $line = [ $row ];
			
            // show all values
            foreach( $entries as $entry ) {
                array_push( $line, $entry['value'][ $cid ][ $rid ] );
            }
			
			array_push( $return, $line );
        }
        
        return $return;
    }
}