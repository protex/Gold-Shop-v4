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
         * Description: Array that holds all plugins registerd with the function for initiation
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
