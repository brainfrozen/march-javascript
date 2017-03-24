/**
 * Created by dli on 22.02.2015.
 * @deprecated use es6 classes instead
 */
define('common/Contract', [], function () {

    // some boilerplate taken from underscore
    function _isObject(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    function _allKeys(obj) {
        if (!_isObject(obj)) return [];
        var keys = [];
        for (var key in obj) keys.push(key);
        return keys;
    }

    function _createAssigner(keysFunc, undefinedOnly) {
        return function(obj) {
            var length = arguments.length;
            if (length < 2 || obj == null) return obj;
            for (var index = 1; index < length; index++) {
                var source = arguments[index],
                    keys = keysFunc(source),
                    l = keys.length;
                for (var i = 0; i < l; i++) {
                    var key = keys[i];
                    if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
                }
            }
            return obj;
        };
    };

    var _extend     = _createAssigner(_allKeys);
    var _defaults   = _createAssigner(_allKeys, true);


    var Contract = function (attributes){
        if(attributes && _isObject(attributes)) {
            _defaults(this, attributes);
        }

        this.initialize.apply(this, arguments);
    }

    _extend(Contract.prototype, {
        declare: [],
        initialize : function () {
        },
        clone: function(){
            //TODO: code here
        },
        equals: function(obj) {
            if (this == obj)
                return true;
            if (typeof obj === 'undefined' || obj == null)
                return false;
            if (obj.constructor != this.constructor)
                return false;

            var declare =  this.declare;
            for(var i = 0; i < declare.length; i++) {
                if(this[declare[i]] instanceof Contract){
                    if (!this[declare[i]].equals(obj[declare[i]]))
                        return false;
                } else if (this[declare[i]] !== obj[declare[i]])
                    return false;
            }

            return true;
        }
    });

    /**
     * Note: taken from backbone
     * @param protoProps
     * @param staticProps
     * @returns {*}
     */
    var extend = function(protoProps, staticProps) {
        var parent = this;
        var child;

        // The constructor function for the new subclass is either defined by you
        // (the "constructor" property in your `extend` definition), or defaulted
        // by us to simply call the parent's constructor.
        if (protoProps && protoProps.hasOwnProperty('constructor')) {
            child = protoProps.constructor;
        } else {
            child = function(){ return parent.apply(this, arguments); };
        }

        // Add static properties to the constructor function, if supplied.
        _extend(child, parent, staticProps);

        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function.
        var Surrogate = function(){ this.constructor = child; };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;

        // Add prototype properties (instance properties) to the subclass,
        // if supplied.
        if (protoProps) _extend(child.prototype, protoProps);

        // Set a convenience property in case the parent's prototype is needed
        // later.
        child.__super__ = parent.prototype;

        return child;
    };

    Contract.extend = extend;

    return Contract;
});

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

/**
 * Created by dli on 22.02.2015.
 */
define('common/Util', function () {

   return {
       uuid : function(){
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
       }
   }
});

/**
 * Created by dli on 22.02.2015.
 */

define('data/Command', ['common/Contract'], function (Contract) {
    return Contract.extend();
});


/**
 * Created by dli on 22.02.2015.
 */
define('data/Constant', ['data/Data'], function (Data) {
    return Data.extend({
        declare: ['value', 'type'] //types: number, string, boolean
    });
});
/**
 * Created by dli on 22.02.2015.
 */
define('data/Data', ['common/Contract'], function (Contract) {
    return Contract.extend();
});

/**
 * Created by dli on 22.02.2015.
 */

define('data/Model', [
    'data/Pointer',
    'data/command/Construct',
    'data/command/Destruct',
    'data/command/Insert',
    'data/command/Delete',
    'data/command/Set',
    'data/command/Unset'],

    function (Pointer, Construct, Destruct, Insert, Delete, Set, Unset) {

        function _isArray(arg){
            return typeof arg === 'object' && arg instanceof Array;
        }

        function _serialize (pointer, target){
            switch(_typeOf(target)){
                case 'HASH': return _serializeHash(pointer, target); break;
                case 'SEQUENCE': return _serializeSequence(pointer, target); break;
            }
        }

        function _serializeSequence (pointer, sequence){
            var output = [];

            for(var i = 0; i < sequence.length; i++){
                output.push(new Operation({
                    pointer: pointer,
                    command: new Insert({
                        offset: i,
                        data: sequence[i]
                    })
                }));
            }

            return output;
        }

        function _serializeHash (pointer, hash){
            var output = [];

            for(var i in hash){
                output.push(new Operation({
                    pointer: pointer,
                    command: new Set({
                        identifier: i,
                        data: sequence[i]
                    })
                }));
            }

            return output;
        }

        function _typeOf(target){
            if(typeof target !== 'undefined' && target != null) {
                return target instanceof Array ? 'SEQUENCE' : 'HASH';
            }
        }

        var Model = function(){
            this._base = new Pointer();

            this._memory  = {};
            this._memory[this._base.address] = {};
        };

        Model.prototype.evaluate = function(){
            var pointer, commands, command;

            if(arguments[0] instanceof Operation){
                pointer = arguments[0].pointer;
                commands = [arguments[0].command];
            } else {
                pointer = arguments[0];
                commands = Array.prototype.slice.call(arguments, 1);
            }

            var target;
            if(pointer){
                target = this._memory[pointer.address];
            } else {
                target = this._memory[this._base.address];
            }

            for (var i = 0; i < commands.length; i++) {
                command = commands[i];

                if (command instanceof Construct) {
                    if (target) throw new Error('DuplicateObjectException');

                    switch(command.type){
                        case 'HASH': target = {}; break;
                        case 'SEQUENCE': target = []; break;
                        default: throw new Error('UnknownTypeException');
                    }

                    this._memory[pointer.address] = target;
                } else if (command instanceof Destruct) {
                    if (!target) throw new Error('NoSuchObjectException');
                    delete this._memory[pointer.address];
                    target = null;
                } else if (command instanceof Insert) {
                    if (!_isArray(target)) throw new Error('TypeException');
                    target.splice(command.offset, 0, command.data);
                } else if (command instanceof Delete) {
                    if (!_isArray(target)) throw new Error('TypeException');
                    target.splice(command.offset, 1);
                } else if (command instanceof Set) {
                    if (typeof target !== 'object') throw new Error('TypeException');
                    target[command.identifier] = command.data;
                } else if (command instanceof Unset) {
                    if (typeof target !== 'object') throw new Error('TypeException');
                    delete target[command.identifier];
                } else if (!command instanceof Nil) {
                    throw new Error('UnsupportedCommandException');
                }
            }

            return this;
        };

        Model.prototype.find = function(pointer, qualifier){
            var target;

            if(pointer){
                target = this._memory[pointer.address];
            } else {
                target = this._memory[this._base.address];
            }

            if(typeof target !== 'undefined' && typeof qualifier !== 'undefined' && qualifier != null) {
                return target[qualifier];
            }
        }

        Model.prototype.getType = function(pointer){
            if(pointer){
                var target = this._memory[pointer.address];
                return _typeOf(target);
            }
        }

        Model.prototype.serialize = function(pointer){
            var memory = this._memory,
                target;

            if(pointer){
                target = memory[pointer.address];
                return _serialize(pointer, target);
            } else {
                var output = [];

                for (var i in memory) {
                    target = memory[i];

                    pointer = (i === this._base.address ? null : new Pointer({address: i}));

                    // if not root add construct operation
                    if (pointer) {
                        output.push(new Operation({
                            pointer: pointer,
                            command: new Construct({
                                type: _typeOf(target)
                            })
                        }));
                    }

                    // write data out
                    output.concat(_serialize(pointer, target));
                }

                return output;
            }
        }

        return Model;
    }
);

/**
 * Created by dli on 06.03.2015.
 */
define('data/Operation', ['common/Contract'], function (Contract) {
    return Contract.extend({
       declare : ['command', 'pointer']
    });
});


/**
 * Created by dli on 22.02.2015.
 */
define('data/Pointer', ['common/Util', 'data/Data'], function (Util, Data) {
    var Pointer = Data.extend({
        declare: ['address'],
        initialize: function(){
            if(typeof this.address === 'undefined'){
                this.address = Util.uuid();
            }
        }
    });

    return Pointer;
});
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





/**
 * Created by dli on 22.02.2015.
 */

define('data/command/Construct', ['data/Command'], function (Command) {
    return Command.extend({
        declare: ['type'],
        initialize : function(){
            if(!this.type){
                this.type = 'HASH';
            }
        }
    });
});
/**
 * Created by dli on 22.02.2015.
 */
define('data/command/Delete', ['data/Command'], function (Command) {
    return Command.extend({
        declare: ['offset']
    });
});
/**
 * Created by dli on 22.02.2015.
 */

define('data/command/Destruct', ['data/Command'], function (Command) {
    return Command.extend();
});
/**
 * Created by dli on 22.02.2015.
 */
define('data/command/Insert', ['data/Command'], function (Command) {
    return Command.extend({
        declare: ['offset', 'data']
    });
});
/**
 * Created by dli on 22.02.2015.
 */
define('data/command/Nil', ['data/Command'], function (Command) {
    return Command.extend();
});

define('data/command/NIL', ['data/command/Nil'], function (Nil) {
    return new Nil();
});
/**
 * Created by dli on 22.02.2015.
 */
define('data/command/Set', ['data/Command'], function (Command) {
    return Command.extend({
        declare: ['identifier', 'data']
    });
});
/**
 * Created by dli on 22.02.2015.
 */
define('data/command/Unset', ['data/Command'], function (Command) {
    return Command.extend({
        declare: ['identifier']
    });
});
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





/**
 * Created by dli on 23.03.2015.
 */
define('sync/channel/MemberEndpoint', ['sync/channel/Endpoint'], function (Endpoint) {
    return Endpoint.extend({
        setRemoteTime: function(message, time){
            message.leaderTime = time;
        },

        setLocalTime: function(message, time){
            message.memberTime = time;
        },

        getRemoteTime: function(message){
            return message.leaderTime;
        },

        getLocalTime:   function(message){
            return message.memberTime;
        }
    });
});

/**
 *
 */

define('sync/channel/Message', [
    'common/Contract'
], function (Contract) {

    return Contract.extend({

        declare : ['member', 'memberTime', 'leaderTime', 'operations'],

        initialize: function(){}

    });

});





/**
 * Created by dli on 25.01.2015.
 */
define('sync/time/after',['sync/time/CONST'], function (CONST) {
    return function(t1, t2){
        if(t1 > t2){
            var trailing  = t1 - t2,
                heading   = CONST.LOGICAL_HOUR - t1 + t2;

            if(Math.min(trailing, heading) > CONST.CERTAINTY_MARGIN) throw new Error('UncertainTemporalRelation');

            return trailing < heading;
        } else if (t1 < t2){
            var trailing  = t2 - t1,
                heading   = CONST.LOGICAL_HOUR - t2 + t1;

            if(Math.min(trailing, heading) > CONST.CERTAINTY_MARGIN) throw new Error('UncertainTemporalRelation');

            return heading < trailing;
        }

        return false;
    }
});
/**
 * Created by dli on 25.01.2015.
 */
define('sync/time/Clock', ['sync/time/CONST'], function (CONST) {
    var Clock = function (time){
        this.time = time || 0;
    }

    Clock.prototype.tick = function(){
        return this.time < CONST.LOGICAL_HOUR - 1 ? ++this.time : (this.time = 0);
    }

    Clock.prototype.setTime = function(time) {
        this.time = time;
    }

    Clock.prototype.getTime = function(time) {
        return this.time;
    }

    return Clock;
});



/**
 * Created by dli on 25.01.2015.
 */
define('sync/time/CONST', function () {
    var LOGICAL_HOUR = Math.pow(2, 24);

    return {
        LOGICAL_HOUR : LOGICAL_HOUR,
        CERTAINTY_MARGIN : LOGICAL_HOUR / 100
    };
});
/**
 * Created by dli on 06.03.2015.
 */
define('sync/transform/Inclusion', ['common/Contract'], function (Contract) {
    return Contract.extend({
        canInclude : function(){
            return false;
        }
    });
});


/**
 * Created by dli on 06.03.2015.
 */
define('sync/transform/Inclusions', [
    'exports',

    'sync/transform/Inclusion',
    'data/command/Insert',
    'data/command/Delete',
    'data/command/Set',
    'data/command/Unset',
    'data/command/Construct',
    'data/command/Destruct',
    'data/command/NIL'

], function (exports, Inclusion, Insert, Delete, Set, Unset, Construct, Destruct, NIL) {

    var InsertInsert = exports.InsertInsert = Inclusion.extend({
        canInclude: function (c1, c2) {
            return c1 instanceof Insert && c2 instanceof Insert;
        },
        include: function (c1, c2, inferior) {
            if (c1.offset > c2.offset || (c1.offset === c2.offset && inferior)) {
                return new Insert({
                    offset: c1.offset + 1,
                    data: c1.data
                });
            }
            return c1;
        }
    });

    var InsertDelete = exports.InsertDelete = Inclusion.extend({
        canInclude: function (c1, c2) {
            return c1 instanceof Insert && c2 instanceof Delete;
        },
        include: function (c1, c2, inferior) {
            if (c1.offset > c2.offset) {
                return new Insert({
                    offset: c1.offset - 1,
                    data : c1.data
                });
            }

            return c1;
        }
    });

    var DeleteInsert = exports.DeleteInsert = Inclusion.extend({
        canInclude: function (c1, c2) {
            return c1 instanceof Delete && c2 instanceof Insert;
        },
        include: function (c1, c2, inferior) {
            if (c1.offset >= c2.offset) {
                return new Delete({
                    offset: c1.offset + 1
                });
            }

            return c1;
        }
    });

    var DeleteDelete = exports.DeleteDelete = Inclusion.extend({
        canInclude: function (c1, c2) {
            return x1 instanceof Delete && c2 instanceof Delete;
        },
        include: function (c1, c2, inferior) {
            if (c1.offset === c2.offset) {
                return NIL;
            } else if (c1.offset > c2.offset) {
                return new Delete({
                    offset: c1.offset - 1
                });
            }

            return c1;
        }
    });

    var SetSet = exports.SetSet = Inclusion.extend({
        canInclude: function (c1, c2) {
            return c1 instanceof Set && c2 instanceof Set;
        },
        include: function (c1, c2, inferior) {
            if ((c1.identifier === c2.identifier) && inferior) {
                return NIL
            }

            return c1;
        }
    });

    var SetUnset = exports.SetUnset = Inclusion.extend({
        canInclude: function (c1, c2) {
            return c1 instanceof Set && c2 instanceof Unset;
        },
        include: function (c1, c2, inferior) {
            return c1;
        }
    });

    var UnsetSet = exports.UnsetSet = Inclusion.extend({
        canInclude: function (c1, c2) {
            return c1 instanceof Unset && c2 instanceof Set;
        },
        include: function (c1, c2, inferior) {
            if (c1.identifier === c2.identifier) {
                return NIL;
            }

            return c1;
        }

    });

    var UnsetUnset = exports.UnsetUnset = Inclusion.extend({
        canInclude: function(c1, c2) {
            return c1 instanceof Unset && c2 instanceof Unset;
        },
        include: function(c1, c2, inferior) {
            if (c1.identifier === c2.identifier){
                return NIL;
            }

            return c1;
        }
    });

    var NilNil = exports.NilNil = Inclusion.extend({
        canInclude: function(c1, c2) {
            return c1 instanceof Nil || c2 instanceof Nil;
        },
        include: function(c1, c2, inferior) {
            return c1;
        }
    });

    exports.ALL = [
        new InsertInsert,
        new DeleteDelete,
        new DeleteInsert,
        new InsertDelete,
        new SetSet,
        new UnsetUnset,
        new SetUnset,
        new UnsetSet,
        new NilNil
    ];
});

/**
 * Created by dli on 17.02.2015.
 */
define('sync/transform/Transformer', [
    'sync/transform/Inclusions'
], function (Inclusions) {

    var Transformer = function(transformers){
        this.transformers = (transformers || Inclusions.ALL);
    }

    Transformer.prototype.transform = function(ol1, ol2, inferior) {
        var ol  = ol1.slice();// [];// preserve a copy of the original

        for(var i = 0; i < ol1.length; i++){
            //ol[i] = ol1[i].slice();

            for(var j = 0; j < ol2.length; j++){
                // on context equivalence
                if(((ol1[i].pointer === null || ol1[i].pointer === void 0) && (ol2[j].pointer == null || ol2[j].pointer === void 0)) ||
                    (ol1[i].pointer != null && ol1[i].pointer.equals(ol2[j].pointer) )){

                    ol1[i].command = this.include(ol1[i].command, ol2[j].command, inferior);
                    ol2[j].command = this.include(ol2[j].command, ol[i].command, !inferior);
                }
            }
        }
    }

    Transformer.prototype.include = function(c1, c2, inferior){
        var transformer;
        for(var i = 0; i < this.transformers.length; i++){
            var transformer = this.transformers[i];
            if(transformer.canInclude(c1, c2)){
                return transformer.include(c1, c2, inferior);
            }
        }

        throw new Error("TransformationUndefinedException");
    }

    return Transformer;
});