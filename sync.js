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
