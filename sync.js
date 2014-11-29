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
	 * 
	 */

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
     * Function: userDataCheck
     * 
     * Description: Checks if any of the userData hashes need updated
     * 
     * Parameters: *dry_run* - bool - set true if encase actual ajax calls are not wanted
     * 
     * Returns: *array* - Contains all hashes that need/were updated 
     * 
     */
    
    userDataCheck: function (dry_run) {
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
    	} else {
    		return changedHashes;
    	}
    }
	
};
