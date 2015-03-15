/**
 * Created by dli on 22.02.2015.
 */
define('data/command/Nil', ['data/Command'], function (Command) {
    return Command.extend();
});

define('data/command/nil', ['data/command/Nil'], function (Nil) {
    return new Nil();
});