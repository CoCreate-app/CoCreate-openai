import crud from '@cocreate/crud-client'
import Actions from '@cocreate/actions'
import { queryElements } from '@cocreate/utils';

const model = 'gpt-4-1106-preview'
const max_tokens = 3300;
const temperature = 0.6;
const n = 1;
const stop = '###STOP###';

const forms = new Map()

async function send(conversation, action) {
    try {
        let data = await crud.socket.send({
            method: 'openai.chat.completions.create',
            openai: {
                messages: conversation,
                max_tokens,
                temperature,
                n,
                stop,
                model
            }
        })

        if (data) {
            let content = data.openai.choices[0].message.content;

            let valueType = action.element.getAttribute('openai-value-type');
            content = parseContent(content, valueType)

            let elements = queryElements({ element: action.element, prefix: 'openai' });

            let type = action.element.getAttribute('openai-type');
            if (type === 'form') {
                if (typeof content !== "object")
                    return
                for (let form of elements) {
                    const inputs = form.querySelectorAll('[name], [key]');
                    inputs.forEach(element => {
                        const key = element.getAttribute('key') || element.getAttribute('name');
                        if (content[key]) {
                            element.setValue(content[key]);
                        }
                    });
                }
            } else {
                for (let element of elements) {
                    element.setValue(content)
                }
            }
        }

        // ToDo: handle objects that contain method or set a type for method
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

function parseContent(content, valueType) {
    let regex;

    // Define the regular expression based on the valueType
    switch (valueType) {
        case 'json':
            regex = /```json\n([\s\S]*?)\n```/;
            break;
        case 'javascript':
            regex = /```javascript\n([\s\S]*?)\n```/;
            break;
        case 'html':
            regex = /```html\n([\s\S]*?)\n```/;
            break;
        case 'css':
            regex = /```css\n([\s\S]*?)\n```/;
            break;
        default:
            break;
    }

    // Extract the relevant section using the regular expression
    if (regex) {
        const match = content.match(regex);
        if (match && match[1]) {
            content = match[1].trim();  // Extracted content between the code block markers
        }
    }

    if (valueType === 'json') {
        content = JSON.parse(content);
    }

    return content;
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

async function openaiAction(action) {
    let form = action.form
    if (!form)
        return

    let elements = form.querySelectorAll('[openai]')

    let conversation = forms.get(form)
    if (!conversation)
        forms.set(form, conversation = [])

    // 3 types avialable system, user, assistant
    for (let element of elements) {
        let role = element.getAttribute('openai')
        if (!['system', 'user', 'assistant'].includes(role))
            continue
        let content = await element.getValue()
        if (!content)
            continue

        let valueType = element.getAttribute('openai-value-type')
        let keyName = element.getAttribute('key') || element.getAttribute('name')
        if (valueType === 'json' || valueType === 'object') {
            content = JSON.stringify({ [keyName]: content })
        }

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
        send(conversation, action);
}

export default { send }

Actions.init({
    name: "openAi",
    endEvent: "openAi",
    callback: (action) => {
        openaiAction(action);
    }
})