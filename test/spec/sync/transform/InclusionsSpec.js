/**
 * Created by dli on 25.01.2015.
 */

var Constant      = require('data/Constant');

var Insert      = require('data/command/Insert'),
    Delete      = require('data/command/Delete'),
    Set         = require('data/command/Set'),
    Unset       = require('data/command/Unset');

    NIL         = require('data/command/NIL');

var inclusions  = require('sync/transform/Inclusions');

describe("Verify for Inclusions", function () {

    var INSINS = new inclusions.InsertInsert(),
        INSDEL = new inclusions.InsertDelete(),
        DELINS = new inclusions.DeleteInsert(),
        DELDEL = new inclusions.DeleteDelete(),
        SETSET = new inclusions.SetSet(),
        SETUNS = new inclusions.SetUnset(),
        UNSSET = new inclusions.UnsetSet(),
        UNSUNS = new inclusions.UnsetUnset(),
        NILNIL = new inclusions.NilNil(),

        constant1 = new Constant({
            'type':'string',
            'value': 'hello'
        }),

        constant2 = new Constant({
            'type':'string',
            'value': 'world'
        }),

        INS0 = new Insert({
            offset: 0,
            data: constant1
        }),
        INS1 = new Insert({
            offset: 1,
            data: constant1
        }),

        DEL0 = new Delete({
            offset: 0
        }),
        DEL1 = new Delete({
            offset: 1
        }),

        SET0 = new Set({
            identifier: 'name',
            data: constant1
        }),
        SET1 = new Set({
            identifier: 'name',
            data: constant2
        }),

        UNSET0 = new Unset({
            identifier: 'name'
        });

    beforeEach(function() {



    });


    it("inclusion of insert in insert works in inferior mode", function () {
        expect(INSINS.include(INS0, INS0, true).equals(INS1)).toBeTruthy();
    });

    it("inclusion of insert in insert works in superior mode", function () {
        expect(INSINS.include(INS0, INS0, false).equals(INS0)).toBeTruthy();
    });

    it("inclusion of insert in delete works in inferior mode", function () {
        expect(INSDEL.include(INS1, DEL0, true).equals(INS0)).toBeTruthy();
    });

    it("inclusion of insert in delete works in superior mode", function () {
        expect(INSDEL.include(INS1, DEL0, false).equals(INS0)).toBeTruthy();
    });

    it("inclusion of delete in insert works in inferior mode", function () {
        expect(DELINS.include(DEL0, INS0, true).equals(DEL1)).toBeTruthy();
    });

    it("inclusion of delete in insert works in superior mode", function () {
        expect(DELINS.include(DEL0, INS0, false).equals(DEL1)).toBeTruthy();
    });

    it("inclusion of delete in delete works in inferior mode with same offsets", function () {
        expect(DELDEL.include(DEL0, DEL0, true).equals(NIL)).toBeTruthy();
    });

    it("inclusion of delete in delete works in superior mode with same offsets", function () {
        expect(DELDEL.include(DEL0, DEL0, false).equals(NIL)).toBeTruthy();
    });

    it("inclusion of delete in delete works in inferior mode with different offsets", function () {
        expect(DELDEL.include(DEL1, DEL0, true).equals(DEL0)).toBeTruthy();
    });

    it("inclusion of delete in delete works in superior mode with different offsets", function () {
        expect(DELDEL.include(DEL1, DEL0, false).equals(DEL0)).toBeTruthy();
    });

    it("inclusion of set in set works in inferior mode", function () {
        expect(SETSET.include(SET0, SET1, true).equals(NIL)).toBeTruthy();
    });

    it("inclusion of set in set works in superior mode", function () {
        expect(SETSET.include(SET0, SET1, false).equals(SET0)).toBeTruthy();
    });

    it("inclusion of unset in set works in inferior mode", function () {
        expect(UNSSET.include(UNSET0, SET0, true).equals(NIL)).toBeTruthy();
    });

    it("inclusion of unset in set works in superior mode", function () {
        expect(UNSSET.include(UNSET0, SET0, false).equals(NIL)).toBeTruthy();
    });

    it("inclusion of set in unset works in inferior mode", function () {
        expect(SETUNS.include(SET0, UNSET0, true).equals(SET0)).toBeTruthy();
    });

    it("inclusion of set in unset works in superior mode", function () {
        expect(SETUNS.include(SET0, UNSET0, false).equals(SET0)).toBeTruthy();
    });

    it("inclusion of unset in unset works in inferior mode", function () {
        expect(UNSUNS.include(UNSET0, UNSET0, true).equals(NIL)).toBeTruthy();
    });

    it("inclusion of unset in unset works in superior mode", function () {
        expect(UNSUNS.include(UNSET0, UNSET0, false).equals(NIL)).toBeTruthy();
    });

    it("inclusion of any in nil works in inferior mode", function () {
        expect(NILNIL.include(UNSET0, NIL, true).equals(UNSET0)).toBeTruthy();
    });

    it("inclusion of any in nil works in superior mode", function () {
        expect(NILNIL.include(UNSET0, NIL, false).equals(UNSET0)).toBeTruthy();
    });

    it("inclusion of nil in any works in inferior mode", function () {
        expect(NILNIL.include(NIL, UNSET0, true).equals(NIL)).toBeTruthy();
    });

    it("inclusion of nil in any works in superior mode", function () {
        expect(NILNIL.include(NIL, UNSET0, false).equals(NIL)).toBeTruthy();
    });

});
