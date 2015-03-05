/**
 * Created by dli on 22.02.2015.
 */
define('data/command/Set', ['data/Command'], function (Command) {
    return Command.extend({
        declare: ['identifier', 'data']
    });
});