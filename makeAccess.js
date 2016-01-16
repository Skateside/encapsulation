/*jslint es6, browser, multivar */
/*globals util */
/**
 *  access
 *
 *  Created by calling the `makeAccess` function.
 *
 *      var aces = makeAccess();
 *
 *  Initial data can be passed, see [[access.addData]].
 *
 *  [[access]] objects have some pre-set methods but their main strength comes
 *  from the ability to access internal data using `get*`, `set*`, `has*` and
 *  `delete*` methods.
 *
 *  For example:
 *
 *      access.hasThing();          // -> false
 *      access.getThing();          // -> undefined
 *      access.setThing('thing');   // -> access
 *      access.hasThing();          // -> true
 *      access.getThing();          // -> "thing"
 *      access.deleteThing();       // -> true
 *      access.hasThing();          // -> false
 *
 *  The internal data can be viewed using [[access.debug]], if needed.
 **/
function makeAccess(initial) {

    'use strict';

    var access = {},
        data = {};

    function decamelise(string) {
        return util.String.hyphenate(util.String.toLowerFirst(string), '_');
    }

    /**
     *  access.getData(name) -> ?
     *  - name (String): Data property to retrieve.
     **/
    function getData(name) {
        return data[name];
    }

    /**
     *  access.setData(name, value) -> access
     *  - name (String): Data property to set.
     *  - value (?): Value for the property.
     **/
    function setData(name, value) {

        data[name] = value;

        return access;

    }

    /**
     *  access.hasData(name) -> Boolean
     *  - name (String): Data property to check.
     **/
    function hasData(name) {
        return util.Object.owns(data, name);
    }

    /**
     *  access.deleteData(name) -> Boolean
     *  - name (String): Data property to delete.
     *
     *  Returns `true` if data was deleted and `false` otherwise.
     **/
    function deleteData(name) {

        var had = hasData(name);

        delete data[name];

        return had;

    }

    /**
     *  access.addData(additional)
     *  - additional (Object): Data to set.
     *
     *  These two statements are equivalent.
     *
     *      access.setData('one', 1).setData('two', 2);
     *      access.addData({one: 1, two: 2})
     *
     **/
    function addData(additional) {
        util.Object.assign(data, additional);
    }

    /**
     *  access.toObject() -> Object
     *
     *  Returns a copy of the internal data to aid debugging.
     **/
    function toObject() {
        return util.Object.clone(data);
    }

    util.Object.assign(access, {
        getData,
        setData,
        addData,
        hasData,
        deleteData,
        toObject
    });

    access = new Proxy(access, {

        get: function (target, name) {

            var value,
                rule = name.match(/(^([a-z]+)(\w+))/),
                property;

            if (util.Object.owns(target, name)) {
                value = target[name];
            } else if (rule && rule.length) {

                property = decamelise(rule[3]);

                switch (rule[2]) {

                case 'get':

                    target[name] = function () {
                        return target.getData(property);
                    };

                    break;

                case 'set':

                    target[name] = function (val) {
                        return target.setData(property, val);
                    };

                    break;

                case 'has':

                    target[name] = function () {
                        return target.hasData(property);
                    };

                    break;

                case 'delete':

                    target[name] = function () {
                        return target.deleteData(property);
                    };

                    break;

                }

                value = target[name];

            }

            return value;

        }

    });

    if (util.Object.isObject(initial)) {
        addData(initial);
    }

    return access;

}
