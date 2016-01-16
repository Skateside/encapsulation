/*jslint es6, browser, this, multivar */
/*global util */
/**
 *  class Access
 *
 *  Variant of [[access]] that allows for inheritance. Magic `get`, `set`, `has`
 *  and `delete` methods are still available.
 **/
var Access = (function () {

    'use strict';

    var internalData = new WeakMap();

    var getData = function (instance) {

        if (!internalData.has(instance)) {
            internalData.set(instance, {});
        }

        return internalData.get(instance);

    };

    var decamelise = function (string) {
        return util.String.hyphenate(util.String.toLowerFirst(string), '_');
    };

    var InAccess = function (...args) {
        return this.init(...args);
    };

    InAccess.prototype = {

        /**
         *  new Access([initial])
         *  - initial (Object): Optional initial data.
         *
         *  Creates the access object. Initial data can optionally be set.
         *
         *      var access1 = new Access();
         *      access1.getSomething(); // -> undefined
         *      var access2 = new Access({something: true});
         *      access2.getSomething(); // -> true
         *
         **/
        init: function (initial) {

            if (util.Object.isObject(initial)) {
                this.addData(initial);
            }

        },

        /**
         *  Access#getData(key) -> ?
         *  - key (String): Data key.
         *
         *  Returns data from the private data or `undefined` if no data can be
         *  found.
         *
         *      var access = new Access({something: true});
         *      access.getData('something');      // -> true
         *      access.getData('something_else'); // -> undefined
         *
         **/
        getData: function (key) {
            return getData(this)[key];
        },

        /**
         *  Access#setData(key, value) -> Access
         *  - key (String): Data key.
         *  - value (?): Data value.
         *
         *  Sets internal data. The instance is returned so it can be chained.
         *
         *      var access = new Access();
         *      access.hasData('something');       // -> false
         *      access.setData('something', true); // -> access
         *      access.hasData('something');       // -> true
         *
         **/
        setData: function (key, value) {

            getData(this)[key] = value;

            return this;

        },

        /**
         *  Access#hasData(key) -> Boolean
         *  - key (String): Data key.
         *
         *  Checks to see if the given `key` has any associated data.
         *
         *      var access = new Access();
         *      access.setData('something', true);
         *      access.setData('something_else', undefined);
         *      access.hasData('something');         // -> true
         *      access.hasData('something_else');    // -> true
         *      access.hasData('a_third_something'); // -> false
         *
         **/
        hasData: function (key) {
            return util.Object.owns(getData(this), key);
        },

        /**
         *  Access#deleteData(key) -> Boolean
         *  - key (String): Data key.
         *
         *  Deletes data from the private data. Returns `true` if data was
         *  removed and `false` otherwise.
         *
         *      var access = new Access();
         *      access.setData('something', true);
         *      access.deleteData('something');      // -> true
         *      access.deleteData('something_else'); // -> false
         *
         **/
        deleteData: function (key) {

            var had = this.hasData(key);

            delete getData(this)[key];

            return had;

        },

        /**
         *  Access#addData(data)
         *  - data (Object): Data to add.
         *
         *  Adds data to the instance.
         *
         *      var access = new Access();
         *      access.addData({something: true, something_else: false});
         *      access.getData('something');      // -> true
         *      access.getData('something_else'); // -> false
         *
         **/
        addData: function (data) {

            Object.keys(data).forEach(function (key) {
                this.setData(key, data[key]);
            }, this);

        },

        /**
         *  Access#debug() -> Object
         *
         *  Returns a copy of the private data to aid debugging. Although it
         *  should be possible to modify the copy without affecting the actual
         *  private data, this cannot be guarenteed.
         *
         *      var access = new Access();
         *      access.setData('something', true);
         *      access.debug(); // -> {something: true}
         *
         **/
        debug: function () {
            return util.Object.clone(getData(this));
        }

    };

    InAccess.prototype = new Proxy(InAccess.prototype, {

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
                        return this.getData(property);
                    };

                    break;

                case 'set':

                    target[name] = function (val) {
                        return this.setData(property, val);
                    };

                    break;

                case 'has':

                    target[name] = function () {
                        return this.hasData(property);
                    };

                    break;

                case 'delete':

                    target[name] = function () {
                        return this.deleteData(property);
                    };

                    break;

                }

                value = target[name];

            }

            return value;

        }

    });

    return InAccess;

}());
