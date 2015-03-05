/**
 * Created by dli on 25.01.2015.
 */
var after       = require('sync/time/after');
var CONSTANTS   = require('sync/time/CONST');

describe("Verify for after ", function () {
    it("it returns true if first argument is by 1 greater than the second argument", function () {
        expect(after(1, 0)).toBe(true);
    });

    it("it returns true if first argument is 0 and second is minutes_per_hour - 1", function () {
        expect(after(0, CONSTANTS.LOGICAL_HOUR - 1)).toBe(true);
    });

    it("it throws an error when the the arguments differ significantly", function () {
        expect(function(){
            after(0, (CONSTANTS.LOGICAL_HOUR / 2))
        }).toThrowError('UncertainTemporalRelation');
    });
});
