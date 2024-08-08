import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ClickSendApi implements ICredentialType {
	name = 'clickSendApi';
	displayName = 'ClickSend API';
	documentationUrl = 'https://dashboard.clicksend.com/account/subaccounts?utm_source=integration&utm_medium=referral&utm_campaign=n8n';
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
			url: '/account', // Use an API endpoint that does not modify data, such as fetching account details
    	method: 'GET', // Use a safe HTTP method like GET
		},
	};
}

