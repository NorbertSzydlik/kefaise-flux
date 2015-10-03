"use strict";
var flux = {};

(function() {
    function Dispatcher() {
        this.stores = {};
        this.eventListeners = {};
    }
    Dispatcher.prototype.registerStore = function(name, handler) {
        if(this.stores[name] == null) {
            this.stores[name] = handler;
        }
    };

    function emitChanges(store, storeName) {
        var listeners = this.eventListeners[storeName] || [];

        listeners.forEach(function(listener) {
            listener(store);
        });
    }
    Dispatcher.prototype.dispatch = function(type, data) {
        Object.keys(this.stores).forEach(function(storeName) {
            var store = this.stores[storeName];
            store.call(store, type, data, emitChanges.bind(this, store, storeName));
        }, this);
    };

    Dispatcher.prototype.subscribeToStore = function(storeName, handler) {
        this.eventListeners[storeName] = this.eventListeners[storeName] || [];
        this.eventListeners[storeName].push(handler);
    };
    Dispatcher.prototype.unsubscribeFromStore = function(storeName, handler) {
        this.eventListeners[storeName] = this.eventListeners[storeName] || [];
        this.eventListeners[storeName] = this.eventListeners[storeName].filter(function(listener) {
            return listener !== handler;
        });
    };


    flux.Dispatcher = Dispatcher;

    var dispatcher = new Dispatcher();
    flux.changeDispatcher = function(newDispatcher) {
        dispatcher = newDispatcher;
    };
    flux.getDispatcher = function() {
        return dispatcher;
    };

    if(module != null && module.exports != null) {
        module.exports = flux;
    }
})();

