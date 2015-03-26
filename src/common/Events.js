/**
 * Created by dli on 22.02.2015.
 */
define('common/Events', ['common/Contract'], function (Contract) {

    return Contract.extend({
        on : function(event, handler){
            if (handler && typeof handler === 'function') {
                var handlers = this.handlers || (this.handlers = {});

                handlers = handlers[event] || (handlers[event] = []);

                handlers.push(handler);
            }

            return this;
        },

        off : function(event, handler){
            var handlers = this.handlers || (this.handlers = {});

            if(handler){
                handlers = handlers[event];

                if(handlers){
                    var k = -1;
                    for(var i = 0; i < handlers.length; i++){
                        if(handlers[i] == handler) {
                            k = i;
                            break;
                        }
                    }

                    if(k >= 0){
                        handlers.splice(k, 1);
                    }
                }
            } else if (event){
                delete handlers[event];
            } else {
                this.handlers = {};
            }

            return this;
        },

        trigger : function(event){
            var handlers = this.handlers || (this.handlers = {});

            handlers = handlers[event];
            if(handlers) {
                for (var i = 0; i < handlers.length; i++) {
                    try {
                        handlers[i].apply(this, Array.prototype.slice.call(arguments, 1));
                    } catch(error){}
                }
            }
        }
    });
});
