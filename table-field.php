<?php
if ( ! class_exists( 'GFForms' ) ) {
	die();
}

class GF_Field_Table extends GF_Field {
	/**
	 * @var string $type The field type.
	 */
	public $type = 'table';
	/**
	 * Return the field title, for use in the form editor.
	 *
	 * @return string
	 */
	public function get_form_editor_field_title() {
		return esc_attr__( 'Table', 'gf-table-field' );
	}
	/**
	 * Assign the field button to the Advanced Fields group.
	 *
	 * @return array
	 */
	public function get_form_editor_button() {
		return array(
			'group' => 'advanced_fields',
			'text'  => $this->get_form_editor_field_title(),
		);
	}
	/**
	 * The settings which should be available on the field in the form editor.
	 *
	 * @return array
	 */
	function get_form_editor_field_settings() {
		return array(
			'label_setting',
			'description_setting',
			'table_field_add_col',
			'table_field_add_row',
			'css_class_setting',
			'size_setting',
			'admin_label_setting',
			'visibility_setting',
			'conditional_logic_field_setting',
		);
	}
	/**
	 * Enable this field for use with conditional logic.
	 *
	 * @return bool
	 */
	public function is_conditional_logic_supported() {
		return true;
	}
    
	/**
	 * Define the fields inner markup.
	 *
	 * @param array $form The Form Object currently being processed.
	 * @param string|array $value The field value. From default/dynamic population, $_POST, or a resumed incomplete submission.
	 * @param null|array $entry Null or the Entry Object currently being edited.
	 *
	 * @return string
	 */
	public function get_field_input( $form, $value = '', $entry = null ) {
		$id              = absint( $this->id );
		$form_id         = absint( $form['id'] );
		$is_entry_detail = $this->is_entry_detail();
		$is_form_editor  = $this->is_form_editor();
		// Prepare the value of the input ID attribute.
		$field_id = $is_entry_detail || $is_form_editor || $form_id == 0 ? "input_$id" : 'input_' . $form_id . "_$id";
		$value = esc_attr( $value );
		// Get the value of the inputClass property for the current field.
		$inputClass = $this->inputClass;
		// Prepare the input classes.
		$size         = $this->size;
		$class_suffix = $is_entry_detail ? '_admin' : '';
		$class        = $size . $class_suffix . ' ' . $inputClass;
		// Prepare the other input attributes.
		$tabindex              = $this->get_tabindex();
		$logic_event           = ! $is_form_editor && ! $is_entry_detail ? $this->get_conditional_logic_event( 'keyup' ) : '';
		$placeholder_attribute = $this->get_field_placeholder_attribute();
		$required_attribute    = $this->isRequired ? 'aria-required="true"' : '';
		$invalid_attribute     = $this->failed_validation ? 'aria-invalid="true"' : 'aria-invalid="false"';
		$disabled_text         = $is_form_editor ? 'disabled="disabled"' : '';
        
        if( $is_form_editor ) {
            // editor preview
            $input = "<input id='dummy_input_{$id}' type='hidden' class='{$class}' {$tabindex} {$logic_event} {$placeholder_attribute} {$required_attribute} {$invalid_attribute} {$disabled_text}/>" . PHP_EOL;
            $input .= '<script type="text/javascript">jQuery( document ).ready( function() { TableFieldModifyPreview(); });</script>';
            return sprintf( "<div class='ginput_container ginput_container_%s'>%s</div>", $this->type, $input );
        }
        else {
            // actual form display
            return $this->build_table();
        }
		
	}
    
    private function build_table( $values = [] ) {
        $table = '';
            
        // build the new table
        $table .= '<table id="input_' . $this->id . '" class="table_field">';
			$table .= '<input type="hidden" class="composedTableValue" name="input_' . $this->id . '" value="{}">';
			
            // add a colgroup for every col, to enable row highlighting
            $table .= str_repeat( '<colgroup></colgroup>', sizeof( $this->cols ) + 1 );

            $table .= '<thead>';
            $table .= '<tr>';
                $table .= '<th></th>';

                foreach( $this->cols as $col ) {
                    $table .= '<th>' . $col . '</th>';
                }
            $table .= '</tr>';
        $table .= '</thead><tbody>';
            foreach( $this->rows as $rid => $row ) {
                $table .= '<tr>';
                    $table .= '<th>' . $row . '</th>';
                    // add the individual cells
                    foreach( $this->cols as $cid => $col ) {
                        $value = isset( $values[ $rid ][ $cid ] ) ? $values[ $rid ][ $cid ] : '';
                        $table .= '<td><input type="text" value="' . $value . '" data-type="table-cell" data-col="' . $cid . '" data-row="' . $rid . '"></td>';
                    }
                $table .= '</tr>';
            }

        $table .= '<tbody></table>';

        return $table;
    }
    /*
    public function get_value_save_entry( $value, $form, $input_name, $lead_id, $lead ) {
		echo '<pre>';var_export( $value ); echo '</pre>';
		exit;
		
		
        // save the value as json
        return json_encode( $_REQUEST[ $input_name ] );
    }*/
	
    public function get_value_entry_detail( $value, $currency = '', $use_text = false, $format = 'html', $media = 'screen' ) {
        return $this->build_table( json_decode( $value ) );
    }
}
GF_Fields::register( new GF_Field_Table() );
