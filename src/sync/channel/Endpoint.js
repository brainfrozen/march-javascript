/**
 *
 */

define('sync/channel/Endpoint', [
    'common/Events',
    'sync/time/after',
    'sync/transform/Transformer'

], function (Events, after, Transformer) {

    var _abstractFunction = function(){
        throw new Error('UnimplementedFunction');
    }

    var Endpoint = Events.extend({

        declare : ['remoteTime', 'queue'],

        initialize: function(){
            this.queue = [];

            this.remoteTime    = 0;

            this.transformer || (this.transformer = new Transformer);
        },

        receive: function(message) {
            var queue = this.queue;

            // remove messages member has seen already
            try {
                while(queue.length > 0 && !after(this.getLocalTime(queue[0]), this.getLocalTime(message))){
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

                this.trigger('inbound', message);

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

            this.trigger('outbound', message);

            return this;
        },

        setRemoteTime:  _abstractFunction,
        setLocalTime:   _abstractFunction,
        getRemoteTime:  _abstractFunction,
        getLocalTime:   _abstractFunction
    });

    return Endpoint;
});




