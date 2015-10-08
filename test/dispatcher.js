var flux = require("../src/flux");
var sinon = require("sinon");
var expect = require('chai').expect;

describe("Dispatcher", function(){
    it("should have dispatch function", function(){
        expect(flux.getDispatcher().dispatch).to.be.a("function");

        describe(".dispatch()", function(){
            beforeEach(function() {
                flux.changeDispatcher(new flux.Dispatcher());
            });

            it("should dispatch to stores", function(){
                var store = sinon.spy();

                flux.getDispatcher().registerStore("test", store);
                flux.getDispatcher().dispatch("", {});

                expect(store.called).to.equal(true);
            });
            it("should dispatch correct data to stores", function(){
                var store = sinon.spy();

                flux.getDispatcher().registerStore("test", store);

                var event = "test";
                var data = {data: "123"};
                flux.getDispatcher().dispatch(event, data);

                sinon.assert.calledWith(store, event, data);
            });
            it("should handle listeners properly", function(){
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
            });
            it("should be possible to subscribe to store, then register store", function(){
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

                expect(store.data).to.equal(data);

                sinon.assert.calledWith(store, event, data);
                sinon.assert.calledWith(handler, store);
            });
            it("should use .dispatch method of store object", function(){
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

                expect(store.getData()).to.deep.equal({});

                var dispatchSpy = sinon.spy(store, "dispatch");
                var handler = sinon.spy();

                flux.getDispatcher().registerStore("testStore", store);
                flux.getDispatcher().subscribeToStore("testStore", handler);

                flux.getDispatcher().dispatch(event, data);

                sinon.assert.calledWith(dispatchSpy, event, data);
                sinon.assert.calledWith(handler, store);

                expect(handler.calledAfter(dispatchSpy)).to.equal(true);

                sinon.assert.calledOnce(dispatchSpy);
                sinon.assert.calledOnce(handler);

                expect(store.getData()).to.equal(data);
            });
            it("should not emit changes to store listeners if store dispatch use emitChanges with 'false'", function() {
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
            });
        });
    });
});
