/**
 * Created by dli on 22.02.2015.
 */
define('data/command/Insert', ['data/Command'], function (Command) {
    return Command.extend({
        declare: ['offset', 'data']
    });
});