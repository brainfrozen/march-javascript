/**
 * Created by dli on 22.02.2015.
 */
define('data/Pointer', ['data/Data'], function (Data) {
    var Pointer = Data.extend({
        declare: ['address'],
        initialize: function(){
            if(typeof this.address === 'undefined'){
                this.address = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                });
            }
        }
    });

    return Pointer;
});