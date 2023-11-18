(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(["./client"], function (CoCreateOpenAi) {
            return factory(CoCreateOpenAi)
        });
    } else if (typeof module === 'object' && module.exports) {
        const CoCreateOpenAi = require("./server.js")
        module.exports = factory(CoCreateOpenAi);
    } else {
        root.returnExports = factory(root["./client.js"]);
    }
}(typeof self !== 'undefined' ? self : this, function (CoCreateOpenAi) {
    return CoCreateOpenAi;
}));