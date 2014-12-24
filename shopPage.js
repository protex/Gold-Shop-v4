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
		plugin_settings: pb.plugin.get('gold_shop_v4').settings,
		plugin_images: pb.plugin.get('gold_shop_v4').images,
		
		/*
		 * Class variables
		 */
		
		shop_name: 'Gold Shop',
		shop_welcome_message: 'Welcome to the shop',
		shop_logo: '',
		shop_categories: {},
		returns_enabled: false,
		giving_enabled: false,
		default_view: 'squares',
		auto_append_shop: true
		
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
	
	register: function () {vitals.shop.register('shopPage', this);return true;},
	
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
		
		return true;
		
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
			settings = plugin.settings;
		
		this.settings.shop_name = (settings.shop_name != undefined && settings.shop_name != '')? settings.shop_name: 'Gold Shop';
		this.settings.shop_welcome_message = (settings.welcome_message != undefined && settings.shop_message != '')? settings.welcome_message: 'Welcome to the shop!';
		// TODO add shop image replacement option
		this.settings.shop_image = this.settings.shop_image;
		this.settings.returns_enabled = (settings.returns == 'true' )? true: false;
		this.settings.giving_enabled = (settings.giving == 'true' )? true: false;
		this.settings.default_view = (settings.default_view == 'informational')? 'informational': 'squares';
		this.settings.auto_append_shop = (settings.auto_append_shop == 'true');
		
		this.createShop();
		
		return true;	
		
	},
	
	/*
	 * Function: createShop
	 * 
	 * Description: Creates the basics of the shop
	 * 
	 * Parameters: *none*
	 * 
	 * Returns: *bool*
	 */
	
	createShop: function () {
		
		if ( location.href.match(/\/\?shop\&location\=index/) ) {
			
			var categories = new vitals.shop.items.categoryHash();
			
			var wrapper = '',
				welcome = '',
				options = '',
				index = '';
				wrapper += '<div id="the-shop"></div>';
				welcome = this.settings.shop_name;
				
				// Options table, contains view switches and return button
				options += '<table class="shop options-table">';
				options += '<tbody>';
				options += '<tr>';
				options += '<td>';
				options += '<div class="rounded_edges shop" style="width: 225px">';
				options += '<img src="' + this.settings.plugin_images.shop + '" />';
				options += '</div>';
				options += '</td>';
				options += '<td>';
				options += '<table class="shop view-switch">';
				options += '<tbody>';
				options += '<tr>';
				options += '<td class="shop left">Left</td>';
				options += '<td class="shop right">Right</td>';
				options += '</tr>';
				options += '</tbody>';
				options += '</table>';
				options += '</td>';
				options += '<td>';
				options += 'Return an item';
				options += '</td>';
				options += '</tr>';
				options += '</tbody>';
				options += '</table>';
				
				// Index area, contains filter buttons, arrangment dropdown, and the shelf
				index += '<table class="shop index-table">';
				index += '<thead>';
				index += '<tr>';
				index += '<td>';
				index += '<div class="shop filter-buttons">';
				index += '<span>Filter:</span>';
				index += '</div>';
				index += '</td>';
				index += '<th class="shop arrange-input">';
				index += '<select><option value="1">Alphabetical</option></select>';
				index += '</th>';
				index += '</tr>';
				index += '</thead>';
				index += '<tbody class="shop shelf-table">';
				index += '<tr>';
				index += '<td colspan="2">';
				index += '<div class="shop shelf"></div>';
				index += '</td>';
				index += '</tr>';
				index += '</tbody>';
				index += '</table>';
				
			yootil.create.page(/\/\?shop\&location\=index/, this.settings.shop_name);				
				
			if ( this.settings.auto_append_shop === true)
				$('#content').append(wrapper);				
			
			// Add the options and index tables
			yootil.create.container(this.settings.shop_name + ' Options ', options).appendTo('#the-shop');
			yootil.create.container(this.settings.shop_name + ' Index', index).appendTo('#the-shop');	
			
			// Add items with default view
			this.addDefaultView();	
			
			// Add filter buttons
			
			for(var i in categories) {
				
				this.createFilterButton(categories[i].id).appendTo('.shop.filter-buttons');
				
			}	
			
		}
		
		
	},
	
	/*
	 * Function: createInfoItem
	 * 
	 * Description: Creates an item based on the informational template
	 * 
	 * Prameters: *string* *int* - The id of the item to create
	 */
	
	createInfoItem: function (id) {
		
		var html = '',
			itemHash = new vitals.shop.items.itemHash('id'),
			itemInfo = itemHash[id],
			categoryHash = new vitals.shop.items.categoryHash(),
			category = categoryHash[itemInfo.category_id].category;
		
		html += '<div class="shop ' + itemInfo['category_id'] + ' information-item shop-item">';
			html += '<table>';
				html += '<tbody>';
					html += '<tr>';
						html += '<td class="shop info-image">';
							html += '<div>';
								html += '<img src="' + itemInfo.image_url + '" />';
							html += '</div>';
							html += '<div>';
								html += '<a href="javascript:void(0)" class="button" onclick="">Buy</a>';
							html += '</div>';
						html += '</td>';
						html += '<td>';
							html += '<div class="description">' + itemInfo.description + '</div>';
						html += '</td>';						
					html += '</tr>';
					html += '<tr>';
						html += '<td colspan="2">';
							html += '<div class="shop item-tag">' + category + '</div>';
							html += (itemInfo.returnable == "true" && this.settings.returns_enabled == true)? '<div class="shop item-tag">Returnable</div>': '';
							html += (itemInfo.givable == "true" && this.settings.giving_enabled == true)? '<div class="shop item-tag">Givable</div>': '';	
						html += '</td>';
					html += '</tr>';
				html += '</tbody>';
			html += '</table>';
		html += '</div>';
		
		return $(html);
		
	},
	
	/*
	 * Function: clearCurrView
	 * 
	 * Description: Clears all items from the shop shelf
	 * 
	 * Parameters: *none*
	 */
	
	clearCurrView: function () {
		
		$('.shop.shelf').html('');
		
	},
	
	/*
	 * Function: createInfoView
	 * 
	 * Description: Creates all items in the informational view
	 * 
	 * Parameters: *none*
	 */
	
	createInfoView: function () {
		
		var items = new vitals.shop.items.itemHash('id');
		
		for(var i in items) {
			this.createInfoItem(items[i].id).appendTo('.shop.shelf');
		}
		
	},
	
	/* 
	 * Function: addDefaultView
	 * 
	 * Description: Adds the default view of the shop
	 * 
	 * Parameters: *none*
	 */
	
	addDefaultView: function () {
		
		if(this.settings.default_view == 'informational') {
			this.createInfoView();
		}
		
	},
	
	/* 
	 * Function: createFilterButton
	 * 
	 * Description: Creates a filter button based on category id
	 * 
	 * Parameters: *string* - id - The id of the category
	 */
	
	createFilterButton: function (id) {
		
		var categories = new vitals.shop.items.categoryHash();
		
		var html = '';
			html += '<a href="javascript:void(0)" class="button" onclick="vitals.shop.shopPage.filterItems(\'' + id + '\')">' + categories[id].category + '</a>';
			
		return $(html);
		
	},
	
	/*
	 * Function: filterItems
	 * 
	 * Description: Hides all items that don't match the filter
	 * 
	 * Parameters: *string* - id - The id of the category to filter for
	 */
	
	filterItems: function (id) {
		
		$('.shop-item').hide();
		
		$('.shop-item.' + id).show();
		
	}
	
}.register();

