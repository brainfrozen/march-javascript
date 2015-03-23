/**
 *
 */

define('sync/channel/Endpoint', [
    'common/Contract',
    'sync/time/after',
    'sync/transform/Transformer'

], function (Contract, after, Transformer) {

    var _abstractFunction = function(){
        throw new Error('UnimplementedFunction');
    }

    var Endpoint = Contract.extend({

        declare : ['remoteTime', 'queue'],

        initialize: function(){
            this.handlers = {};

            this.queue = [];

            this.remoteTime    = 0;

            this.transformer || (this.transformer = new Transformer);
        },

        receive: function(message) {
            var queue = this.queue;

            // remove messages member has seen already
            try {
                while(queue.length > 0 && after(this.getLocalTime(queue[0]), this.getLocalTime(message))){
                    queue.shift();
                }

                // harmonize remaining messages in buffer and new message at once
                var enqueued;
                for (var i = 0; i < queue.length; i++){
                    enqueued = queue[i];
                    this.transformer.transform(message.operations, enqueued.operations, message.member > enqueued.member);

                    // adjust times
                    this.setRemoteTime(enqueued, this.getRemoteTime(message));
                    this.setLocalTime(message, this.getLocalTime(enqueued));
                }

                this.remoteTime = this.getRemoteTime(message); // make sure time is preserved on empty queue

                var handlers = this.handlers['inbound'];
                if(handlers) {
                    for (var i = 0; i < handlers.length; i++) {
                        handlers[i](message);
                    }
                }

            } catch (e) {
                throw new Error('ChannelException');
            }

            return this;
        },

        send: function(message) {
            if(this.getRemoteTime(message) != this.remoteTime) {
                throw new Error('SynchronicityException');
            }

            this.queue.push(message);

            var handlers = this.handlers['outbound'];
            if(handlers) {
                for (var i = 0; i < handlers.length; i++) {
                    handlers[i](message);
                }
            }

            return this;
        },

        on : function(event, handler){
            if (handler && typeof handler === 'function') {
                var handlers = this.handlers[event] || (this.handlers[event] = []);

                handlers.push(handler);
            }

            return this;
        },

        off : function(event, handler){
            if(handler){
                var handlers = this.handlers[event];
                if(handlers){
                    var k = -1;
                    for(var i = 0; i < handlers.length; i++){
                        if(handlers[i] = handler) {
                            k = i;
                            break;
                        }
                    }

                    if(k >= 0){
                        handlers.splice(k, 1);
                    }
                }
            } else if (event){
                delete this.handlers[event];
            } else {
                this.handlers = {};
            }

            return this;
        },

        setRemoteTime:  _abstractFunction,
        setLocalTime:   _abstractFunction,
        getRemoteTime:  _abstractFunction,
        getLocalTime:   _abstractFunction
    });

    return Endpoint;
});




