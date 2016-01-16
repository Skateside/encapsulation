/*jslint es6, multivar, browser */
/*global window */
/**
 *  util
 *
 *  Utility functions.
 **/
var util = (function () {

    'use strict';

    var utilities = {

        /**
         *  util.Array
         *
         *  Functions for manipulating Arrays
         **/
        Array: {},

        /**
         *  util.Function
         *
         *  Functions for manipulating Functions
         **/
        Function: {},

        /**
         *  util.Number
         *
         *  Functions.for manipulating Numbers.
         **/
        Number: {},

        /**
         *  util.Object
         *
         *  Functions for manipulating Objects.
         **/
        Object: {},

        /**
         *  util.RegExp
         *
         *  Functions for manipulating Regular expressions.
         **/
        RegExp: {},

        /**
         *  util.String
         *
         *  Functions for manipulating Strings.
         **/
        String: {}

    };

    /**
     *  util.Object.assign(source, ...objects) -> Object
     *  - source (Object): Object to extend.
     *  - ...objects (Object): Objects to exetend with.
     *
     *  Extends the `source` object with the other `objects`. Just a basic
     *  fallback for the native `Object.assign`.
     **/
    var assign = Object.assign || function (source, ...objects) {

        objects.forEach(function (object) {

            Object.keys(object).forEach(function (key) {
                source[key] = object[key];
            });

        });

        return source;

    };

    /**
     *  util.Object.getClass(object) -> String
     *  - object (?): Object whose class should be returned.
     *
     *  Returns the class of the object as defined in the ECMAScript specs.
     *
     *      util.Object.getClass({}); // -> "Object"
     *      util.Object.getClass([]); // -> "Array"
     *      util.Object.getClass(''); // -> "String"
     *      util.Object.getClass();   // -> "Undefined"
     *
     **/
    var getClass = function (object) {

        var string = Object.prototype.toString.call(object);

        return string.slice(8, -1);

    };

    /**
     *  util.Function.identity(x) -> ?
     *  - x (?): Object to return.
     *
     *  Returns an object without modifying it. This exists mainly as a
     *  fallback.
     **/
    var identity = function (x) {
        return x;
    };

    /**
     *  util.Function.isFunction(func) -> Boolean
     *  - func (Function): Function to test.
     *
     *  Checks to see if the given `func` is a function.
     **/
    var isFunction = function (func) {
        return typeof func === 'function' && getClass(func) === 'Function';
    };

    /**
     *  util.Object.owns(object, property) -> Boolean
     *  - object (Object): Object to test.
     *  - property (String): Property to check.
     *
     *  Tests whether an object has the given property.
     **/
    var owns = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    };

    /**
     *  util.Object.isPlainObject(object) -> Boolean
     *  - object (?): Object to test.
     *
     *  Test to see whether or not the given `object` is a plain object.
     *
     *      util.Object.isPlainObject({});            // -> true
     *      util.Object.isPlainObject([]);            // -> false
     *      util.Object.isPlainObject(null);          // -> false
     *      util.Object.isPlainObject(document.body); // -> false
     *      util.Object.isPlainObject(window);        // -> false
     *
     **/
    var isPlainObject = function (object) {

        var isPlain = object !== null && typeof object === 'object' &&
                object !== window && !object.nodeType;

        if (isPlain) {

            try {

                if (!object.constructor ||
                        !owns(object.constructor.prototype, 'isPrototypeOf')) {
                    isPlain = false;
                }

            } catch (ignore) {
            }

        }

        return isPlain;

    };

    /**
     *  util.Array.forEach(array, handler[, context])
     *  - array (Array): Array or array-like object.
     *  - handler (Function): Handler to execute on each array item.
     *  - context (?): Optional context for the `handler`.
     *
     *  Executes the given `handler` for each item of the array.
     *
     *      util.Array.forEach([1, 2, 3], function (number) {
     *          console.log(number);
     *      });
     *      // logs 1 then 2 then 3.
     *
     *  This works on array-like objects as well as arrays.
     *
     *      util.Array.forEach('123', function (number) {
     *          console.log(number);
     *      });
     *      // logs "1" then "2" then "3".
     *
     **/
    var arrayForEach = Array.forEach || function (array, handler, context) {
        return Array.prototype.forEach.call(array, handler, context);
    };

    /**
     *  util.Array.from(object) -> Array
     *  - object (?): Object to convert.
     *
     *  Converts the given object into an array.
     *
     *      var divs = document.querySelectorAll('div');
     *      // -> NodeList[<div id="one">, <div id="two">, <div id="three">]
     *      util.Array.from(divs);
     *      // -> Array[<div id="one">, <div id="two">, <div id="three">]
     *
     *  Optionally, a `map` may be provided to convert the original object.
     *
     *      util.Array.from(divs, function (div) {
     *          return div.id;
     *      });
     *      // -> Array['one', 'two', 'three']
     *
     **/
    var arrayFrom = Array.from || function (array, map, context) {

        if (!isFunction(map)) {
            map = identity;
        }

        return Array.prototype.map.call(array, map, context);

    };

    /**
     *  util.RegExp.escape(string) -> String
     *  - string (String): String to escape.
     *
     *  Escapes a string so it can be used in a `RegExp` constructor.
     *
     *      util.RegExp.escape('-'); // -> "\\-"
     *
     **/
    var escapeRegExp = function (string) {

        string = String(string);

        return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');

    };

    /**
     *  util.Number.isNumeric(number) -> Boolean
     *  - number (?): Number to test.
     *
     *  Tests to see if the given number is numberic. This is not necessarily
     *  the same as testing whether or not the given `number` is a number.
     *
     *      util.Number.isNumeric(10);       // -> true
     *      util.Number.isNumeric('10');     // -> true
     *      util.Number.isNumeric(10,1);     // -> true
     *      util.Number.isNumeric(util);     // -> false
     *      util.Number.isNumeric(NaN);      // -> false
     *      util.Number.isNumeric(Infinity); // -> false
     *
     **/
    var isNumeric = function (number) {
        return !isNaN(parseFloat(number)) && isFinite(number);
    };

    /**
     *  util.Array.isArrayLike(object) -> Boolean
     *  - object (?): Object to test.
     *
     *  Tests to see if the given object is array-like.
     *
     *      util.Array.isArrayLike([]);                             // -> true
     *      util.Array.isArrayLike('');                             // -> true
     *      util.Array.isArrayLike(0);                              // -> false
     *      util.Array.isArrayLike({});                             // -> false
     *      util.Array.isArrayLike({length: 0});                    // -> true
     *      util.Array.isArrayLike(document.querySelector('*'));    // -> false
     *      util.Array.isArrayLike(document.querySelectorAll('*')); // -> true
     *
     **/
    var isArrayLike = function (object) {

        return object !== undefined && object !== null &&
                isNumeric(object.length);

    };

    /**
     *  util.Number.sum(...numbers) -> Number
     *  - numbers (Number): Numbers to add together.
     *
     *  Adds the numbers in the arguments and returns the sum.
     *
     *      util.Number.sum(1, 2, 3); // -> 6
     *      util.Number.sum(); // -> 0
     *
     **/
    var sum = function (...numbers) {

        return numbers.reduce(function (prev, curr) {
            return prev + (+curr);
        }, 0);

    };

    /**
     *  util.Number.toPosInt(number) -> Number
     *  - number (Number): Number to convert.
     *
     *  Converts the given number into a positive integer.
     *
     *      util.Number.toPosInt(10);   // -> 10
     *      util.Number.toPosInt(-10);  // -> 10
     *      util.Number.toPosInt('10'); // -> 10
     *      util.Number.toPosInt(10.7); // -> 10
     *
     **/
    var toPosInt = function (number) {
        return Math.floor(Math.abs(number));
    };

    /**
     *  util.Number.average(...numbers) -> Number
     *  - numbers (Number): Numbers whose average should be returned.
     *
     *  Returns the average of all the given numbers.
     *
     *      util.Number.average(1, 2, 3); // -> 2
     *      util.Number.average(15, 5, 10); // -> 10
     *
     *  If no arguments are given, `0` is returned.
     *
     *      util.Number.average(); // -> 0
     *
     **/
    function average(...numbers) {

        return numbers.length
            ? sum(...numbers) / numbers.length
            : 0;

    }

    /**
     *  util.String.camlise(string, hyphens = '-_') -> String
     *  - string (String): String to convert.
     *  - hyphens (String): Hyphens
     *
     *  Converts a hyphenated string into a camelCase one.
     *
     *      util.String.camelise('font-family'); // -> "fontFamily"
     *
     *  A hyphenated string is considered to be one that has words separated by
     *  a hyphen (`-`) or an underscore (`_`).
     *
     *      util.String.camelise('font_family'); // -> "fontFamily"
     *
     *  The hyphens can be defined by passing them in as string. These will
     *  replace the default hyphens.
     *
     *      util.String.camelise('font+family', '+'); // -> "fontFamily"
     *
     **/
    function camlise(string, hyphens) {

        var str = String(string),
            chars = typeof hyphens === 'string'
                ? hyphens
                : '-_',
            breaker = new RegExp('[' + escapeRegExp(chars) + ']([a-z])', 'gi');

        return str.replace(breaker, function (ignore, start) {
            return start.toUpperCase();
        });

    }

    /**
     *  util.Array.chunk(array, size[, map[, context]]) -> Array
     *  - array (Array): Array to group.
     *  - size (Number): Maximum size of the groups.
     *  - map (Function): Optional conversion for the groups.
     *  - context (?): Optional context for the optional map.
     *
     *  Divides an array into groups of `size` length or smaller.
     *
     *      util.Array.chunk([1, 2, 3, 4, 5], 3); // -> [[1, 2, 3], [4, 5]]
     *
     *  The method works on array-like objects as well as arrays.
     *
     *      util.Array.chunk('12345', 3); // -> [['1', '2', '3'], ['4', '5']]
     *
     *  An optional map can be passed to convert the array items before they're
     *  put into groups.
     *
     *      util.Array.chunk('12345', 3, util.Number.toPosInt);
     *      // -> [[1, 2, 3], [4, 5]]
     *
     **/
    function chunk(array, size, map, context) {

        var chunked = [],
            arr = arrayFrom(array, map, context),
            i = 0,
            il = arr.length,
            amount = toPosInt(size) || 1;

        while (i < il) {

            chunked.push(arr.slice(i, i + amount));
            i += amount;

        }

        return chunked;

    }

    /**
     *  util.Object.clone(object) -> Object
     *  - object (Object): Object to clone.
     *
     *  Creates a clone of an object such that modifying the close should not
     *  modify the original. Some attempts are made to clone deeply.
     **/
    function clone(source) {

        var copy = {};

        Object.getOwnPropertyNames(source).forEach(function (property) {

            var orig = source[property],
                desc = Object.getOwnPropertyDescriptor(source, property),
                value = (isArrayLike(orig) || isPlainObject(orig))
                    ? clone(orig)
                    : orig;

            Object.defineProperty(copy, property, assign(desc, {value}));

        });

        return isArrayLike(source)
            ? arrayFrom(copy)
            : copy;

    }

    /**
     *  util.String.hyphenate(str[, hyphen = "-"]) -> String
     *  - str (String): String to hyphenate.
     *  - hyphen (String): Hyphen character.
     *
     *  Converts a camelCase string into a hyphenated one.
     *
     *      util.String.hyphenate('fontFamily'); // -> "font-family"
     *
     *  The hyphen character can be defined to allow for a different
     *  substitution. If ommitted, or a string is not provided, a hyphen (`-`)
     *  is assumed.
     *
     *      util.String.hyphenate('fontFamily', '=');   // -> "font=family"
     *      util.String.hyphenate('fontFamily', 4);     // -> "font-family"
     *      util.String.hyphenate('fontFamily', '---'); // -> "font---family"
     *
     **/
    function hyphenate(str, hyphen) {

        if (typeof hyphen !== 'string') {
            hyphen = '-';
        }

        return str.replace(/([a-z])([A-Z])/g, function (ignore, lower, upper) {
            return lower + hyphen + upper.toLowerCase();
        });

    }

    /**
     *  util.String.toLowerFirst(str) -> String
     *  - str (String): String to convert.
     *
     *  Converts a string so that the first character is lower case.
     *
     *      util.String.toLowerFirst('Abc'); // -> "abc"
     *      util.String.toLowerFirst('abc'); // -> "abc"
     *      util.String.toLowerFirst('ABC'); // -> "aBC"
     *
     **/
    function toLowerFirst(str) {

        var string = String(str);

        return string.charAt(0).toLowerCase() + string.slice(1);

    }

    /**
     *  util.String.toUpperFirst(str) -> String
     *  - str (String): String to convert.
     *
     *  Converts a string so that the first character is upper case.
     *
     *      util.String.toUpperFirst('Abc'); // -> "Abc"
     *      util.String.toUpperFirst('abc'); // -> "Abc"
     *      util.String.toUpperFirst('ABC'); // -> "ABC"
     *
     **/
    function toUpperFirst(str) {

        var string = String(str);

        return string.charAt(0).toUpperCase() + string.slice(1);

    }

    assign(utilities.Array, {
        chunk,
        forEach: arrayForEach,
        from: arrayFrom,
        isArrayLike
    });

    assign(utilities.Function, {
        identity,
        isFunction
    });

    assign(utilities.Number, {
        average,
        isNumeric,
        sum,
        toPosInt
    });

    assign(utilities.Object, {
        assign,
        clone,
        getClass,
        isPlainObject,
        owns
    });

    assign(utilities.RegExp, {
        escape: escapeRegExp
    });

    assign(utilities.String, {
        camlise,
        hyphenate,
        toLowerFirst,
        toUpperFirst
    });

    return utilities;

}());
