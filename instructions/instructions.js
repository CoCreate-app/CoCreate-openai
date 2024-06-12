const componentsReference = {
    "componentsReference": {
        "socket": {
            "functions": {
                "send": "<data>",
                "listen": "<method>"
            },
            "data": { 'broadcast': 'boolean', 'broadcast-sender': 'boolean', 'broadcast-browser': 'boolean' },
            "html-attributes": ['broadcast', 'broadcast-sender', 'broadcast-browser', 'namespace', 'room', 'balancer']
        },
        "crud": {
            "functions": {
                "send": "<data>",
                "listen": "<method>"
            },
            "methods": ["database.create", "database.read", "database.update", "database.delete", "array.create", "array.read", "array.update", "array.delete", "index.create", "index.read", "index.update", "index.delete", "object.create", "object.read", "object.update", "object.delete"],
            "data": { method: "", database: "", array: "", index: "", object: {} || [], filter: {} },
            "html-attributes": ['storage', 'database', 'array', 'object', 'key', 'index', 'save', 'read', 'update', 'delete', 'realtime', 'crud', 'upsert', 'value-type', 'value-prefix', 'value-suffix']
        },
        "filter": {
            "functions": {
                "getFilter": "<filter>",
                "setFilter": "<filter>"
            },
            "filter": { query: [{ key: "", value: "", operator: "$eq | $ne | $includes", logicalOperator: "", caseSensitive: "true | false" }], sort: [{ key: "", direction: "asc | desc" }], search: [{ value: "", operator: "", caseSensitive: "true | false" }] },
            "html-attributes": ['filter-selector', 'filter-closest', 'filter-parent', 'filter-prvious', 'filter-next', 'filter-key', 'filter-value', 'filter-value-type', 'filter-case-sensitive', 'filter-operator', 'filter-logical-opertor', 'filter-sort-key', 'filter-sort-direction', 'filter-search', 'filter-limit', 'filter-count', 'filter-on']
        },
        "crdt": {
            "functions": ["init", "getText", "updateText", "replaceText", "undoText", "redoText"],
            "data": { array: "", object: "_id", key: "", value: "", attribute: "bold | italic", start: 0, length: 0 },
            "html-attributes": ['crdt']
        },
        "cursors": {
            "functions": { sendPosition: "<data>" },
            "data": { array: [], object: "_id", key: "", start: 0, end: 0 },
            "html-attributes": ['cursors']
        },
        "events": {
            "functions": { init: "<data>" },
            "data": { prefix: "", events: [] },
            "predefined-prefixes": ['click', 'change', 'input', 'onload', 'observer', 'mousedown', 'mousemove', 'mouseup', 'toggle', 'hover', 'selected'],
            "html-attributes": ['<prefix>-selector', '<prefix>-selector', '<prefix>-closest', '<prefix>-parent', '<prefix>-previous', '<prefix>-next']
        },
        "state": {
            "html-attributes": ['state_to', 'state_id', 'state-<attribute>', 'state-overwrite']
        },
    }

};

if (!conversation) {
    const crudReference = {
        data: {
            method: "database.create | database.read | database.update | database.delete | array.create | array.read | array.update | array.delete | index.create | index.read | index.update | index.delete | object.create | object.read | object.update | object.delete",
            storage: "" || [""],
            database: "" || [""],
            array: "" || [""],
            index: "" || [""],
            object: {} || [{}],
            filter: {
                query: [{ key: "", value: "", operator: "$eq | $ne | $includes", logicalOperator: "", caseSensitive: "true | false" }],
                sort: [{ key: "", direction: "asc | desc" }],
                search: [{ value: "", operator: "", caseSensitive: "true | false" }]
            }
        }
    }
    const crudObjectReference = {
        data: {
            method: " object.create | object.read | object.update | object.delete",
            array: "" || [""],
            object: {} || [{}],
            filter: {
                query: [{ key: "", value: "", operator: "$eq | $ne | $includes", logicalOperator: "", caseSensitive: "true | false" }],
                sort: [{ key: "", direction: "asc | desc" }],
                search: [{ value: "", operator: "", caseSensitive: "true | false" }],
                limit: 0
            }
        }
    }

    const filterObjectReference = {
        data: {
            method: " object.create | object.read | object.update | object.delete",
            array: "files",
            object: [{
                "_id": "",
                "name": "",
                "src": "",
                "host": [
                    "*",
                ],
                "directory": "/",
                "path": "",
                "content-type": "",
                "public": "true"
            }]
        }
    }

    const htmlAttributesReference = {
        "socket-html-attributes": ['broadcast', 'broadcast-sender', 'broadcast-browser', 'namespace', 'room', 'balancer'],
        "crud-html-attributes": ['storage', 'database', 'array', 'object', 'key', 'index', 'save', 'read', 'update', 'delete', 'realtime', 'crud', 'upsert', 'value-type', 'value-prefix', 'value-suffix', 'listen'],
        "filter-html-attributes": ['filter-selector', 'filter-closest', 'filter-parent', 'filter-previous', 'filter-next', 'filter-key', 'filter-value', 'filter-value-type', 'filter-case-sensitive', 'filter-operator', 'filter-logical-opertor', 'filter-sort-key', 'filter-sort-direction', 'filter-search', 'filter-limit', 'filter-count', 'filter-on'],
        "render-html-attributes": ['render', 'render-selector', 'render-closest', 'render-parent', 'render-previous', 'render-next', 'render-as']
    }

    conversation = [
        { role: 'system', content: 'If the users request seem to want to perform a CRUD operation, return a CoCreateJS CRUD data object as a response. Else reply as best you can to users queries' },
        { role: 'system', content: 'data.method should default to "object.create", "object.read", "object.update", "object.delete"' },
        { role: 'system', content: 'To perform CRUD operations on the objects contained within an array, use the following methods: "object.create" for creating objects, "object.read" for reading and returning one or more objects, "object.update" for updating objects, and "object.delete" for deleting objects. The array property must be defined to perform crud operations on objects' },
        { role: 'system', content: 'data.storage and data.database is not required and should only be defined if the user specifically requests it. example: delete test database from indexeddb storage' },
        { role: 'system', content: 'In the context of CoCreateJS, an "array" corresponds to a "table" in SQL databases or a "collection" in NoSQL databases.' },
        { role: 'system', content: 'In the context of CoCreateJS, an "object" corresponds to a "row" in SQL databases or a "document" in NoSQL databases.' },
        { role: 'system', content: 'crud reference' + JSON.stringify(crudReference) },
        { role: 'system', content: 'crud object reference' + JSON.stringify(crudObjectReference) },
        { role: 'system', content: 'When using object.update or object.delete methods the data.object._id should be defined or a filter used to return and excute on matches' },
        { role: 'system', content: 'file object reference' + JSON.stringify(filterObjectReference) },
        { role: 'system', content: 'If the users request seem to want to create a file or code return the code/source in the data.object.src . This will make the file available over network request using the defined path' },
        { role: 'system', content: 'html attributes reference' + JSON.stringify(htmlAttributesReference) },
        { role: 'system', content: 'component reference' + JSON.stringify(componentsReference) },

    ]
}