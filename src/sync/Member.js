/**
 * Brings memory state and endpoint together.
 */

define('sync/Member', [
    'common/Util',
    'common/Events',
    'data/Model',
    'data/Operation',
    'sync/channel/MemberEndpoint',
    'sync/channel/Message'

], function (Util, Events, Model, MemberEndpoint, Message, Operation) {

    return Events.extend({

        initialize : function(){
            var endpoint = this.endpoint = new MemberEndpoint({
                    transformer : options.transformer
                }),
                model = this.model = new Model(),
                self = this;

            this.handlers = {};

            if (!this.name) this.name = Util.uuid();

            endpoint.on('inbound', function(message){
                var operations = message.operations;
                for(var i = 0; i < operations.length; i++){
                    model.evaluate(operations[i]);

                    self.trigger('all', operations[i].pointer, operations[i].command);
                }
            });
        },

        evaluate : function(pointer, command){
            this.model.evaluate(pointer, command);

            var message = new Message({
                    'member' : this.name,
                    'memberTime' : this.clock.tick(),
                    'leaderTime': this.endpoint.getRemoteTime(),
                    'operations': [
                        new Operation({
                            'pointer': pointer,
                            'command': command
                        })
                    ]
                });

            this.endpoint.send(message);
        },

        find : function(pointer, qualifier) {
            return this.model.find(pointer, qualifier);
        },

        getEndpoint : function(){
            return this.endpoint;
        }
    });

});




