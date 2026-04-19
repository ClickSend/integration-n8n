import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ClickSendApi implements ICredentialType {
	name = 'clickSendApi';
	displayName = 'ClickSend API';
	icon: ICredentialType['icon'] = 'file:clickSend.svg';
	documentationUrl = 'https://developers.clicksend.com/docs/rest/v3/?shell#authentication';
	properties: INodeProperties[] = [
		{
			displayName: 'ClickSend Username',
			name: 'username',
			type: 'string',
			typeOptions: { password: false },
			default: '',
		},
		{
			displayName: 'ClickSend API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric ={

		type: 'generic',
		properties: {
			auth: {
				username:'={{$credentials.username}}',
				password:'={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://rest.clicksend.com/v3',
			url: '/account',
			method: 'GET',
		},
	};
}

