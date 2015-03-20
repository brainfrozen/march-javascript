/**
 * Created by dli on 25.01.2015.
 */

var Constant    = require('data/Constant'),
    Pointer     = require('data/Pointer');

var Insert      = require('data/command/Insert');

var Operation   = require('sync/buffer/Operation');

var Transformer = require('sync/transform/Transformer');

describe('Verify for Transformer', function () {

    var transformer = new Transformer,

        pointer = new Pointer,

        a = new Constant({ 'type':'string', 'value': 'a' }),
        b = new Constant({ 'type':'string', 'value': 'b' }),
        c = new Constant({ 'type':'string', 'value': 'c' }),
        d = new Constant({ 'type':'string', 'value': 'd' }),

        a0 = new Operation({
            pointer: pointer,
            command:  new Insert({ offset: 0, data: a})
        }),

        b0 = new Operation({
            pointer: pointer,
            command: new Insert({ offset: 0, data: b})
        }),

        c0 = new Operation({
            pointer: pointer,
            command: new Insert({ offset: 0, data: c})
        }),
        c2 = new Operation({
            pointer: pointer,
            command:new Insert({ offset: 2, data: c })
        }),

        d0 = new Operation({
            pointer: pointer,
            command: new Insert({ offset: 0, data: d })
        }),
        d2 = new Operation({
            pointer: pointer,
            command: new Insert({ offset: 2, data: d })
        });

    it('inclusion of operation lists works', function(){
        var ol1 = [ a0, b0 ],
            ol2 = [ c0, d0 ];

        transformer.transform(ol1, ol2, false);

        expect(a0.equals(ol1[0])).toBeTruthy();
        expect(b0.equals(ol1[1])).toBeTruthy();
        expect(c2.equals(ol2[0])).toBeTruthy();
        expect(d2.equals(ol2[1])).toBeTruthy();
    });
});
