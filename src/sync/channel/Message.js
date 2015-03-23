/**
 *
 */

define('sync/channel/Message', [
    'common/Contract'
], function (Contract) {

    return Contract.extend({

        declare : ['member', 'memberTime', 'leaderTime', 'operations'],

        initialize: function(){}

    });

});




