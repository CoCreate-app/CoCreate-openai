const apiKey = 'YOUR_API_KEY';
const responeFormat = {
    "component": "<component>",
    "action": "<component.action>",
    "data": "<component.data>"
}

const componentsActionReference = {
    "crud": {
        "actions": ["createDatabase", "readDatabase", "updateDatabase", "deleteDatabase", "createCollection", "readCollection", "updateCollection", "deleteCollection", "createIndex", "readIndex", "updateIndex", "deleteIndex", "createDocument", "readDocument", "updateDocument", "deleteDocument"],
        "data": { database, array, index, document, filter }
    },
    "socket": {
        "actions": ["send", "listen"]
    }
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


