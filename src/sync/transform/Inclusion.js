/**
 * Created by dli on 06.03.2015.
 */
define('sync/transform/Inclusion', ['common/Contract'], function (Contract) {
    return Contract.extend({
        canInclude : function(){
            return false;
        }
    });
});

