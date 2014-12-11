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
    		
    		this.categories = {};
    		
    		for ( var i in categories ) {
    			this.categories[categories[i].id] = categories[i].category;
    		}
    		
    		return this.categories;
    		
    	}
    	
    	return categoryHash;
    	
    })()   
    
}.register();

