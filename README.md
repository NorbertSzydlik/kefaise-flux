Lightweight implementation of flux pattern

1. Usage
========

1.1 Store as a handler function
-------------------------------

```javascript
var flux = require("kefaise-flux");

var eventName = "event"; //this can be Symbol in future

function simpleStore(type, data, emitChanges) {
    if(type === eventName) {
        this.data = data;
        emitChanges();
    }
}

flux.getDispatcher().registerStore("simpleStore", simpleStore);
flux.getDispatcher().subscribeToStore("simpleStore", handler);

flux.getDispatcher().dispatch(eventName, {data: "testData"});

function simpleStoreListener(store) {
    console.log(store.data); //should print {data: "testData"}
}
```

1.2 Store as an object
----------------------

```javascript
var flux = require("kefaise-flux");

var eventName = "event"; //this can be Symbol in future

function SimpleStore() {
    this.data = {};
}
SimpleStore.prototype.dispatch(type, data, emitChanges) {
    if(type === eventType) {
        this.data = data;
        emitChanges();
    }
}
SimpleStore.prototype.getData() {
    return this.data;
}

flux.getDispatcher().registerStore("simpleStore", new SimpleStore());
flux.getDispatcher().subscribeToStore("simpleStore", handler);

flux.getDispatcher().dispatch(eventName, {data: "testData"});


function simpleStoreListener(store) {
    console.log(store.getData()); ///should print {data: "testData"}
}
```
