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
            self = this;
            
            console.log(this);
            
            if ( $.inArray( user.toString(), usersOnPage ) > -1 ) {
                
                this.data = ( (typeof data).toUpperCase() == "ARRAY" && data.length > 0 )? data[0] : {
                    
                    /*
                     * Bought Items
                     */
                    
                    bi: {},
                    
                    /*
                     * received Items
                     */
                    
                    ri: {},
                    
                    /*
                     * Item Outbox
                     */
                    
                    io: [],
                    
                    /*
                     * Item Inbox
                     */
                    
                    ii: [],
                    
                    /*
                     * Items Rejected
                     */
                    
                    ir: [],
                    
                    /*
                     * Pending Changes
                     */
                    
                    pc: []
                    
                };            
                
                this.hasBeenChanged = false;
                
                /*
                 * Push all pending changes into main object
                 */
                
                if ( data.length > 1 ) {
                	for (var i in data ) {
                		if ( i == 0 ) 
                			continue;
                		else {
                			this.data['pc'].push(data[i]);
                		}	                		
                	}
                	this.hasBeenChanged = true;
                }                
                
                this.update = function () {
                      pb.data.key('gold_shop_super').set({item_id: this.user, value: this.data });
                };
                
                /*
                 * Property: User
                 * 
                 * Description: ID of the user that the hash belongs too 
                 */
                
                this.user = user;
                
                /*
                 * Property: get
                 * 
                 * Description: Object containing methods to return data from hash
                 */
                
                this.get = {
                    
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
                        return self.data.ii;
                    }
                    
                };
                
                /*
                 * Property: set
                 * 
                 * Description: Contains methods to set data in hash
                 */
                
                this.set = {
                    
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
                     * Function: outbox
                     * 
                     * Parameters: *array* - array - Array to be set as the outbox array
                     * 
                     * Returns: *none*
                     */                
                    
                    outbox: function ( array ) { 
                        if ( (typeof array).toUpperCase() == "ARRAY" ) {
                            self.data.io = array;
                            this.hasBeenChanged = true;
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
                            self.data.ii = array;
                            this.hasBeenChanged = true;
                        }   
                    },
                    
                    /*
                     * Function: rejected
                     * 
                     * Parameters *array* - array - Array to be set as the rejected array
                     */
                    
                    rejected: function ( array ) {
                        if ( (typeof array).toUpperCase() == "ARRAY" ) {
                            self.data.ri = array;
                            this.hasBeenChanged = true;
                        }   
                    }
                    
                };
                
                /*
                 * Property: add
                 * 
                 * Description: Contains methods to add items to the bought and received data
                 */
                
                this.add = {
                    
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
                            itemLookup = new vitals.shop.items.itemList('id');
                        if ( isNaN( amount ) == false && itemLookup.hasOwnProperty(id) ) {
                            if ( userItems.hasOwnProperty(id) == true ) {                       
                                for( var i = 0, owned = parsInt(userItems[id]); i < amount; i++ ) {
                                    owned++;
                                }
                                self.data.bi = owned;
                            } else {
                                for ( var i = 0, owned = 0; i < amount; i++ ) {
                                    owned++;    
                                }
                                self.data.bi = owned;
                            }
                            this.hasBeenChanged = true;
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
                        itemLookup = new vitals.shop.items.itemList('id');
                        if ( isNaN( amount ) == false && itemLookup.hasOwnProperty(id) ) {
                            if ( userItems.hasOwnProperty (id) == true) {
                                for ( var i = 0, received = parseInt(userItems[id]); i < amount; i++ ) {
                                    received++;
                                }
                                self.data.ri = owned;
                            } else {
                                for ( var i = 0, owned = 0; i < amount; i++ ){
                                    owned++;
                                }
                                self.data.ri = owned;
                            }
                            this.hasBeenChanged = true;
                            return true;
                        } else {
                            return false;
                        }
                    }
                    
                };
                
                /*
                 * Function: receive
                 * 
                 * Returns: *bool*
                 * 
                 * Parameters: *object* - data - An object that contains all data for an item to be given
                 * 
                 * Description: Adds a given item to a users inbox
                 */
                
                this.receive = function (data) {
                    if ( data.hasOwnProperty('item')
                        && data.hasOwnProperty('amount')
                        && data.hasOwnProperty('giver') 
                        && data.hasOwnProperty('giverID')
                        && data.hasOwnProperty('anonymous')
                    ) {
                        var obj = {};
                        obj.item = item;
                        obj.amount = amount;
                        obj.giver = giver;
                        obj.giverID = giverID;
                        obj.anonymous = anonymous;
                        self.data.ii.push(obj);
                        this.hasBeenChanged = true;
                        return true;
                    }
                    else 
                        return false;
                };
                
                /*
                 * Property: subtract
                 * 
                 * Description: Contains methods to subtract items from user hash
                 */
                
                this.subtract = {
                    
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
                            this.hasBeenChanged = true;
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
                            this.hasBeenChanged = true;                        
                        } else {
                            return false;                        
                        }                    
                    }
                      
                };
                
                return this;
            
            }
            
        };
        
        return userHash;
    
    })()
    
}.register();

