/**
 * Created by dli on 17.02.2015.
 */
define('sync/transform/Transformer', [
    'sync/transform/Inclusions'
], function (Inclusions) {
    var Transformer = function(transformers){
        this.transformers = transformers || Inclusions.ALL;
    }

    Transformer.prototype.transform = function(ol1, ol2, inferior) {
        var ol  = [];

        for(var i = 0; i < ol1.length; i++){
            ol[i] = ol1[i].slice(); // preserve a copy of the original

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