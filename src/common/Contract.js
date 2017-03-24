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
