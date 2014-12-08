/*
 * Class: shopPage
 * 
 * Description: Creates shop page
 */

var shopPage = {
	
	/*
	 * Property: settings
	 * 
	 * Description: Contains settings for the shopPage class
	 */
	
	settings: {
		
		/*
		 * Class info
		 */
		name: 'shopPage',
		version: '0.0.2',
		registered: false,
		versionDescription: 'Added setup',
		
		/*
		 * Class variables
		 */
		
		shop_name: 'Gold Shop',
		shop_welcome_message: 'Welcome to the shop',
		shop_logo: '',
		shop_categories: {},
		returns_enabled: false,
		giving_enabled: false,
		default_view: 'squares'
		
	},
	
	/*
	 * Function: register
	 * 
	 * Description: Registers class with the shop plugin
	 * 
	 * Parameters: *none*
	 * 
	 * Returns: *bool*
	 */
	
	register: function () {vitals.shop.main.register('shopPage', this);},
	
	/*
	 * Function: init
	 * 
	 * Description: Initiates
	 * 
	 * Parameters: *none*
	 * 
	 * Returns: *bool*
	 */
	
	init: function(){
		
		this.setup();
		
	},
	
	/*
	 * Function: setup
	 * 
	 * Description: Sets up shop page variables
	 * 
	 * Paramters: *none*
	 * 
	 * Returns: *bool*
	 */
	
	setup: function () {
		
		var plugin = pb.plugin.get('gold_shop_v4'),
			settings = plutin.settings;
		
		this.settings.shop_name = (settings.shop_name != undefined && settings.shop_name != '')? settings.shop_name: 'Gold Shop';
		this.settings.shop_welcome_message = (settings.welcome_message != undefined && settings.shop_message != '')? settings.welcome_message: 'Welcome to the shop!';
		// TODO add shop image replacement option
		this.settings.shop_image = this.settings.shop_image;
		this.settings.returns_enabled = (settings.returns == 'true' )? true: false;
		this.settings.giving_enabled = (settings.giving == 'true' )? true: false;
		this.settings.default_view = settings.default_view;
		
	}
	
};
