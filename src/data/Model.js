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
                    if (!_.isArray(target)) throw new Error('TypeException');
                    target.splice(command.offset, 0, command.data);
                } else if (command instanceof Delete) {
                    if (!_.isArray(target)) throw new Error('TypeException');
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
