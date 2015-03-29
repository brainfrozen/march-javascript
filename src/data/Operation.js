/**
 * Created by dli on 06.03.2015.
 */
define('data/Operation', ['common/Contract'], function (Contract) {
    return Contract.extend({
       declare : ['command', 'pointer']
    });
});

