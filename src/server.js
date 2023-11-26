const OpenAI = require('openai')

class CoCreateOpenAi {
    constructor(crud) {
        this.name = "openAi"
        this.wsManager = crud.wsManager
        this.crud = crud
        this.organizations = {}
        this.init()
    }

    init() {
        if (this.wsManager) {
            this.wsManager.on(this.name, (data) => this.send(data));
            this.wsManager.on('openai.chat', (data) => this.send(data));
        }
    }

    async send(data) {
        try {
            let organization = await this.organizations[data.organization_id]
            if (!organization) {
                if (data.chat.apiKey) {
                    organization = new OpenAI({ apiKey: data.chat.apiKey });
                    this.organizations[data.organization_id] = organization
                } else {
                    let apiKey = await this.getApiKey(data.organization_id, this.name)
                    organization = new OpenAI({ apiKey });
                    this.organizations[data.organization_id] = organization
                }
            }

            const openai = organization
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

            if (data.socket) {
                let socket = data.socket
                delete data.socket
                socket.send(JSON.stringify(data))
            } else
                return data
        } catch (error) {
            console.error('OpenAi Error:', error);
            data.error = error.message
            let socket = data.socket
            delete data.socket
            socket.send(JSON.stringify(data))
        }
    }

    async getApiKey(organization_id, name) {
        this.organizations[organization_id] = this.getOrganization(organization_id, name)
        this.organizations[organization_id] = await this.organizations[organization_id]
        return this.organizations[organization_id]
    }

    async getOrganization(organization_id, name) {
        let organization = await this.crud.send({
            method: 'object.read',
            database: organization_id,
            array: 'organizations',
            object: [{ _id: organization_id }],
            organization_id
        })

        if (organization
            && organization.object
            && organization.object[0]) {
            if (organization.object[0].apis && organization.object[0].apis[name]) {
                return organization.object[0].apis && organization.object[0].apis[name]
            } else
                return { [this.name]: false, error: 'An apikey could not be found' }
        } else {
            return { serverOrganization: false, error: 'An organization could not be found' }
        }

    }


}

module.exports = CoCreateOpenAi;