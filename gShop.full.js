/*******************************************
* Copyright (c) Peter Maggio               *
* (protex.boards.net)                      *
* 2014 all rights reserved                 *
* Not to be redistributed                  *
* http://support.proboards.com/user/173855 *
********************************************/

if ( typeof vitals == undefined ) {
    vitals = {};
}


vitals.shop = (function(){
    

    var main = {
        
        
        settings: {
            name: 'main',
            version: '0.0.1',
            registered: false,
        },
        
        
        plugins: [],
        
        
        register: function (name, func) {
            vitals.shop[name] = func;
            if ( vitals.shop.hasOwnProperty(name) ) {
                this.plugins.push(func);
                vitals.shop[name].settings.registered = true;
            }
        },
        
        
        init: function () {
            for ( var i in this.plugins ) {
                this.plugins[i].init();
            }       
        },
        
        
        userDataHash: {}
        
    };
    
    return main;

})();
 
 

var items = {
    

    settings: {
        name: 'items',
        version: '0.0.1',
        registered: false
    },
    
    
    register: function () {
        vitals.shop.register('items', this);
    },
    
    
    init: function () {return},
    
    
    itemList: (function(){
        var settings = pb.plugin.get('gold_shop_v4').settings,
            uItems = settings.items;
        
        function itemList(key) {
            
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
        
        return itemList;        
    })()    
    
}.register();

 
 

var userData = {
    
    
    settings: {
        name: 'userData',
        version: '0.0.1',
        registered: false,  
    },
    
    
    register: function () { vitals.shop.register(this.settings.name, this); },
    
    
    init: function () {
        this.createUserDataHash();
    },
    
    
    createUserDataHash: function () {
        var key = proboards.plugin.keys.data['gold_shop_super'];
            userList = Object.keys(proboards.plugin.keys.permissions.gold_shop_super);
            
        for ( var i in userList ) {
            var userData = ( key.hasOwnProperty(i) == true )? key[i]: null;
            vitals.shop.userDataHash[userList[i]] = new this.userHash(userList[i]);
        }       
    },
    
    
    userHash: (function(){
    
    var plugin = pb.plugin.get('gold_shop_v4'),
        sKey = proboards.plugin.keys.data['gold_shop_v4'];
        
        function userHash(user, data) {
            
            var self = this;
            
            this.data = ( (typeof data).toUpperCase() == "OBJECT" )? data : {
                
                
                bi: {},
                
                
                ri: {},
                
                
                io: [],
                
                
                ii: [],
                
                
                ir: []
                
            };
            
            
            this.user = user;
            
            
            this.get = {
                
                
                bought: function () {
                    return self.data.bi;
                },
                
                
                received: function () {
                    return self.data.ri;
                },
                
                
                outbox: function () {
                    return self.data.io;
                },
                
                
                inbox: function () {
                    return self.data.ii;
                }
                
            };
            
            
            this.set = {
                
                
                bought: function ( data ) {
                    if ( (typeof data).toUpperCase() == "OBJECT" ) {
                        self.data.bi = data;
                    }
                },
                
                
                received: function ( data ) {
                    if ( (typeof data).toUpperCase() == "OBJECT" ) {
                        self.data.ri = data;
                    }
                },
                
                
                outbox: function ( array ) { 
                    if ( (typeof array).toUpperCase() == "ARRAY" ) {
                        self.data.io = array;
                    }
                },
                
                
                inbox: function ( array) {
                    if ( (typeof array).toUpperCase() == "ARRAY" ) {
                        self.data.ii = array;
                    }   
                },
                
                
                rejected: function ( array ) {
                    if ( (typeof array).toUpperCase() == "ARRAY" ) {
                        self.data.ri = array;
                    }   
                }
                
            };
            
            
            this.add = {
                
                
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
                        return true;
                    } else {
                        return false;
                    }
                },
                
                
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
                        return true;
                    } else {
                        return false;
                    }
                }
                
            };
            
            
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
                    return true;
                }
                else 
                    return false;
            };
            
            
            this.subtract = {
                
                
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
                        return true;                        
                    } else {
                        return false;                        
                    }
                },
                
                
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
                    } else {
                        return false;                        
                    }                    
                }
                  
            };
            
            return this;
            
        };
        
        return userHash;
    
    })()
    
}.register();


var start = setInterval(function() {
    if (!$.isReady) return;
    clearInterval(start);

    vitals.shop.init();

}, 100);


