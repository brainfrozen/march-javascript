/**
 * Created by dli on 25.01.2015.
 */
define('sync/time/CONST', function () {
    var LOGICAL_HOUR = Math.pow(2, 24);

    return {
        LOGICAL_HOUR : LOGICAL_HOUR,
        CERTAINTY_MARGIN : LOGICAL_HOUR / 100
    };
});