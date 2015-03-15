/**
 * Created by dli on 25.01.2015.
 */

var Constant      = require('data/Constant');

var Insert      = require('data/command/Insert');

var inclusions  = require('sync/transform/Inclusions');

describe("Verify for Inclusions", function () {

    var
        INSINS = new inclusions.InsertInsert(),
        INSDEL = new inclusions.InsertDelete(),
        DELINS = new inclusions.DeleteInsert(),
        delDel = new inclusions.DeleteDelete(),
        setSet = new inclusions.SetSet(),
        setUns = new inclusions.SetUnset(),
        unsSet = new inclusions.UnsetSet(),
        unsUns = new inclusions.UnsetUnset(),
        nilnil = new inclusions.NilNil(),

        INS1,
        INS2,
        INS3,

        constant = new Constant({
            'type':'string',
            'value': 'hello world'
        });

    beforeEach(function() {
        INS1 = new Insert({
            offset: 0,
            data: constant
        });
        INS2 = new Insert({
            offset: 0,
            data: constant
        });
        INS$ = new Insert({
            offset: 1,
            data: constant
        });

    });


    it("inclusion of insert in insert works in inferior mode", function () {
        expect(INSINS.include(INS1, INS2, true).equals(INS$)).toBeTruthy();
    });

    it("inclusion of insert in insert works in superior mode", function () {
        expect(INSINS.include(INS1, INS2, false).equals(INS1)).toBeTruthy();
    });

});
