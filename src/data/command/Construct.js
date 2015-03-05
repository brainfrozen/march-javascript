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