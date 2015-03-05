/**
 * Created by dli on 22.02.2015.
 */
define('common/Contract', ['underscore'], function (_) {

    var Contract = function (attributes){
        if(attributes && _.isObject(attributes)) {
            _.defaults(this, attributes);
        }

        this.initialize.apply(this, arguments);
    }

    _.extend(Contract.prototype, {
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
                if (this[declare[i]] !== obj[declare[i]])
                    return false;
            }

            return true;
        },
        asPlainObject : function(){
            return _.pick(this, this.declare);
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
        if (protoProps && _.has(protoProps, 'constructor')) {
            child = protoProps.constructor;
        } else {
            child = function(){ return parent.apply(this, arguments); };
        }

        // Add static properties to the constructor function, if supplied.
        _.extend(child, parent, staticProps);

        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function.
        var Surrogate = function(){ this.constructor = child; };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;

        // Add prototype properties (instance properties) to the subclass,
        // if supplied.
        if (protoProps) _.extend(child.prototype, protoProps);

        // Set a convenience property in case the parent's prototype is needed
        // later.
        child.__super__ = parent.prototype;

        return child;
    };

    Contract.extend = extend;

    return Contract;
});
