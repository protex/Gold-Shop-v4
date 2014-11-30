/*
 * Class: sync
 * 
 * Description: Handles syncing of all data
 */

var sync = {
	
	/* 
	 * Property: settings
	 * 
	 * Description: Contains all settings needed for the sync module
	 */
	
	settings: {
		name: 'sync',
		version: '0.0.1',
		registered: false,
		versionComment: 'Initial version'
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
	}
	
};
