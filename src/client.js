import crud from '@cocreate/crud-client'
import Actions from '@cocreate/actions'

// todo: apikey from orgainization'
// const apifromCrud = await crud.send({
//     array: 'organizations',
//     object: { _id: '' },
// })

// console.log('test', apifromCrud)
const apiKey = localStorage.getItem('openAiKey');
const apiUrl = 'https://api.openai.com/v1/chat/completions';
const model = 'gpt-3.5-turbo'
const max_tokens = 3300;
const temperature = 0.6;
const n = 1;
const stop = '###STOP###';

const forms = new Map()

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

async function send(conversation) {
    try {

        let data = await crud.socket.send({
            method: 'openai.chat',
            chat: {
                messages: conversation,
                max_tokens,
                temperature,
                n,
                stop,
                model
            }
        })

        if (data) {
            const content = data.chat.choices[0].message.content;
            console.log(content)
            let responseElement = document.querySelector('[openai="response"]')
            if (responseElement)
                responseElement.setValue(content)
        }

        // const object = extractObjectFromCode(content);
        // if (object) {
        //     const { component, action, data } = object;
        //     if (CoCreate[component] && CoCreate[component][action]) {
        //         CoCreate[component][action](data);
        //     } else {
        //         console.error('Invalid CoCreateJS API function:', component, action);
        //     }
        // }
        document.dispatchEvent(new CustomEvent('openAi', {
            detail: {}
        }));

    } catch (error) {
        console.error('Error:', error);
    }

}

// Function to extract the object from the generated code
function extractObjectFromCode(code) {
    try {
        const regex = /({[\s\S]*?})/;
        const matches = code.match(regex);
        if (matches && matches.length === 1) {
            const object = JSON.parse(matches[0]);
            return object;
        }
        return null;
    } catch (error) {
        console.error('Error extracting object from code:', error);
        return null;
    }
}

