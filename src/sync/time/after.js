/**
 * Created by dli on 25.01.2015.
 */
define('sync/time/after',['sync/time/CONST'], function (CONST) {
    return function(t1, t2){
        if(t1 > t2){
            var trailing  = t1 - t2,
                heading   = CONST.LOGICAL_HOUR - t1 + t2;

            if(Math.min(trailing, heading) > CONST.CERTAINTY_MARGIN) throw new Error('UncertainTemporalRelation');

            return trailing < heading;
        } else if (t1 < t2){
            var trailing  = t2 - t1,
                heading   = CONST.LOGICAL_HOUR - t2 + t1;

            if(Math.min(trailing, heading) > CONST.CERTAINTY_MARGIN) throw new Error('UncertainTemporalRelation');

            return heading < trailing;
        }

        return false;
    }
});