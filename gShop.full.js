if ( typeof vitals == undefined ) {
    vitals = {};
}

vitals.shop = (function(){
    
    /*
     * Class: main
     * 
     * Description: Handles initiation and contains global variables for Gold Shop
     */

    var main = {
        
        /*
         * Property: settings
         * 
         * Description: Contains any global variables the class may need
         */
        
        settings: {
            name: 'main',
            version: '0.0.1',
            registered: false,
        },
        
        /*
         * Property: plugins
         * 
         * Description: Array that holds all plugins registerd with the shop for initiation
         */
        
        plugins: [],
        
        /*
         * Function: register
         * 
         * Parameters: *string* - name - Name of the function to be registerd
         *             *object* - func - Function to be registerd
         * 
         * Returns: *none*
         * 
         * Description: Pushes functions into the plugins array for initiation later on
         */
        
        register: function (name, func) {
            vitals.shop[name] = func;
            if ( vitals.shop.hasOwnProperty(name) ) {
                this.plugins.push(func);
                vitals.shop[name].settings.registered = true;
            }
        },
        
        /*
         * Function: init
         * 
         * Parameters: *none*
         * 
         * Returns: *none*
         * 
         * Description: Initiates all plugins
         */
        
        init: function () {
            for ( var i in this.plugins ) {
                this.plugins[i].init();
            }       
        },
        
        /*
         * Property: userDataHash
         * 
         * Description: An object for storing all data for users loaded on current page
         */
        
        userDataHash: {}
        
    };
    
    return main;

})();
    /*
     * Class: items
     * 
     * Description: Contains methods pertinent to item handling
     */

var items = {
    
    /*
     * Property: settings
     * 
     * Description: Contains any global variables the class needs
     */

    settings: {
        name: 'items',
        version: '0.0.1',
        registered: false
    },
    
    /*
     * Function: register
     * 
     * Description: Registers the class with Gold Shop
     */
    
    register: function () {
        vitals.shop.register('items', this);
    },
    
    /*
     * Function: init
     * 
     * Description: Initiates - currently just returns nothing
     */
    
    init: function () {return;},
    
    /*
     * Object Constructor: itemHash
     * 
     * Parameters: *string* - key - The key to sort the items by
     * 
     * Returns: *object* - itemList - an object containing information about items in the shop
     * 
     * Description: Returns an object containing information for all items in the shop
     */
    
    itemHash: (function(){
        var settings = pb.plugin.get('gold_shop_v4').settings,
            uItems = settings.items;
        
        function itemHash(key) {
            
            if ( key == undefined || key == null )
                key = 'id';
            
            this.items = {};
            
            for ( var i in uItems ) {
                if (uItems[i].hasOwnProperty(key)){
                    this.items[uItems[i][key]] = uItems[i];
                }
            }
            
            return this.items;
        }
        
        return itemHash;        
    })(),
    
    /*
     * Object Constructor: categoryList
     * 
     * Description: Creates an object containing categories, ID's are the key
     * 
     * Returns: *object* - categoryList - an object containing the Categories rearanged.
     * 
     * Parameters: *none*
     */
    
    categoryHash: (function(){
    	
    	var settings = pb.plugin.get('gold_shop_v4').settings,
    		categories = settings.categories;
    		
    	function categoryHash () {
    		
    		this.categories = new Object();
    		
    		for ( var i in categories ) {
    			this.categories[categories[i].id] = {"id": categories[i].id, "category": categories[i].category};
    		}
    		
    		return this.categories;
    		
    		//update force
    		
    	}
    	
    	return categoryHash;
    	
    })()   
    
}.register();

    /*
     * Class: userData
     * 
     * Description: Contains methods pertinent to user data handling
     */

