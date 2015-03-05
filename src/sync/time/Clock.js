/**
 * Created by dli on 25.01.2015.
 */
define('sync/time/Clock', ['sync/time/CONST'], function (CONST) {
    var Clock = function (time){
        this.time = time || 0;
    }

    Clock.prototype.tick = function(){
        return this.time < CONST.LOGICAL_HOUR - 1 ? ++this.time : (this.time = 0);
    }

    Clock.prototype.setTime = function(time) {
        this.time = time;
    }

    Clock.prototype.getTime = function(time) {
        return this.time;
    }

    return Clock;
});


