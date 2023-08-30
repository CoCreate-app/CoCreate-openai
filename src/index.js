const apiKey = '';
const responeFormat = {
    "component": "<component>",
    "data": "<component.data>"
}

const componentsReference = {
    "socket": {
        "functions": {
            "send": data,
            "listen": method
        },
        "data": { 'broadcast': 'boolean', 'broadcast-sender': 'boolean', 'broadcast-browser': 'boolean' },
        "html-attributes": ['broadcast', 'broadcast-sender', 'broadcast-browser', 'namespace', 'room', 'balancer']
    },
    "crud": {
        "functions": {
            "send": data,
            "listen": method
        },
        "methods": ["create.database", "read.database", "update.database", "delete.database", "create.array", "read.array", "update.array", "delete.array", "create.index", "read.index", "update.index", "delete.index", "create.object", "read.object", "update.object", "delete.object"],
        "data": { method, database, array, index, object, filter },
        "html-attributes": ['storage', 'database', 'array', 'object', 'key', 'index', 'save', 'read', 'update', 'delete', 'realtime', 'crud', 'upsert', 'value-type', 'value-prefix', 'value-suffix']
    },
    "filter": {
        "functions": {
            "getFilter": filter,
            "setFilter": filter
        },
        "filter": { query: [{ key, value, operator, logicalOperator, caseSensitive }], sort: [{ key, direction }], search: [{ value, operator, caseSensitive }] },
        "html-attributes": ['filter-selector', 'filter-closest', 'filter-parent', 'filter-prvious', 'filter-next', 'filter-key', 'filter-value', 'filter-value-type', 'filter-case-sensitive', 'filter-operator', 'filter-logical-opertor', 'filter-sort-key', 'filter-sort-direction', 'filter-search', 'filter-limit', 'filter-count', 'filter-on']
    },
    "crdt": {
        "functions": { init, getText, updateText, replaceText, undoText, redoText },
        "data": { array, object, key, value, attribute, start, length },
        "html-attributes": ['crdt']
    },
    "cursors": {
        "functions": { sendPosition },
        "data": { array, object, key, start, end },
        "html-attributes": ['cursors']
    },
    "events": {
        "functions": { init },
        "data": { prefix, events: [] },
        "predefined-prefixes": ['click', 'change', 'input', 'onload', 'observer', 'mousedown', 'mousemove', 'mouseup', 'toggle', 'hover', 'selected'],
        "html-attributes": ['<prefix>-selector', '<prefix>-selector', '<prefix>-closest', '<prefix>-parent', '<prefix>-previous', '<prefix>-next']
    },
    "pass": {
        "html-attributes": ['pass_to', 'pass_id', 'pass-<attribute>', 'pass-refresh']
    },

};


const userPrompt = 'Create a new contact for Tim Henderson.';
const prompt = `${userPrompt}\n`;

const apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions';
const max_tokens = 100;
const temperature = 0.6;
const n = 1;
const stop = '\n';

const requestOptions = {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        prompt: prompt,
        max_tokens,
        temperature,
        n,
        stop
    }),
};

fetch(apiUrl, requestOptions)
    .then(response => response.json())
    .then(data => {
        const generatedCode = data.choices[0].text;
        // Extract and parse the generatedCode to retrieve the CoCreateJS API object
        const object = extractObjectFromCode(generatedCode);
        if (object) {
            // Extract the necessary values from the object
            const { component, action, data } = object;
            // Call the CoCreateJS API function dynamically
            if (CoCreate[component] && CoCreate[component][action]) {
                CoCreate[component][action](data);
            } else {
                console.error('Invalid CoCreateJS API function:', component, action);
            }
        } else {
            console.error('Unable to extract object from the response.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

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


