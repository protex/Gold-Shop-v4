if ( typeof vitals == undefined ) {
    vitals = {};
}

{INSERT}

var start = setInterval(function() {
    if (!$.isReady) return;
    clearInterval(start);

    vitals.shop.init();

}, 100);


