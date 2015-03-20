/**
 * Created by dli on 06.03.2015.
 */
define('sync/transform/Inclusions', [
    'exports',

    'sync/transform/Inclusion',
    'data/command/Insert',
    'data/command/Delete',
    'data/command/Set',
    'data/command/Unset',
    'data/command/Construct',
    'data/command/Destruct',
    'data/command/NIL'

], function (exports, Inclusion, Insert, Delete, Set, Unset, Construct, Destruct, NIL) {

    var InsertInsert = exports.InsertInsert = Inclusion.extend({
        canInclude: function (c1, c2) {
            return c1 instanceof Insert && c2 instanceof Insert;
        },
        include: function (c1, c2, inferior) {
            if (c1.offset > c2.offset || (c1.offset === c2.offset && inferior)) {
                return new Insert({
                    offset: c1.offset + 1,
                    data: c1.data
                });
            }
            return c1;
        }
    });

    var InsertDelete = exports.InsertDelete = Inclusion.extend({
        canInclude: function (c1, c2) {
            return c1 instanceof Insert && c2 instanceof Delete;
        },
        include: function (c1, c2, inferior) {
            if (c1.offset > c2.offset) {
                return new Insert({
                    offset: c1.offset - 1,
                    data : c1.data
                });
            }

            return c1;
        }
    });

    var DeleteInsert = exports.DeleteInsert = Inclusion.extend({
        canInclude: function (c1, c2) {
            return c1 instanceof Delete && c2 instanceof Insert;
        },
        include: function (c1, c2, inferior) {
            if (c1.offset >= c2.offset) {
                return new Delete({
                    offset: c1.offset + 1
                });
            }

            return c1;
        }
    });

    var DeleteDelete = exports.DeleteDelete = Inclusion.extend({
        canInclude: function (c1, c2) {
            return x1 instanceof Delete && c2 instanceof Delete;
        },
        include: function (c1, c2, inferior) {
            if (c1.offset === c2.offset) {
                return NIL;
            } else if (c1.offset > c2.offset) {
                return new Delete({
                    offset: c1.offset - 1
                });
            }

            return c1;
        }
    });

    var SetSet = exports.SetSet = Inclusion.extend({
        canInclude: function (c1, c2) {
            return c1 instanceof Set && c2 instanceof Set;
        },
        include: function (c1, c2, inferior) {
            if ((c1.identifier === c2.identifier) && inferior) {
                return NIL
            }

            return c1;
        }
    });

    var SetUnset = exports.SetUnset = Inclusion.extend({
        canInclude: function (c1, c2) {
            return c1 instanceof Set && c2 instanceof Unset;
        },
        include: function (c1, c2, inferior) {
            return c1;
        }
    });

    var UnsetSet = exports.UnsetSet = Inclusion.extend({
        canInclude: function (c1, c2) {
            return c1 instanceof Unset && c2 instanceof Set;
        },
        include: function (c1, c2, inferior) {
            if (c1.identifier === c2.identifier) {
                return NIL;
            }

            return c1;
        }

    });

    var UnsetUnset = exports.UnsetUnset = Inclusion.extend({
        canInclude: function(c1, c2) {
            return c1 instanceof Unset && c2 instanceof Unset;
        },
        include: function(c1, c2, inferior) {
            if (c1.identifier === c2.identifier){
                return NIL;
            }

            return c1;
        }
    });

    var NilNil = exports.NilNil = Inclusion.extend({
        canInclude: function(c1, c2) {
            return c1 instanceof Nil || c2 instanceof Nil;
        },
        include: function(c1, c2, inferior) {
            return c1;
        }
    });

    exports.ALL = [
        new InsertInsert,
        new DeleteDelete,
        new DeleteInsert,
        new InsertDelete,
        new SetSet,
        new UnsetUnset,
        new SetUnset,
        new UnsetSet,
        new NilNil
    ];
});
