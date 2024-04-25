const OpenAI = require('openai')

async function send(data) {
    let openai = false;

    try {
        if (data.chat.apiKey) {
            openai = new OpenAI({ apiKey: data.chat.apiKey });
        } else {
            let apiKey = data.apis
            openai = new OpenAI({ apiKey });
        }

        switch (data.method) {
            case 'chat.completions.create':
                delete data.chat.apiKey
                data.chat = await openai.chat.completions.create(data.chat);
                break;
        }

        return data
    } catch (error) {
        console.error('OpenAi Error:', error);
        data.error = error.message
        return data
    }
}

module.exports = { send };