var userData = {
    
    /*
     * Property: settings
     * 
     * Description: Contains any global variables the class needs
     */
    
    settings: {
        name: 'userData',
        version: '0.0.5',
        registered: false,  
        versionDescription: 'Wrote the update function'
    },
    
    /*
     * Function: register
     * 
     * Parameters: none
     * 
     * Description: Registers module with Gold Shop
     */
    
    register: function () { vitals.shop.register(this.settings.name, this); },
    
    /*
     * Function: init
     * 
     * Parameters: none
     * 
     * Description: Initiates
     */
    
    init: function () {
        this.createUserDataHash();
    },
    
    /*
     * Function: createUserDataHash
     * 
     * Parameters: none
     * 
     * Description: Creates data hash for all users who have potential for data
     */
    
    createUserDataHash: function () {
        var key = proboards.plugin.keys.data['gold_shop_super'];
            userList = Object.keys(proboards.plugin.keys.permissions['gold_shop_super']);
            
        for ( var i in userList ) {
        	// Check if key has data already
            var userData = ( key.hasOwnProperty(i) == true )? key[i]: null;
            vitals.shop.userDataHash[userList[i]] = new this.userHash(userList[i]);
        }       
    },
    
    /* 
     * Function: userHash
     * 
     * Parameters: *user* - id of a user to create a hash for
     *             *data* - data to set instead of creating a blank one
     * 
     * Description: Creates a hash for a user, either a blank one, or uses data supplied
     */
    
    userHash: (function(){
        
        function userHash(user, data) {
            
        var plugin = pb.plugin.get('gold_shop_v4'),
            sKey = proboards.plugin.keys.data['gold_shop_super'],
            usersOnPage = Object.keys(proboards.plugin.keys.permissions['gold_shop_super']),          
            self = {};
            
            if ( $.inArray( user.toString(), usersOnPage ) > -1 ) {
                
                self.data = ( (typeof data).toUpperCase() == "ARRAY" && data.length > 0 )? data[0] : {
                    
                    /*
                     * Bought Items
                     */
                    
                    bi: {},
                    
                    /*
                     * received Items
                     */
                    
                    ri: {},              
                    
                    /*
                     * Gift Inbox
                     */
                    
                    gi: [],
                    
                    /*
                     * Trade Inbox
                     */
                    
                    ti: [],
                    
                    /*
                     * Rejected Gifts
                     */
                    
                    rg: [],
                    
                    /*
                     * Rejected Trades
                     */               
                     
                     rt: [],                  
                    
                    /*
                     * Pending Changes
                     */
                    
                    pc: []
                    
                };            
                
                self.hasBeenChanged = false;
                
                /*
                 * Push all pending changes into main object
                 */
                
                if ( typeof data != "undefined" ) {
	                if ( data.length > 1 ) {
	                	for (var i in data ) {
	                		if ( i == 0 ) 
	                			continue;
	                		else {
	                			self.data['pc'].push(data[i]);
	                		}	                		
	                	}
	                	self.hasBeenChanged = true;
	                } 
                }               
                
                self.update = function () {
                      pb.data.key('gold_shop_super').set({item_id: self.user, value: [self.data] });
                };
                
                /*
                 * Property: User
                 * 
                 * Description: ID of the user that the hash belongs too 
                 */
                
                self.user = user;
                
                /*
                 * Property: get
                 * 
                 * Description: Object containing methods to return data from hash
                 */
                
                self.get = {
                    
                    /*
                     * Function: bought
                     * 
                     * Parameters: *none*
                     * 
                     * Description: Returns object containing users bought items
                     */
                    
                    bought: function () {
                        return self.data.bi;
                    },
                    
                    /* 
                     * Function: Received
                     * 
                     * Parameters: *none*
                     * 
                     * Description: Returns object containing users received
                     */
                    
                    received: function () {
                        return self.data.ri;
                    },
                    
                    /*
                     * Function: outbox
                     * 
                     * Parameters: *none*
                     * 
                     * Description: Returns array containing gifts a user wishes to give to someone, but have not been sent
                     */
                    
                    outbox: function () {
                        return self.data.io;
                    },
                    
                    /*
                     * Function: inbox
                     * 
                     * Parameters: *none*
                     * 
                     * Description: Returns an array containing gifts a user has been sent, but have not been accepted
                     */
                    
                    inbox: function () {
                        return self.data.gi;
                    }
                    
                };
                
                /*
                 * Property: set
                 * 
                 * Description: Contains methods to set data in hash
                 */
                
                self.set = {
                    
                    /*
                     * Function: bought
                     * 
                     * Parameters: *object* - data - Object to be set as the bought object
                     * 
                     * Returns: *none*
                     */
                    
                    bought: function ( data ) {
                        if ( (typeof data).toUpperCase() == "OBJECT" ) {
                            self.data.bi = data;
                            self.hasBeenChanged = true;
                        }
                    },
                    
                    /*
                     * Function: received
                     * 
                     * Parameters: *object* - data - Object to be set as the recieved object
                     * 
                     * Returns: *none*
                     */                
                    
                    received: function ( data ) {
                        if ( (typeof data).toUpperCase() == "OBJECT" ) {
                            self.data.ri = data;
                            self.hasBeenChanged = true;
                        }
                    },
                    
                    /*
                     * Function: inbox
                     * 
                     * Parameters: *array* - array - Array to be set as the inbox array
                     * 
                     * Returns: *none*
                     */                      
                    
                    inbox: function ( array) {
                        if ( (typeof array).toUpperCase() == "ARRAY" ) {
                            self.data.gi = array;
                            self.hasBeenChanged = true;
                        }   
                    },
                    
                    /*
                     * Function: rejectedGifts
                     * 
                     * Parameters *array* - array - Array to be set as the rejected array
                     */
                    
                    rejectedGifts: function ( array ) {
                        if ( (typeof array).toUpperCase() == "ARRAY" ) {
                            self.data.rg = array;
                            self.hasBeenChanged = true;
                        }   
                    },
                    
                    /*
                     * Function: rejectedTrades
                     * 
                     * Parameters *array* - array - Array to be set as the rejected array
                     */
                    
                    rejectedTrades: function ( array ) {
                        if ( (typeof array).toUpperCase() == "ARRAY" ) {
                            self.data.rt = array;
                            self.hasBeenChanged = true;
                        }   
                    }                    
                    
                };
                
                /*
                 * Property: add
                 * 
                 * Description: Contains methods to add items to the bought and received data
                 */
                
                self.add = {
                    
                    /*
                     * Function: bought
                     * 
                     * Parameters: *string* - id - The id of the item to be added
                     *             *integer* - amount - The to be added
                     * 
                     * Description: Adds items to the bought object
                     */
                    
                    bought: function ( id, amount ) {
                        var userItems = self.data.bi,
                            owned,
                            itemLookup = new vitals.shop.items.itemHash('id');
                        if ( isNaN( amount ) == false && itemLookup.hasOwnProperty(id) ) {
                            if ( userItems.hasOwnProperty(id) == true ) {                       
                                for( var i = 0, owned = parsInt(userItems[id]); i < amount; i++ ) {
                                    owned++;
                                }
                                self.data.bi[id] = owned;
                            } else {
                                for ( var i = 0, owned = 0; i < amount; i++ ) {
                                    owned++;    
                                }
                                self.data.bi[id] = owned;
                            }
                            self.hasBeenChanged = true;
                            return true;
                        } else {
                            return false;
                        }
                    },
                    
                    /*
                     * Function: received
                     * 
                     * Parameters: *string* - id - The id of the item to be added
                     *             *integer* - amount - The to be added
                     * 
                     * Description: Adds items to the received object
                     */                
                    
                    received: function ( id, amount ) {
                        var userItems = self.data.bi,
                        received,
                        itemLookup = new vitals.shop.items.itemHash('id');
                        if ( isNaN( amount ) == false && itemLookup.hasOwnProperty(id) ) {
                            if ( userItems.hasOwnProperty (id) == true) {
                                for ( var i = 0, owned = parseInt(userItems[id]); i < amount; i++ ) {
                                    owned++;
                                }
                                self.data.ri[id] = owned;
                            } else {
                                for ( var i = 0, owned = 0; i < amount; i++ ){
                                    owned++;
                                }
                                self.data.ri[id] = owned;
                            }
                            self.hasBeenChanged = true;
                            return true;
                        } else {
                            return false;
                        }
                    }
                    
                };            
                
                /*
                 * Property: pChanges
                 * 
                 * Description: Contains methods for working with pending changes
                 * 
                 */
                
                self.pChanges = {
                	
					/*
					 * Function: changeTable
					 * 
					 * Description: Creates a table that categorizes all pending changes
					 * 
					 * Parameters: *none*
					 * 
					 * Returns: *object* - The lookup table
					 */
					
					changeTable: function () {
						
						var table = {
								
								/*
								 * Give Messages
								 */
								
								gm:[],
								
								/*
								 * Trade Requests
								 */
								
								tr: [],
								
								/*
								 * Rejected Gifts
								 */				
								 
								rg: [],
								 
								 /*
								  * Rejected Trades
								  */				
								  
								rt: []
								
						}, data = self.data.pc;
						
						if ( data.length > 0 ) {
						
							for ( var i in data ) {
								switch ( data[i].type ) {
									case "give_message":
										table.gm.push(data[i]);
									case "trade_request":
										table.tr.push(data[i]);
								}
							}
						
						}
						
						return table;
						
					},
					
					/*
					 * Property: saveChanges
					 * 
					 * Description: Contains methods to save changes that have been pushed to the user
					 */
					
					saveChanges: {
						
						/*
						 * Function: gm
						 * 
						 * Description: Saves all given messages
						 * 
						 * Parameters: *none*
						 * 
						 * Returns: *bool*
						 */
						
						gm: function () {
							var changes = self.pChanges.changeTable().gm;
							
							if ( changes.length > 0 ) {
								
								for ( var i in changes ) {
									self.data.gi.push(changes[i]);
								}
								
								self.hasBeenChanges = true;
								return true;
							}
							return false;
						},
						
						/*
						 * Function: tm
						 * 
						 * Description: Saves all trade propositions
						 * 
						 * Parameters: *none*
						 * 
						 * Returns: *bool*
						 */
						
						tm: function () {
							var changes = self.pChanges.changeTable().tm;
							
							if ( changes.length > 0 ) {
								
								for ( var i in changes ) {
									self.data.ti.push(changes[i]);
								}
								
								self.hasBeenChanged = true;
								return true;
							}
							return false;
						},
						
						/*
						 * Function: rg
						 * 
						 * Description: Saves all rejected gift messages
						 * 
						 * Parameters: *none*
						 * 
						 * Returns: *bool*
						 */
						
						rg: function () {							
							var changes = self.pChanges.changeTable().rg;
							
							if ( changes.length > 0 ) {
								for ( var i in changes ) {
									self.data.rg.push(changes[i]);									
								}
								self.hasBeenChanged = true;
								return true;
							}
							return false;
						},
						
						/*
						 * Function: rt
						 * 
						 * Description: Saves all rejected trade messages
						 * 
						 * Parameters: *none*
						 * 
						 * Returns: *bool*
						 */
						
						rt: function () {
							var changes = self.pChanges.changeTable().rt;
							
							if( changes.length > 0 ) {
								for ( var i in changes ) {
									self.data.rt.push(changes[i]);
								}
								self.hasBeenChanged = true;
								return true;
							}
						}
						
					}
                	
                },
                
                /*
                 * Property: subtract
                 * 
                 * Description: Contains methods to subtract items from user hash
                 */
                
                self.subtract = {
                    
                    /*
                     * Function: bought
                     * 
                     * Returns: *bool*
                     * 
                     * parameters: *string* - id - The id of the item to be subtracted from
                     *             *integer* - amount - The amount of the item to be subtracted
                     * 
                     * Description: Subtracts bought items from the user hash
                     */
                    
                    bought: function ( id, amount ) {
                        var shopItems = pb.plugin.get('gold_shop_v4').settings.items,
                            itemHash = vitals.shop.items.itemHash('id'),
                            userBought = self.data.bi,
                            userBoughtAmount;
                            
                        if ( shopItems.hasOwnProperty(id) == true && userBought.hasOwnProperty(id) == true ) {
                            userBoughtAmount = parseInt( userBought[id] );                        
                            if ( amount >= userBoughtAmount ) {
                                for (var i = 0; i < amount; i++ ){
                                    userBoughtAmount--;   
                                }
                            } else {
                                userBoughtAmount = 0;
                                delete self.data.bi[id];
                            }
                            if ( userBoughtAmount > 0 )
                                self.data.bi[id] = userBoughtAmount;
                            self.hasBeenChanged = true;
                            return true;                        
                        } else {
                            return false;                        
                        }
                    },
                    
                     /*
                     * Function: received
                     * 
                     * Returns: *bool*
                     * 
                     * parameters: *string* - id - The id of the item to be subtracted from
                     *             *integer* - amount - The amount of the item to be subtracted
                     * 
                     * Description: Subtracts received items from the user hash
                     */
                    
                    received: function ( id, amount ) {
                        var shopItems = pb.plugin.get('gold_shop_v4').settings.items,
                            itemHash = vitals.shop.items.itemHash('id'),
                            userReceived = self.data.ri,
                            userReceivedAmount;
                            
                        if ( shopItems.hasOwnProperty(id) == true && userReceived.hasOwnProperty(id) == true ) {
                            userReceivedAmount = parseInt( userReceived[id] );                        
                            if ( amount >= userReceivedAmount ) {
                                for (var i = 0; i < amount; i++ ){
                                    userReceivedAmount--;   
                                }
                            } else {
                                userReceivedAmount = 0;
                                delete self.data.ri[id];
                            }
                            if ( userReceivedAmount > 0 )
                                self.data.ri[id] = userReceivedAmount;
                            return true;
                            self.hasBeenChanged = true;                        
                        } else {
                            return false;                        
                        }                    
                    }
                      
                };
                
                return self;
            
            }
            
        };
        
        //comment
        
        return userHash;
    
    })()
    
}.register();

