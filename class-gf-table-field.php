<?php
GFForms::include_addon_framework();

class GFTableField extends GFAddOn {
	protected $_version = GF_TABLE_FIELD_VERSION;
	protected $_min_gravityforms_version = '1.9';
	protected $_slug = 'gf-table-field';
	protected $_path = 'gf-table-field/gf-table-field.php';
	protected $_full_path = __FILE__;
	protected $_title = 'Gravity Forms Table Field';
	protected $_short_title = 'GF Table Field';
	/**
	 * @var object $_instance If available, contains an instance of this class.
	 */
	private static $_instance = null;
    
	/**
	 * Returns an instance of this class, and stores it in the $_instance property.
	 *
	 * @return object $_instance An instance of this class.
	 */
    
	public static function get_instance() {
		if ( self::$_instance == null ) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}
    
	/**
	 * Include the field early so it is available when entry exports are being performed.
	 */
	public function pre_init() {
		parent::pre_init();
		if ( $this->is_gravityforms_supported() && class_exists( 'GF_Field' ) ) {
			require_once( __DIR__ . '/table-field.php' );
		}
	}
    
	public function init_admin() {
		parent::init_admin();
		add_filter( 'gform_tooltips', array( $this, 'tooltips' ) );
		add_action( 'gform_field_standard_settings', array( $this, 'field_appearance_settings' ), 10, 2 );
	}
    
	// # SCRIPTS & STYLES -----------------------------------------------------------------------------------------------
    
	/**
	 * Include my_script.js when the form contains a 'table' type field.
	 *
	 * @return array
	 */
	public function scripts() {
        // echo '<pre>' . htmlspecialchars( var_export( parent::scripts(), true ) ) . '</pre>';exit;
		$scripts = array(
			array(
				'handle'  => 'table_field_script',
				'src'     => $this->get_base_url() . '/front-script.js',
				'version' => $this->_version,
				'deps'    => array( 'jquery' ),
				'enqueue' => array(
					array( 'field_types' => array( 'table' ) ),
				),
			),
		);
		return array_merge( parent::scripts(), $scripts );
	}
    
	/**
	 * Include my_styles.css when the form contains a 'table' type field.
	 *
	 * @return array
	 */
	public function styles() {
		$styles = array(
			array(
				'handle'  => 'table_field_style',
				'src'     => $this->get_base_url() . '/style.css',
				'version' => $this->_version,
				'enqueue' => array(
					array( 'field_types' => array( 'table' ) )
				)
			)
		);
		return array_merge( parent::styles(), $styles );
	}
    
	// # FIELD SETTINGS -------------------------------------------------------------------------------------------------
	
    /**
	 * Add the tooltips for the field.
	 *
	 * @param array $tooltips An associative array of tooltips where the key is the tooltip name and the value is the tooltip.
	 *
	 * @return array
	 */
	public function tooltips( $tooltips ) {
		$simple_tooltips = array(
            'table_field_add_col' => esc_html__( 'Add columns to your table and name them.', 'gf-table-field' ),
			'table_field_add_row' => esc_html__( 'Add rows to your table and name them.', 'gf-table-field' ),
		);
		return array_merge( $tooltips, $simple_tooltips );
	}
    
	/**
	 * Add the custom setting for the Simple field to the Appearance tab.
	 *
	 * @param int $position The position the settings should be located at.
	 * @param int $form_id The ID of the form currently being edited.
	 */
	public function field_appearance_settings( $position, $form_id ) {
		if ( $position == 350 ) {
			?>
			<li class="table_field_add_col field_setting">
				<label class="section_label" for="table_field_add_col_button">
					<?php esc_html_e( 'Columns', 'gf-table-field' ); ?>
					<?php gform_tooltip( 'table_field_add_col' ) ?>
				</label>
				<button class="button table_field_add_col_button" onclick="TableFieldAdd( event, 'col' );"><?php esc_html_e( 'Add Column', 'gf-table-field' ); ?></button>
			</li>
			
			<li class="table_field_add_row field_setting">
				<label class="section_label" for="table_field_add_row_button">
					<?php esc_html_e( 'Rows', 'gf-table-field' ); ?>
					<?php gform_tooltip( 'table_field_add_row' ) ?>
				</label>
				<button class="button table_field_add_row_button" onclick="TableFieldAdd( event, 'row' );"><?php esc_html_e( 'Add Row', 'gf-table-field' ); ?></button>
			</li>
			
			<script src="<?php echo $this->get_base_url() . '/script.js'; ?>"></script>
			<link rel="stylesheet" href="<?php echo $this->get_base_url() . '/script.css'; ?>">
			<?php
		}
	}
}
