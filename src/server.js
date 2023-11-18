import OpenAI from "openai";

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
            this.wsManager.on('openAi', (data) => this.send(data));
        }
    }

    async send(data) {
        try {
            let organization = this.organizations[data.organization_id]
            if (!organization) {
                organization = { apikey: await this.getApiKey(organization_id, this.name) }
                organization.instance = new OpenAI(organization.apikey);
            }

            const openai = organization.instance
            const completion = await openai.chat.completions.create({
                messages: [{ role: "system", content: "You are a helpful assistant." }],
                model: "gpt-3.5-turbo",
            });
            data.completion = completion
            console.log(completion.choices[0]);
            // messages: data.messages,
            //     max_tokens: data.maxtokens,
            //         temperature: data.temperature,
            //             n,
            //             stop,
            //             model

            if (data.socket) {
                let socket = data.socket
                delete data.socket
                socket.send(JSON.stringify(data))
            } else
                return data
        } catch (error) {
            console.error('OpenAi Error:', error);
        }
    }

    async getApiKey(organization_id, name) {
        if (this.organizations[organization_id]) {
            return await this.organizations[organization_id]
        } else {
            this.organizations[organization_id] = this.getOrganization(organization_id, name)
            this.organizations[organization_id] = await this.organizations[organization_id]
            return this.organizations[organization_id]
        }

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