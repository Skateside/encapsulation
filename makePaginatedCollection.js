/*jslint es6, browser */
/*globals util, makeCollection, window */
/**
 *  paginatedCollection
 *
 *  A [[collection]] with added functionality for pagination. This object
 *  inherits from [[collection]] so any method that is not mentioned here but
 *  is mentioned in [[collection]] will still exist.
 **/
function makePaginatedCollection(initial) {

    'use strict';

    var collection = makeCollection(initial);
    var pages = [];
    var pageSize = 1;
    var currentPage = 0;

    // Groups the collection items into the pages.
    function createPages() {

        pages = util.Array.chunk(collection.getItems(), pageSize)
            .map(makeCollection);

    }

    /**
     *  paginatedCollection.addItem(item) -> paginatedCollection
     *  - item (?): Item to add.
     *
     *  Adds an item to the collection and updates the pages. If the item
     *  already exists, no action is taken. The instance is returned so that the
     *  method can be chained. See [[collection.addItem]] for more information.
     **/
    function addItem(item) {

        if (collection.contains(item)) {

            collection.addItem(item);
            createPages();

        }

        return collection;

    }

    /**
     *  paginatedCollection.removeItem(item) -> Boolean
     *  - item (?): Item to remove.
     *
     *  Removes an item from the collection and updates the pages. If the item
     *  was not part of the collection, no action is taken. The method returns
     *  `true` if the item was removed and `false` if it was not. See
     *  [[collection.removeItem]] for more information.
     **/
    function removeItem(item) {

        var removed = collection.removeItem(item);

        if (removed) {
            createPages();
        }

        return removed;

    }

    /**
     *  paginatedCollection.setPageSize(size)
     *  - size (Number): Size of the pages.
     *
     *  Sets the size of the pages and updates the pages to match the new size.
     *
     *      var paged = makePaginatedCollection([1, 2, 3, 4, 5]);
     *      paged.getCurrentPage(); // -> [1]
     *      paged.setPageSize(3);
     *      paged.getCurrentPage(); // -> [1, 2, 3]
     *
     **/
    function setPageSize(size) {

        pageSize = util.Number.toPosInt(size) || 1;
        createPages();

    }

    /**
     *  paginatedCollection.getPagesSize() -> Number
     *
     *  Returns the number of pages that the collection currently has.
     *
     *      var paged = makePaginatedCollection([1, 2, 3, 4, 5]);
     *      paged.getPagesSize(); // -> 5
     *      paged.setPageSize(3);
     *      paged.getPagesSize(); // -> 2
     *
     **/
    function getPagesSize() {
        return pages.length;
    }

    /**
     *  paginatedCollection.getCurrentPageIndex() -> Number
     *
     *  Returns the index of the current page.
     *
     *      var paged = makePaginatedCollection([1, 2, 3, 4, 5]);
     *      paged.setPageSize(3);
     *      paged.getCurrentPageIndex(); // -> 0
     *      paged.getNextPage(); // .toArray() -> [4, 5]
     *      paged.getCurrentPageIndex(); // -> 1
     *
     **/
    function getCurrentPageIndex() {
        return currentPage;
    }

    /**
     *  paginatedCollection.getCurrentPage() -> collection
     *
     *  Returns a [[collection]] representing the current page.
     *
     *      var paged = makePaginatedCollection([1, 2, 3, 4, 5]);
     *      paged.getCurrentPage(); // .toArray() -> [1]
     *
     **/
    function getCurrentPage() {
        return pages[currentPage];
    }

    /**
     *  paginatedCollection.getFirstPage() -> collection
     *
     *  Returns a [[collection]] representing the first page.
     *
     *      var paged = makePaginatedCollection([1, 2, 3, 4, 5]);
     *      paged.getFirstPage(); // -> .toArray() -> [1]
     *
     *  The internal pointer is set to the first page, so
     *  [[paginatedCollection.getCurrentPage]] will also return a collection
     *  representing the first page if immediately called afterwards.
     *
     *      paged.getCurrentPage(); // -> .toArray() -> [1]
     *
     **/
    function getFirstPage() {

        currentPage = 0;

        return pages[currentPage];

    }

    /**
     *  paginatedCollection.getLastPage() -> collection
     *
     *  Returns a [[collection]] representing the last page.
     *
     *      var paged = makePaginatedCollection([1, 2, 3, 4, 5]);
     *      paged.getLastPage(); // -> .toArray() -> [5]
     *
     *  The internal pointer is set to the last page, so
     *  [[paginatedCollection.getCurrentPage]] will also return a collection
     *  representing the last page if immediately called afterwards.
     *
     *      paged.getCurrentPage(); // -> .toArray() -> [5]
     *
     **/
    function getLastPage() {

        currentPage = pages.length - 1;

        return pages[currentPage];

    }

    /**
     *  paginatedCollection.getNextPage() -> collection|undefined
     *
     *  Returns a [[collection]] representing the next page.
     *
     *      var paged = makePaginatedCollection([1, 2, 3, 4, 5]);
     *      paged.getFirstPage(); // -> .toArray() -> [1]
     *      paged.getNextPage(); // -> .toArray() -> [2]
     *      paged.getNextPage(); // -> .toArray() -> [3]
     *
     *  If the internal pointer is already at the end, `undefined` is returned.
     *
     *      paged.getLastPage(); // -> .toArray() -> [5]
     *      paged.getNextPage(); // -> undefined
     *
     **/
    function getNextPage() {

        var index = currentPage + 1;

        if (index < getPagesSize()) {
            currentPage = index;
        }

        return pages[index];

    }

    /**
     *  paginatedCollection.getPreviousPage() -> collection|undefined
     *
     *  Returns a [[collection]] representing the previous page.
     *
     *      var paged = makePaginatedCollection([1, 2, 3, 4, 5]);
     *      paged.getLastPage(); // -> .toArray() -> [5]
     *      paged.getPreviousPage(); // -> .toArray() -> [4]
     *      paged.getPreviousPage(); // -> .toArray() -> [3]
     *
     *  If the internal pointer is already at the start, `undefined` is
     *  returned.
     *
     *      paged.getFirstPage(); // -> .toArray() -> [1]
     *      paged.getPreviousPage(); // -> undefined
     *
     **/
    function getPreviousPage() {

        var index = currentPage - 1;

        if (index >= 0) {
            currentPage = index;
        }

        return pages[index];

    }

    /**
     *  paginatedCollection.@@iterator([index]) -> Object
     *  - index (Number): Optional starting index.
     *
     *  Returns an iterator object so that the paginated collection can be used
     *  with a `for ... of` loop. If the browser does not understand
     *  `for ... of` then this method will not exist.
     *
     *      var collection = makePaginationCollection([1, 2, 3]);
     *      for (var item of collection) {
     *          console.log(item.toArray());
     *      }
     *      // -> logs [1] then [2] then [3]
     *
     **/
    if (window.Symbol) {

        collection[Symbol.iterator] = function (index) {

            index = +index || 0;

            function next() {

                return index < pages.length
                    ? {value: pages[index]}
                    : {done: true};

            }

            return {
                next
            };

        };

    }

    util.Object.assign(collection, {
        addItem,
        removeItem,
        setPageSize,
        getPagesSize,
        getCurrentPageIndex,
        getCurrentPage,
        getFirstPage,
        getLastPage,
        getNextPage,
        getPreviousPage
    });

    return collection;

}
