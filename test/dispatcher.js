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

        var store = function(_event, _data, emitChanges) {
            test.strictEqual(_event, event);
            test.strictEqual(_data, data);
            emitChanges();
        };
        var handler = sinon.spy();
        flux.getDispatcher().registerStore("test", store);
        flux.getDispatcher().subscribeToStore("test", handler);

        flux.getDispatcher().dispatch(event, data);

        sinon.assert.calledWith(handler, store);
        test.done();
    },
    "first subscribe to store, then register": function(test) {
        var event = "test-event";
        var data = {data: "123"};

        var store = function(_event, _data, emitChanges) {
            test.strictEqual(_event, event);
            test.strictEqual(_data, data);
            emitChanges();
        };
        var handler = sinon.spy();
        flux.getDispatcher().subscribeToStore("test", handler);
        flux.getDispatcher().registerStore("test", store);

        flux.getDispatcher().dispatch(event, data);

        sinon.assert.calledWith(handler, store);
        test.done();
    }
};