/*
 * Class: sync
 * 
 * Description: Handles syncing of all data
 */

var sync = {
	
	/* 
	 * Property: settings
	 * 
	 * Description: Contains all settings needed for the sync class
	 */
	
	settings: {
		name: 'sync',
		version: '0.0.2',
		registered: false,
		versionComment: 'Added syncCheck to check if syncs were needed as well as a variable to hold the current state',
		needSync: false
	},

	/*
	 * Function: register
	 * 
	 * Description: Registeres "sync" with the shop
	 */

    register: function () { vitals.shop.register(this.settings.name, this); },
    
    /*
     * Function: init
     * 
     * Description: Handles initiation (currently does nothing)
     */
    
    init: function () {return;},
    
    /*
     * Function: userDataUpdate
     * 
     * Description: Checks if any of the userData hashes need updated
     * 
     * Parameters: *bool* - dry_run - set true if encase actual ajax calls are not wanted
     * 
     * Returns: *array* *bool* - Contains all hashes that need/were updated, or false if error occurred 
     * 
     */
    
    userDataUpdate: function (dry_run) {
    	if ( JSON.stringify( vitals.shop.userDataHash ) == "{}" ) {
	    	var hash = vitals.shop.userDataHash,
	    		changedHashes = [];
	    	for ( var i in hash ) {
	    		if ( hash[i].hasBeenChanged == true ) {
	    			changedHashes.push(hash[i]);
	    		} 
	    	}
	    	if (dry_run != true) {
	    		for( var i in changedHashes ) {
	    			changedHashes[i].update();
	    		}
	    		return true;
	    	} else {
	    		return changedHashes;
	    	}
    	}
    	return false;
    },
    
    /*
     * Function: arraySync
     * 
     * Description: Updates an array of data hashes
     * 
     * Parameters:  *array* - data_hashes - the array of data hashes that needs updated
     * 
     * Returns: *bool*
     */
    
    arraySync: function(data_hashes) {
    	if ( (typeof data_hashes).toUppercase() == "ARRAY") {
    		if ( array[i].hasOwnProperty('update') ) { 
	    		for (var i in data_hashes) {
	    			data_hashes[i].update();
	    		}
	    		return true;
    		}
    	}
    	return false;
    },
    
    /*
     * Function: syncCheck
     * 
     * Description: Checks if a sync is needed
     * 
     * Parameters: *none*
     * 
     * Returns: *bool*
     */
	
	syncCheck: function () {
		if ( this.userDataUpdate(true).length != 0 && this.userDataUpdate(true) !== false ) {
			return true;
		}
		return false;
	},
	
	/*
	 * Function: buttonSync
	 * 
	 * Description: Attaches a sync check to all shop buttons that might change data
	 * 
	 * Parameters: *none*
	 * 
	 * Returns: *bool*
	 */
	
	buttonSync: function () {
		var self = this;
		$('.shop-data-button').each(function() {
			$(this).on('click', function() {
				if ( self.syncCheck() == true ) {
					self.settings.needSync = true;
				}
			});
		});
	}
	
};
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
			category = categoryHash[itemInfo.category_id];
		
		html += '<div class="shop ' + itemInfo['category_id'] + ' information-item">';
			html += '<table>';
				html += '<tbody>';
					html += '<tr>';
						html += '<td class="shop info-image">';
							html += '<div>';
								html += '<img src="' + itemInfo.image_url + '" />';
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
			html += '<a href="javascript:void(0)" class="button">' + categories[id].category + '</a>';
			
		return $(html);
		
	}
	
}.register();


var start = setInterval(function() {
    if (!$.isReady) return;
    clearInterval(start);

    vitals.shop.init();

}, 100);


