var flux = require("../src/flux");
var sinon = require("sinon");

module.exports = {
    setUp: function(done) {
        flux.changeDispatcher(new flux.Dispatcher());
        done();
    },
    "simple test": function(test) {
        var store = sinon.spy();

        flux.getDispatcher().registerStore("test", store);
        flux.getDispatcher().dispatch("", {});

        test.ok(store.called);
        test.done();
    },
    "check if data and event are correct": function(test) {
        var store = sinon.spy();

        flux.getDispatcher().registerStore("test", store);

        var event = "test";
        var data = {data: "123"};
        flux.getDispatcher().dispatch(event, data);

        sinon.assert.calledWith(store, event, data);
        test.done();
    },
    "check if listeners are handled properly": function(test) {
        var event = "test-event";
        var data = {data: "123"};

        var store = sinon.spy(function(_event, _data, emitChanges) {
            emitChanges();
        });
        var handler = sinon.spy();
        flux.getDispatcher().registerStore("test", store);
        flux.getDispatcher().subscribeToStore("test", handler);

        flux.getDispatcher().dispatch(event, data);

        sinon.assert.calledWith(store, event, data);
        sinon.assert.calledWith(handler, store);
        test.done();
    },
    "first subscribe to store, then register": function(test) {
        var event = "test-event";
        var data = {data: "123"};

        var store = sinon.spy(function(_event, _data, emitChanges) {
            this.data = _data;

            emitChanges();
        });
        var handler = sinon.spy();
        flux.getDispatcher().subscribeToStore("test", handler);
        flux.getDispatcher().registerStore("test", store);

        flux.getDispatcher().dispatch(event, data);

        test.strictEqual(store.data, data);

        sinon.assert.calledWith(store, event, data);
        sinon.assert.calledWith(handler, store);
        test.done();
    },
    "use dispatch method of store object": function(test) {
        var event = "test-event";
        var data = {data: 123};

        function Store() {
            this.data = {};
        }
        Store.prototype.getData = function() {
            return this.data;
        };
        Store.prototype.dispatch = function(_event, _data, emitChanges) {
            this.data = _data;
            emitChanges();
        };

        var store = new Store();

        test.deepEqual(store.getData(), {});

        var dispatchSpy = sinon.spy(store, "dispatch");
        var handler = sinon.spy();

        flux.getDispatcher().registerStore("testStore", store);
        flux.getDispatcher().subscribeToStore("testStore", handler);

        flux.getDispatcher().dispatch(event, data);

        sinon.assert.calledWith(dispatchSpy, event, data);
        sinon.assert.calledWith(handler, store);

        test.ok(handler.calledAfter(dispatchSpy));

        sinon.assert.calledOnce(dispatchSpy);
        sinon.assert.calledOnce(handler);

        test.strictEqual(store.getData(), data);

        test.done();
    },
    "do not emit changes to store listeners": function(test) {
        var event = "test-event";
        var data = {data: "123"};

        var store = function(_event, _data, emitChanges) {
            emitChanges(false);
        };
        var handler = sinon.spy();
        flux.getDispatcher().registerStore("test", store);
        flux.getDispatcher().subscribeToStore("test", handler);

        flux.getDispatcher().dispatch(event, data);

        sinon.assert.callCount(handler, 0);
        test.done();
    }
};
