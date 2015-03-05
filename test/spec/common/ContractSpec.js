/**
 * Created by dli on 25.01.2015.
 */
var Contract       = require('common/Contract');

describe("Verify for Contract ", function () {

    var A = Contract.extend({
        declare: ['a'],
        x: function(){
        }
    }),

    B = A.extend({
        declare: ['b'],
        y: function(){
        }
    }),

    C = B.extend({
        declare: ['c'],
        initialize:function(){
            this.c = 1;
        },
        z: function(){
        }
    }),

    b, c1, c2;

    beforeEach(function() {
        b = new B({'c': 2});
        c1 = new C();
        c2 = new C();
    });

    it("extension supports prototype chaining", function () {
        expect(c1.x).toBeDefined();
        expect(c1.y).toBeDefined();
        expect(c1.z).toBeDefined();
    });

    it("extension supports proper type resolution", function () {
        expect(c1 instanceof C).toBeTruthy();
        expect(c1 instanceof B).toBeTruthy();
        expect(c1 instanceof A).toBeTruthy();
    });

    it("construction works properly", function () {
        expect(b.c).toBe(2);
    });

    it("initialization works properly", function () {
        expect(c1.c).toBe(1);
    });

    it("comparison tests on declared attributes only", function () {
        c1.b = 'hello';
        c2.b = 'world';

        expect(c1.equals(c2)).toBeTruthy();
    });

    it("comparison fails on attribute difference", function () {
        c1.c = 2;

        expect(c1.equals(c2)).toBeFalsy();
    });

    it("comparison fails on type difference", function () {
        b.c = 1;

        expect(c1.equals(b)).toBeFalsy();
    });

    it("comparison fails on null", function () {
        expect(c1.equals(null)).toBeFalsy();
    });

    it("comparison fails on undefined", function () {
        expect(c1.equals(undefined)).toBeFalsy();
    });

});
