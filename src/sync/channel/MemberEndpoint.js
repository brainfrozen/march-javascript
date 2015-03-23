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
