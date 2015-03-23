/**
 * Created by dli on 22.02.2015.
 */
define('data/Pointer', ['common/Util', 'data/Data'], function (Util, Data) {
    var Pointer = Data.extend({
        declare: ['address'],
        initialize: function(){
            if(typeof this.address === 'undefined'){
                this.address = Util.uuid();
            }
        }
    });

    return Pointer;
});