const OpenAI = require('openai')

const name = 'openai'

async function send(data) {
    let openai = false;

    try {
        // let organization = await this.organizations[data.organization_id]
        // if (!organization) {
        if (data.chat.apiKey) {
            openai = new OpenAI({ apiKey: data.chat.apiKey });
        } else {
            let apiKey = data.apis
            openai = new OpenAI({ apiKey });
        }
        // }

        // let response
        switch (data.method) {
            case 'chat':
            case 'chat.completions':
            case 'chat.completions.create':
            case 'openai.chat':
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