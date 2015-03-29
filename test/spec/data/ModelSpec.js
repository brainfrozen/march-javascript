/**
 * Created by dli on 25.01.2015.
 */
var Model       = require('data/Model'),
    Pointer     = require('data/Pointer'),
    Constant    = require('data/Constant'),
    Operation   = require('data/Operation'),
    Set         = require('data/command/Set'),
    Unset       = require('data/command/Unset'),
    Insert      = require('data/command/Insert'),
    Delete      = require('data/command/Delete'),
    Destruct    = require('data/command/Destruct'),
    Construct   = require('data/command/Construct');

describe("Verify for Model ", function () {

    var model,

        constant  = new Constant({
            'type':'string',
            'value': 'hello world'
        }),

        hashPointer = new Pointer,
        sequencePointer = new Pointer;

    beforeEach(function() {
        model = new Model()

        // recreate an empty hash
        .evaluate(hashPointer, new Construct({
            'type':'HASH'
        }))
        .evaluate(null, new Set({
            'identifier':'hash',
            'data': hashPointer
        }))

        // recreate an empty sequence
        .evaluate(sequencePointer, new Construct({
            'type':'SEQUENCE'
        }))
        .evaluate(null, new Set({
            'identifier':'sequence',
            'data': sequencePointer
        }));
    });

    it("setting a primitive works", function () {
      var   set = new Set({
                'identifier':'test',
                'data': constant
            }),
            constant2;

        model.evaluate(null, set);

        constant2 = model.find(null,'test');

        expect(constant2.equals(constant)).toBeTruthy();
    });

    it("setting a primitive as operation works", function () {
        var   set = new Set({
                'identifier':'test',
                'data': constant
            }),
            o = new Operation({
                pointer:null,
                command: set
            }),
            constant2;


        model.evaluate(o);

        constant2 = model.find(null,'test');

        expect(constant2.equals(constant)).toBeTruthy();
    });

    it("unsetting a primitive works", function () {

        var set = new Set({
                'identifier':'test',
                'data': constant
            }),
            unset = new Unset({
                'identifier':'test'
            }),
            constant2;

        model.evaluate(null, set);
        model.evaluate(null, unset);

        constant2 = model.find(null,'test');

        expect(constant2).toBeUndefined();
    });


    it("creation of hash works", function () {
        var pointer = new Pointer(),
            construct = new Construct({
                'type':'HASH'
            });
        model.evaluate(pointer, construct);
        expect(model.getType(pointer)).toBe('HASH');
    });

    it("creation of sequence works", function () {
        var pointer = new Pointer(),
            construct = new Construct({
                'type':'SEQUENCE'
            });
        model.evaluate(pointer, construct);
        expect(model.getType(pointer)).toBe('SEQUENCE');
    });

    it("setting and overriding data on hash works", function () {
        var constant2;

        model.evaluate(hashPointer, new Set({
            'identifier':'test',
            'data': constant
        }));

        constant2 = model.find(hashPointer, 'test');
        expect(constant2.equals(constant)).toBeTruthy();

        model.evaluate(hashPointer, new Set({
            'identifier':'test',
            'data': new Constant({
                'type' : 'string',
                'value' : 'nice to meet you'
            })
        }));

        constant2 = model.find(hashPointer, 'test')
        expect(constant2.equals(constant)).toBeFalsy();

    });

    it("insertion into sequence works", function () {
        var insert1 = new Insert({
                'offset':'0',
                'data': constant
            }),

            insert2 = new Insert({
                'offset':'0',
                'data': new Constant({
                    'type':'string',
                    'value': 'nice to meet you'
                })
            }),

            constant2;

        model.evaluate(sequencePointer, insert1, insert2);

        constant2 = model.find(sequencePointer, 0);
        expect(constant2.equals(constant)).toBeFalsy();

        constant2 = model.find(sequencePointer, 1);
        expect(constant2.equals(constant)).toBeTruthy();
    });

    it("destruction works", function () {
        var pointer = new Pointer(),
            construct = new Construct({
                'type':'HASH'
            });
        model.evaluate(pointer, construct);
        expect(model.getType(pointer)).toBe('HASH');

        model.evaluate(pointer, new Destruct);
        expect(model.getType(pointer)).toBeUndefined();
    });

    it("unsetting a primitive in a custom hash works", function () {

        var set = new Set({
                'identifier':'test',
                'data': constant
            }),
            unset = new Unset({
                'identifier':'test'
            });

        model.evaluate(hashPointer, set);
        expect( model.find(hashPointer,'test')).not.toBeUndefined();

        model.evaluate(hashPointer, unset);
        expect(model.find(hashPointer,'test')).toBeUndefined();
    });


    it("deletion from sequence works", function () {
        var insert1 = new Insert({
                'offset':'0',
                'data': constant
            }),

            insert2 = new Insert({
                'offset':'0',
                'data': new Constant({
                    'type':'string',
                    'value': 'nice to meet you'
                })
            }),

            del = new Delete({
               'offset': 0
            }),

            constant2;

        model.evaluate(sequencePointer, insert1, insert2);

        constant2 = model.find(sequencePointer, 0);
        expect(constant2.equals(constant)).toBeFalsy();

        constant2 = model.find(sequencePointer, 1);
        expect(constant2.equals(constant)).toBeTruthy();

        model.evaluate(sequencePointer, del);

        constant2 = model.find(sequencePointer, 0);
        expect(constant2.equals(constant)).toBeTruthy();

    });
});
