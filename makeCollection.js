/*jslint es6, browser */
/*globals util, window */
/**
 *  collection
 *
 *  A collection is generic encapsulation of an array.
 *
 *  When creating the collection, an initial array can be passed to the
 *  constructor function to populate the collection.
 *
 *      var collection = makeCollection([1, 2, 3]);
 *      collection.toArray(); // -> [1, 2, 3]
 *
 **/
function makeCollection(initial) {

    'use strict';

    var collection = {};
    var items = [];

    // Simple helper for getting the index of an item from within the items
    // array.
    function getIndex(item) {
        return items.indexOf(item);
    }

    /**
     *  collection.contains(item) -> Boolean.
     *  - item (?): Item to check.
     *
     *  Checks to see if the given `item` is in the collection, returning `true`
     *  if the item is.
     *
     *      var collection = makeCollection([1, 2, 3]);
     *      collection.contains(2); // -> true
     *      collection.contains(4); // -> false
     *
     **/
    function contains(item) {
        return getIndex(item) > -1;
    }

    /**
     *  collection.addItem(item) -> collection
     *  - item (?): Item to add.
     *
     *  Adds an item to the collection. The collection instance is returned so
     *  that this method can be chained.
     *
     *      var collection = makeCollection();
     *      collection.toArray(); // -> []
     *      collection.addItem(1).addItem(2).addItem(3);
     *      collection.toArray(); // -> [1, 2, 3]
     *
     *  The method will only add items to the collection if the `item` is not
     *  already in the collection.
     *
     *      collection.toArray(); // -> [1, 2, 3]
     *      collection.addItem(4).addItem(1);
     *      collection.toArray(); // -> [1, 2, 3, 4]
     *
     **/
    function addItem(item) {

        if (!contains(item)) {
            items.push(item);
        }

        return collection;

    }

    /**
     *  collection.removeItem(item) -> Boolean
     *  - item (?): Item to remove.
     *
     *  Removes an item from the collection. The method returns `true` if the
     *  `item` was successfully removed and `false` if it was not (which is to
     *  say, the `item` was not part of the collection so could not be removed).
     *
     *      var collection = makeCollection([1, 2, 3]);
     *      collection.toArray(); // -> [1, 2, 3]
     *      collection.removeItem(2); // -> true
     *      collection.toArray(); // -> [1, 3]
     *      collection.removeItem(4); // -> false
     *      collection.toArray(); // -> [1, 3]
     *
     **/
    function removeItem(item) {

        var index = getIndex(item);
        var exists = index > -1;

        if (exists) {
            items.splice(index, 1);
        }

        return exists;

    }

    // Checks to see if the `index` exists in the `items` array.
    function itemExists(index) {

        index = util.Number.toPosInt(index);

        return index >= 0 && index < items.length;

    }

    /**
     *  collection.getItem(index) -> ?|undefined
     *  - index (Number): Index of the item to retrieve.
     *
     *  Gets the item in the collection at the given `index`. If the `index` is
     *  not numeric or there is no data, `undefined` is returned.
     *
     *      var collection = makeCollection([1, 2, 3]);
     *      collection.toArray(); // -> [1, 2, 3]
     *      collection.getItem(2); // -> 3
     *      collection.getItem('2'); // -> 3
     *      collection.getItem('two'); // -> undefined
     *      collection.getItem(10); // -> undefined
     *
     **/
    function getItem(index) {

        return itemExists(index)
            ? items[index]
            : undefined;

    }

    /**
     *  collection.toArray() -> Array
     *
     *  Returns a copy of the collection as an array. Modifying the resulting
     *  array should not affect the collection, but this cannot be guaranteed.
     *
     *      var collection = makeCollection();
     *      collection.addItem(1).addItem(2).addItem(3);
     *      collection.toArray(); // -> [1, 2, 3]
     *
     **/
    function toArray() {
        return util.Object.clone(items);
    }

    /**
     *  collection.getSize() -> Number
     *
     *  Returns the size of the collection.
     *
     *      var collection = makeCollection([1, 2, 3]);
     *      collection.toArray(); // -> [1, 2, 3]
     *      collection.getSize(); // -> 3
     *
     **/
    function getSize() {
        return items.length;
    }

    /**
     *  collection.each(handler[, context])
     *  - handler (Function): Function to execute on each collection item.
     *  - context (?): Optional context for the `handler`.
     *
     *  Executes the `handler` on each item in the collection.
     *
     *      var collection = makeCollection([1, 2, 3]);
     *      collection.toArray(); // -> [1, 2, 3]
     *      collection.forEach(function (item) {
     *          console.log(item);
     *      });
     *      // -> logs 1 then 2 then 3
     *
     *  If the `handler` returns `false`, the execution is stopped.
     *
     *      collection.forEach(function (item) {
     *          console.log(item);
     *          return item === 2;
     *      });
     *      // -> logs 1 then 2
     *
     **/
    function each(handler, context) {

        items.some(function (item, i) {
            return handler.call(context, item, i) === false;
        });

    }

    /**
     *  collection.@@iterator([index]) -> Object
     *  - index (Number): Optional starting index.
     *
     *  Returns an iterator object so that the collection can be used with a
     *  `for ... of` loop. If the browser does not understand `for ... of` then
     *  this method will not exist.
     *
     *      var collection = makeCollection([1, 2, 3]);
     *      for (var item of collection) {
     *          console.log(item);
     *      }
     *      // -> logs 1 then 2 then 3
     *
     **/
    if (window.Symbol) {

        collection[Symbol.iterator] = function (index) {

            index = util.Number.toPosInt(index) || 0;

            function next() {

                return index < items.length
                    ? {value: items[index]}
                    : {done: true};

            }

            return {
                next
            };

        };

    }

    util.Object.assign(collection, {
        contains,
        addItem,
        removeItem,
        getItem,
        toArray,
        getSize,
        each
    });

    if (util.Array.isArrayLike(initial)) {
        util.Array.forEach(initial, addItem);
    }

    return collection;

}
