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
		version: '0.0.1',
		registered: false,
		versionDescription: 'Initial version',
		
		/*
		 * Class variables
		 */
		
		shop_name: 'Gold Shop',
		shop_welcome_message: 'Welcome to the shop',
		shop_logo: '',
		shop_categories: {}
		
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
	 * Returns: n/a
	 */
	
	init: function(){return;}
	
};
