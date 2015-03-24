/**
 * Created by dli on 25.01.2015.
 */

var Constant        = require('data/Constant'),
    Pointer         = require('data/Pointer');

var Insert          = require('data/command/Insert');

var Clock           = require('sync/time/Clock');

var Operation       = require('sync/channel/Operation'),
    Message         = require('sync/channel/Message'),
    MemberEndpoint  = require('sync/channel/MemberEndpoint');

describe('Verify for MemberEndpoint', function () {

    var member0 = '00000000-0000-0000-0000-000000000000',
        member1 = '11111111-1111-1111-1111-111111111111',

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
        }),

        endpoint,

        inBuffer = [],
        outBuffer = [];

    beforeEach(function() {
        inBuffer = [];
        outBuffer = [];

        endpoint = new MemberEndpoint();

        endpoint.on('outbound', function (message) {
            outBuffer.push(message);
        });

        endpoint.on('inbound', function (message) {
            inBuffer.push(message);
        });

    });

    it('outbound works', function(){
        var ol0 = [ a0, b0 ],
            ol1 = [ c0, d0 ],

            clock = new Clock(),

            m0 = new Message({
                member : member0,
                memberTime : clock.tick(),
                leaderTime : 0,
                operations : ol0
            }),

            m1 = new Message({
                member : member0,
                memberTime : clock.tick(),
                leaderTime : 0,
                operations : ol1
            });

        endpoint
            .send(m0)
            .send(m1);

        expect(outBuffer.length).toBe(2);
        expect(endpoint.remoteTime).toBe(0);

    });

    it('inbound works', function(){
        var ol0 = [ a0, b0 ],
            ol1 = [ c0, d0 ],

            clock = new Clock(),

            m0 = new Message({
                member : member0,
                memberTime : 0,
                leaderTime : clock.tick(),
                operations : ol0
            }),

            m1 = new Message({
                member : member0,
                memberTime : 0,
                leaderTime : clock.tick(),
                operations : ol1
            });

        endpoint
            .receive(m0)
            .receive(m1);

        expect(inBuffer.length).toBe(2);
        expect(endpoint.remoteTime).toBe(2);

    });

    it('synchronization works for inequivalent operation contexts', function(){
        var ol0 = [ a0, b0 ],
            ol1 = [ c0, d0 ],

            clk1 = new Clock(),
            clk2 = new Clock(),

            m0 = new Message({
                member : member0,
                memberTime : clk1.tick(),
                leaderTime : 0,
                operations : ol0
            }),

            m1 = new Message({
                member : member1,
                memberTime : 0,
                leaderTime : clk2.tick(),
                operations : ol1
            });

        endpoint
            .send(m0)
            .receive(m1);

        expect(inBuffer.length).toBe(1);

        m0 = inBuffer.shift();
        expect(c2.equals(m0.operations[0])).toBeTruthy();
        expect(d2.equals(m0.operations[1])).toBeTruthy();

    });

    it('synchronization works for equivalent operation contexts', function(){
        var ol0 = [ a0, b0 ],
            ol1 = [ c0, d0 ],

            clk1 = new Clock(),
            clk2 = new Clock(),

            m0 = new Message({
                member : member0,
                memberTime : clk1.tick(),
                leaderTime : 0,
                operations : ol0
            }),

            m1 = new Message({
                member : member1,
                memberTime : clk1.time,
                leaderTime : clk2.tick(),
                operations : ol1
            });

        endpoint
            .send(m0)
            .receive(m1);

        expect(inBuffer.length).toBe(1);

        m0 = inBuffer.shift();
        expect(c0.equals(m0.operations[0])).toBeTruthy();
        expect(d0.equals(m0.operations[1])).toBeTruthy();

    });

});