async function openaiAction(form) {
    let elements = form.querySelectorAll('[openai]')

    let conversation = forms.get(form)
    // if (!conversation) {
    //     const crudReference = {
    //         data: {
    //             method: "database.create | database.read | database.update | database.delete | array.create | array.read | array.update | array.delete | index.create | index.read | index.update | index.delete | object.create | object.read | object.update | object.delete",
    //             storage: "" || [""],
    //             database: "" || [""],
    //             array: "" || [""],
    //             index: "" || [""],
    //             object: {} || [{}],
    //             filter: {
    //                 query: [{ key: "", value: "", operator: "$eq | $ne | $includes", logicalOperator: "", caseSensitive: "true | false" }],
    //                 sort: [{ key: "", direction: "asc | desc" }],
    //                 search: [{ value: "", operator: "", caseSensitive: "true | false" }]
    //             }
    //         }
    //     }
    //     const crudObjectReference = {
    //         data: {
    //             method: " object.create | object.read | object.update | object.delete",
    //             array: "" || [""],
    //             object: {} || [{}],
    //             filter: {
    //                 query: [{ key: "", value: "", operator: "$eq | $ne | $includes", logicalOperator: "", caseSensitive: "true | false" }],
    //                 sort: [{ key: "", direction: "asc | desc" }],
    //                 search: [{ value: "", operator: "", caseSensitive: "true | false" }],
    //                 limit: 0
    //             }
    //         }
    //     }

    //     const filterObjectReference = {
    //         data: {
    //             method: " object.create | object.read | object.update | object.delete",
    //             array: "files",
    //             object: [{
    //                 "_id": "",
    //                 "name": "",
    //                 "src": "",
    //                 "host": [
    //                     "*",
    //                 ],
    //                 "directory": "/",
    //                 "path": "",
    //                 "content-type": "",
    //                 "public": "true"
    //             }]
    //         }
    //     }

    //     const htmlAttributesReference = {
    //         "socket-html-attributes": ['broadcast', 'broadcast-sender', 'broadcast-browser', 'namespace', 'room', 'balancer'],
    //         "crud-html-attributes": ['storage', 'database', 'array', 'object', 'key', 'index', 'save', 'read', 'update', 'delete', 'realtime', 'crud', 'upsert', 'value-type', 'value-prefix', 'value-suffix', 'listen'],
    //         "filter-html-attributes": ['filter-selector', 'filter-closest', 'filter-parent', 'filter-previous', 'filter-next', 'filter-key', 'filter-value', 'filter-value-type', 'filter-case-sensitive', 'filter-operator', 'filter-logical-opertor', 'filter-sort-key', 'filter-sort-direction', 'filter-search', 'filter-limit', 'filter-count', 'filter-on'],
    //         "render-html-attributes": ['render', 'render-selector', 'render-closest', 'render-parent', 'render-previous', 'render-next', 'render-as']
    //     }

    //     conversation = [
    //         { role: 'system', content: 'If the users request seem to want to perform a CRUD operation, return a CoCreateJS CRUD data object as a response. Else reply as best you can to users queries' },
    //         { role: 'system', content: 'data.method should default to "object.create", "object.read", "object.update", "object.delete"' },
    //         { role: 'system', content: 'To perform CRUD operations on the objects contained within an array, use the following methods: "object.create" for creating objects, "object.read" for reading and returning one or more objects, "object.update" for updating objects, and "object.delete" for deleting objects. The array property must be defined to perform crud operations on objects' },
    //         { role: 'system', content: 'data.storage and data.database is not required and should only be defined if the user specifically requests it. example: delete test database from indexeddb storage' },
    //         { role: 'system', content: 'In the context of CoCreateJS, an "array" corresponds to a "table" in SQL databases or a "collection" in NoSQL databases.' },
    //         { role: 'system', content: 'In the context of CoCreateJS, an "object" corresponds to a "row" in SQL databases or a "document" in NoSQL databases.' },
    //         { role: 'system', content: 'crud reference' + JSON.stringify(crudReference) },
    //         { role: 'system', content: 'crud object reference' + JSON.stringify(crudObjectReference) },
    //         { role: 'system', content: 'When using object.update or object.delete methods the data.object._id should be defined or a filter used to return and excute on matches' },
    //         { role: 'system', content: 'file object reference' + JSON.stringify(filterObjectReference) },
    //         { role: 'system', content: 'If the users request seem to want to create a file or code return the code/source in the data.object.src . This will make the file available over network request using the defined path' },
    //         { role: 'system', content: 'html attributes reference' + JSON.stringify(htmlAttributesReference) },
    //         { role: 'system', content: 'component reference' + JSON.stringify(componentsReference) },

    //     ]
    if (!conversation)
        forms.set(form, conversation = [])
    // }

    // 3 types avialable system, user, assistant
    for (let element of elements) {
        let role = element.getAttribute('openai')
        if (!['system', 'user', 'assistant'].includes(role))
            continue
        let content = await element.getValue()
        if (typeof content === 'string')
            conversation.push({ role, content })
        // if (Array.isArray(content))
        //     conversation.push({ role, content })
        if (typeof content === 'object') {
            if (content.method) {
                let type = content.method.split('.')[0]
                for (let i = 0; i < content[type].length; i++) {
                    if (typeof content[type][i].content === 'string')
                        conversation.push({ role, content: content[type][i].content })
                    else
                        conversation.push({ role, content: JSON.stringify(content[type][i]) })
                }
            } else
                conversation.push({ role, content: JSON.stringify(content) })
        }

        // if (element.hasAttribute('crud')) {
        //     // let json = JSON.parse(element.getAttribute('crud'))
        //     // content = await crud.send()
        // } else {
        //     content = await element.getValue()
        // }

        // if (role === 'system' && !systemMessages.has(content)) {
        // systemMessages.set(content, true)

        // if (role === 'system') {
        //     conversation.push({ role, content })

        //     // if (content === 'componentsReference')
        //     //     conversation.push({ role, content: JSON.stringify(componentsReference) })
        //     // else
        //     //     conversation.push({ role, content })
        // } else if (role === 'user' && content) {
        //     conversation.push({ role, content })
        // } else if (role === 'message' && content)
        //     conversation.push({ role: 'user', content })
    }
    if (conversation.length)
        send(conversation);
}

export default { send }

Actions.init({
    name: "openAi",
    endEvent: "openAi",
    callback: (action) => {
        if (action.form)
            openaiAction(action.form);
    }
})