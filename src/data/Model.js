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

        var Model = function(){
            this._base = new Pointer();

            this._memory  = {};
            this._memory[this._base.address] = {};
        };

        Model.prototype.evaluate = function(pointer){
            var target;
            if(pointer){
                target = this._memory[pointer.address];
            } else {
                target = this._memory[this._base.address];
            }

            var commands = Array.prototype.slice.call(arguments, 1),
                command;

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

                if(typeof target !== 'undefined' && target != null) {
                    return target instanceof Array ? 'SEQUENCE' : 'HASH';
                }
            }
        }

        return Model;
    }
);


/*
 public void apply(Pointer pointer, Command... commands) throws ObjectException, CommandException;

 public Data find(Pointer pointer, String identifier) throws ObjectException, CommandException;

 public Data find(Pointer pointer, int index) throws ObjectException, CommandException;
 */