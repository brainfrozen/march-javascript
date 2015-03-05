/**
 * Created by dli on 25.01.2015.
 */
var Clock       = require('sync/time/Clock');
var CONST       = require('sync/time/CONST');

describe("Verify for Clock ", function () {
    it("a tick increases the value by 1", function () {
        expect(new Clock().tick()).toBe(1);
    });

    it("it properly overflows", function () {
        expect(new Clock(CONST.LOGICAL_HOUR -1).tick()).toBe(0);
    });
});

//Clock clock = new Clock(0);
//assertEquals(clock.tick(), 1);
//assertEquals(clock.adjust((int)Math.pow(2, 24) - 1), (int)Math.pow(2, 24)-1);
//assertEquals(clock.tick(), 0);