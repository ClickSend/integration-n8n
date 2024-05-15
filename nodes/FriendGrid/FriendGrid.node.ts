/* eslint-disable n8n-nodes-base/node-param-description-excess-final-period */
import { IExecuteFunctions, ILoadOptionsFunctions } from 'n8n-core';
import { INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { OptionsWithUri } from 'request';
export class FriendGrid implements INodeType {
	description: INodeTypeDescription = {
		// Basic node details will go here
		displayName: 'ClickSend',
		name: 'friendGrid',
		icon: 'file:clickSend.svg',
		group: ['transform'],
		version: 1,
		description: 'Consume Clicksend API',
		defaults: {
			name: 'ClickSend',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'clickSendApi',
				required: true,
			},
		],
		properties: [
			//resource here
			{
				displayName: 'Action',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Send Fax',
						value: 'fax',
					},
					{
						name: 'Send Letter',
						value: 'letter',
					},
					{
						// eslint-disable-next-line n8n-nodes-base/node-param-resource-with-plural-option
						name: 'Send MMS',
						value: 'mms',
					},
					{
						name: 'Send Postcard',
						value: 'card',
					},
					{
						// eslint-disable-next-line n8n-nodes-base/node-param-resource-with-plural-option
						name: 'Send SMS',
						value: 'sms',
					},
					{
						// eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
						name: 'Send SMS to a contact List',
						value: 'list',
					},
					{
						name: 'Send Voice',
						value: 'voice',
					},
				],
				default: 'sms',
				noDataExpression: true,
				required: true,
				//description: 'Send a Message to number',
			},
			//operation here
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['sms'],
					},
				},
				options: [
					{
						name: 'Send',
						value: 'send',
						description: 'Send a message',
						action: 'Send a message',
					},
				],
				default: 'send',
				noDataExpression: true,
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['list'],
					},
				},
				options: [
					{
						name: 'Send',
						value: 'send',
						description: 'Send SMS to a contact list',
						action: 'Send SMS to a contact list',
					},
				],
				default: 'send',
				noDataExpression: true,
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['fax'],
					},
				},
				options: [
					{
						name: 'Send',
						value: 'send',
						description: 'Send a Fax',
						action: 'Send a fax',
					},
				],
				default: 'send',
				noDataExpression: true,
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['letter'],
					},
				},
				options: [
					{
						name: 'Send',
						value: 'send',
						description: 'Send a Letter',
						action: 'Send a letter',
					},
				],
				default: 'send',
				noDataExpression: true,
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['card'],
					},
				},
				options: [
					{
						name: 'Send',
						value: 'send',
						description: 'Send a Postcard',
						action: 'Send a postcard',
					},
				],
				default: 'send',
				noDataExpression: true,
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['mms'],
					},
				},
				options: [
					{
						name: 'Send',
						value: 'send',
						description: 'Send an MMS',
						action: 'Send a mms',
					},
				],
				default: 'send',
				noDataExpression: true,
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['voice'],
					},
				},
				options: [
					{
						name: 'Send',
						value: 'send',
						description: 'Send a Voice message',
						action: 'Send a voice message',
					},
				],
				default: 'send',
				noDataExpression: true,
			},
			//here is parameter that we need for https call
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options, n8n-nodes-base/node-param-display-name-miscased
				displayName: 'Sender name/From field',
				name: 'from',
				type: 'options',
				default: '',
				placeholder: '+6144444444',
				// eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-dynamic-options, n8n-nodes-base/node-param-description-miscased-id
				description: '<a href="https://help.clicksend.com/article/mnheutc0ri-registering-a-sender-id?utm_source=integration&utm_medium=referral&utm_campaign=n8n">More info</a> : Enter the number or name (alpha tag) you’re sending from. If you leave this field blank, we’ll send your messages from a shared number. View your numbers in the <a href="https://dashboard.clicksend.com/sender-ids/manage-senders">Dashboard.</a>',
				typeOptions: {
					loadOptionsMethod: 'dedicatednumber',
				},
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['sms', 'list',],
					},
				},
			},
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options, n8n-nodes-base/node-param-display-name-miscased
				displayName: 'Sender name/From field',
				name: 'from',
				type: 'string',
				default: '',
				placeholder: 'Eg: +6144444444 ',
				// eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-dynamic-options, n8n-nodes-base/node-param-description-miscased-id
				description: "Sender Number - Use a ClickSend dedicated number that you've purchased. If you don't have a ClickSend number, leave it blank to use our free shared numbers.",
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['fax'],
					},
				},
			},
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options, n8n-nodes-base/node-param-display-name-miscased
				displayName: 'Sender name/ From Field',
				name: 'from',
				type: 'string',
				default: '',
				placeholder: 'Eg: +6144444444 ',
				// eslint-disable-next-line n8n-nodes-base/node-param-description-miscased-id
				description: "Sender Number - Use a ClickSend dedicated number that you've purchased. If you don't have a ClickSend number, leave it blank to use our free shared numbers. "+'<a href="https://help.clicksend.com/article/4kgj7krx00-what-is-a-sender-id-or-sender-number">More info</a>',
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['mms'],
					},
				},
			},
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
				displayName: 'Recipient number / To field',
				name: 'to',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'Eg: +6144444444 ',
				description: 'The number can be in local or international format. If '+'youre sending to another country, the number must be in international format. E.g +61411111111.',
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['sms', 'fax','voice','mms'],
					},
				},
			},
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased, n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
				displayName: 'Name or ID of contact list',
				name: 'contact_list',
				type: 'options',
				default: '',
				required: true,
				placeholder: '',
				// eslint-disable-next-line n8n-nodes-base/node-param-description-missing-final-period, n8n-nodes-base/node-param-description-wrong-for-dynamic-options
				description: 'Enter the name or the ID of the contact list you want to send to. You can find the contact list name or ID via the ClickSend Dashboard. <a href="https://dashboard.clicksend.com/lists/">More info</a>.',
				typeOptions: {
					loadOptionsMethod: 'contactlist',
				},
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['list'],
					},
				},
			},
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
				displayName: 'Message body',
				name: 'message',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				required: true,
				placeholder: 'Write your message here. A standard SMS is 160 standard characters.',
				description: 'A standard SMS is 160 standard characters.<a href="https://help.clicksend.com/article/h474eseq3a-how-many-characters-can-i-send-in-an-sms?utm_source=integration&utm_medium=referral&utm_campaign=n8n"> More info</a>',
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['sms','list'],
					},
				},
			},
			{
				displayName: 'Image URL',
				name: 'url',
				type: 'string',
				default: '',
				required:true,
				placeholder: 'https://docs.google.com/yurejfJFM/ID',
				// eslint-disable-next-line n8n-nodes-base/node-param-description-excess-final-period
				description: 'The URL for the image or GIF you want to send.',
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['mms','fax'],
					},
				},
			},

			{
				displayName: 'File URL',
				name: 'cardurl',
				type: 'string',
				default: '',
				required:true,
				placeholder: 'https://docs.google.com/yurejfJFM/ID',
				// eslint-disable-next-line n8n-nodes-base/node-param-description-excess-final-period
				description: 'The URL for the image you want to send as a postcard.',
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['card'],
					},
				},
			},
			{
				displayName: 'File URL',
				name: 'url',
				type: 'string',
				default: '',
				required:true,
				placeholder: 'https://docs.google.com/yurejfJFM/ID',
				// eslint-disable-next-line n8n-nodes-base/node-param-description-excess-final-period
				description: 'The URL for the letter you want to send.',
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['letter'],
					},
				},
			},
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
				displayName: 'Message body',
				name: 'body',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				required: true,
				placeholder: 'Max of 1500 characters allowed in MMS.',
				// eslint-disable-next-line n8n-nodes-base/node-param-description-excess-final-period
				description: 'Write your message here.',
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['mms'],
					},
				},
			},
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
				displayName: 'Message body',
				name: 'body',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				required: true,
				placeholder: 'You can type your message here.',
				// eslint-disable-next-line n8n-nodes-base/node-param-description-excess-final-period
				description: 'This is the message you will send via voice.',
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['voice'],
					},
				},
			},


			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
				displayName: 'Subject line',
				name: 'subject',
				type: 'string',
				required:true,
				default: '',
				// eslint-disable-next-line n8n-nodes-base/node-param-description-excess-final-period
				description: 'Enter the subject line of the MMS.',
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['mms'],
					},
				},
			},
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
				displayName: 'From email',
				name: 'from_email',
				type: 'string',
				default: '',
				// eslint-disable-next-line n8n-nodes-base/node-param-description-excess-final-period
				description: 'Enter the email address that you want replies sent to.',
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['fax'],
					},
				},
			},
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
				displayName: 'Voice type',
				name: 'voice',
				type: 'options',
				options: [
					{
						name: 'Male',
						value: 'male',
					},
					{
						name: 'Female',
						value: 'female',
					},
				],
				default: 'male',
				description: 'Male or Female',
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['voice'],
					},
				},
			},
						{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
				displayName: 'Recipient name',
				name: 'address_name',
				type: 'string',
				required:true,
				default: '',
				// eslint-disable-next-line n8n-nodes-base/node-param-description-excess-final-period
				description: "The name of the person you're sending the postcard to.",
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['card'],
					},
				},
			},
			//
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
				displayName: 'Recipient name',
				name: 'address_name',
				type: 'string',
				required:true,
				default: '',
				// eslint-disable-next-line n8n-nodes-base/node-param-description-excess-final-period
				description: "The name of the person you're sending the letter to.",
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['letter'],
					},
				},
			},
			{
				displayName: 'Address Line 1',
				name: 'address_line_1',
				type: 'string',
				required:true,
				default: '',
				description: 'First line of the address',
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['letter','card'],
					},
				},
			},
			{
				displayName: 'Address Line 2',
				name: 'address_line_2',
				type: 'string',
				default: '',
				description: 'Second line of the address',
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['letter','card'],
					},
				},
			},
			{
				displayName: 'City',
				name: 'address_city',
				type: 'string',
				required:true,
				default: '',
				description: 'Enter the city',
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['letter','card'],
					},
				},
			},
			{
				displayName: 'State',
				name: 'address_state',
				type: 'string',
				default: '',
				required:true,
				description: 'Enter the state',
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['letter','card'],
					},
				},
			},
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
				displayName: 'Postal code',
				name: 'address_postal_code',
				type: 'string',
				required:true,
				default: '',
				description: 'Enter the postal code',
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['letter','card'],
					},
				},
			},
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased, n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
				displayName: 'Return address',
				name: 'return_address_id',
				type: 'options',
				required:true,
				default: '',
				// eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-dynamic-options, n8n-nodes-base/node-param-description-excess-final-period
				description: 'Enter the return address here.',
				typeOptions:{
					loadOptionsMethod:'returnadress'
				},
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['letter','card'],
					},
				},
			},
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options, n8n-nodes-base/node-param-display-name-miscased
				displayName: 'Select country',
				name: 'country',
				type: 'options',
				// eslint-disable-next-line n8n-nodes-base/node-param-description-excess-final-period, n8n-nodes-base/node-param-description-wrong-for-dynamic-options
				description: 'Select the country from the dropdown list.',
				noDataExpression: true,
				default: '',
				typeOptions: {
					loadOptionsMethod: 'country',
				},
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['letter','card'],
					},
				},
			},
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
				displayName: 'Letter template',
				name: 'template_used',
				type: 'options',
				options: [
					{
						name: 'Yes',
						value: 1,
					},
					{
						name: 'No',
						value: 0,
					},
				],
				default: 0,
				description: "If you're using our letter template please select yes.",
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['letter'],
					},
				},
			},
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
				displayName: 'Colour printing',
				name: 'colour',
				type: 'options',
				options: [
					{
						name: 'Yes',
						value: 1,
					},
					{
						name: 'No',
						value: 0,
					},
				],
				default: 0,
				// eslint-disable-next-line n8n-nodes-base/node-param-description-excess-final-period
				description: 'Please select yes for colour or no for black and white.',
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['letter'],
					},
				},
			},
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
				displayName: 'Double-sided printing',
				name: 'duplex',
				type: 'options',
				options: [
					{
						name: 'Yes',
						value: 1,
					},
					{
						name: 'No',
						value: 0,
					},
				],
				default: 0,
				// eslint-disable-next-line n8n-nodes-base/node-param-description-excess-final-period
				description: 'If you would like double-sided printing please select yes.',
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['letter'],
					},
				},
			},
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
				displayName: 'Priority post',
				name: 'priority_post',
				type: 'options',
				options: [
					{
						name: 'Yes',
						value: 1,
					},
					{
						name: 'No',
						value: 0,
					},
				],
				default: 0,
				// eslint-disable-next-line n8n-nodes-base/node-param-description-excess-final-period
				description: 'If you want to send the letter via priority post please select yes.',
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['letter'],
					},
				},
			},
			{
				// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
				displayName: 'Language',
				name: 'lang',
				type: 'options',
				// eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-dynamic-options, n8n-nodes-base/node-param-description-excess-final-period
				description: 'Choose the language that matches your text so your message is read correctly.',
				noDataExpression: true,
				default: '',
				typeOptions: {
					loadOptionsMethod: 'language',
				},
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['voice'],
					},
				},
			},
			{
				displayName: 'Schedule',
				name: 'schedule',
				type: 'dateTime',
				default: '',
				description: 'The date and time that the message will be sent',
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['fax','sms','list','voice','card'],
					}
				},
			},
			{
				displayName: 'Custom String',
				name: 'custom_string',
				type: 'string',
				default: '',
				placeholder: 'this is Custom String',
				description: 'This is your reference. Max 50 characters.',
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['sms', 'list'],
					},
				},
			},

		],
	};
	// The loadOptions method will go here
	methods={
		loadOptions:
		{
			async country(this: ILoadOptionsFunctions): Promise<any[]> {
				const returnData: any[] = [];

				const optionsForCountries: OptionsWithUri = {
					headers: {
						Accept: 'application/json',
					},
					method: 'GET',
					uri: 'https://rest.clicksend.com/v3/countries',
					json: true,
				};

				const countriesResponse = await this.helpers.request(optionsForCountries);

				const countryobj=countriesResponse.data;
				for(let i=0;i<countryobj.length;i++)
				{
					returnData.push(
						{
							name: countryobj[i].value,
							value: countryobj[i].code,
						})
				};
				return returnData;
			},
			//fetch language from clicksend
			async language(this: ILoadOptionsFunctions): Promise<any[]> {
				const returnData: any[] = [];

				const optionsForLanguage: OptionsWithUri = {
					headers: {
						Accept: 'application/json',
					},
					method: 'GET',
					uri: 'https://rest.clicksend.com/v3/voice/lang',
					json: true,
				};

				const languageResponse = await this.helpers.requestWithAuthentication.call(this,'clickSendApi',optionsForLanguage);

				const langobj=languageResponse.data;
				for(let i=0;i<langobj.length;i++)
				{
					returnData.push(
						{
							name: langobj[i].country,
							value: langobj[i].code,
						})
				};
				return returnData;
			},
			//fetch return adress from account
			async returnadress(this: ILoadOptionsFunctions): Promise<any[]> {
				const returnData: any[] = [];

				const optionsForReturnadress: OptionsWithUri = {
					headers: {
						Accept: 'application/json',
					},
					method: 'GET',
					uri: 'https://rest.clicksend.com/v3/post/return-addresses',
					json: true,
				};

				const adressResponse = await this.helpers.requestWithAuthentication.call(this,'clickSendApi',optionsForReturnadress);
				console.log(adressResponse);
				const returnadress=adressResponse.data.data;
				if(returnadress.length<1)
					{
						returnData.push(
							{
								name:"",
								value:"",
							})

					}else
					{
						for(let i=0;i<returnadress.length;i++)
							{
								returnData.push(
									{
										name: returnadress[i].address_name,
										value: returnadress[i].return_address_id,
									})
							};
					}


				return returnData;
			},
			//fetch dedicated number from clicksend
			async dedicatednumber(this: ILoadOptionsFunctions): Promise<any[]> {
				const returnData: any[] = [];

				const optionsFordedicatednumber: OptionsWithUri = {
					headers: {
						Accept: 'application/json',
					},
					method: 'GET',
					uri: 'https://rest.clicksend.com/v3/numbers',
					json: true,
				};

				const dedicatednumberResponse = await this.helpers.requestWithAuthentication.call(this,'clickSendApi',optionsFordedicatednumber);
				console.log(dedicatednumberResponse);
				const dedicated_number=dedicatednumberResponse.data.data;
				if(dedicated_number.length<1)
					{
						returnData.push(
							{
								name:"",
								value:"",
							})
					}else
					{
						for(let i=0;i<dedicated_number.length;i++)
							{
								returnData.push(
									{
										name: dedicated_number[i].dedicated_number,
										value: dedicated_number[i].dedicated_number,
									})
							};


					}
					return returnData;

			},
			//fetch contact list from account
			//fetch dedicated number from clicksend
			async contactlist(this: ILoadOptionsFunctions): Promise<any[]> {
				const returnData: any[] = [];

				const optionsForcontactlist: OptionsWithUri = {
					headers: {
						Accept: 'application/json',
					},
					method: 'GET',
					uri: 'https://rest.clicksend.com/v3/lists',
					json: true,
				};

				const contactlistResponse = await this.helpers.requestWithAuthentication.call(this,'clickSendApi',optionsForcontactlist);
				console.log(contactlistResponse);
				const contact_list=contactlistResponse.data.data;

				for(let i=0;i<contact_list.length;i++)
				{
					returnData.push(
						{
							name: contact_list[i].list_name,
							value: contact_list[i].list_id,
						})
				};
				return returnData;
			},
		},
	};
















// execute function go here

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		let responseData;
		const returnData = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		// Make HTTP request according to https://developers.clicksend.com/docs/rest/v3/

//#1 for sending sms
		if(resource==='sms' && operation==='send')
		{
			const from = this.getNodeParameter('from', 0) as string;
			const to = this.getNodeParameter('to', 0) as string;
			const message = this.getNodeParameter('message', 0) as string;
			const custom_string=this.getNodeParameter('custom_string',0) as string;
			const schedule=this.getNodeParameter('schedule',0) as string;
			const dateObject = new Date(schedule);
			let unixTimestamp = null;
			if(schedule!=null)
				{
					unixTimestamp=Math.floor(dateObject.getTime() / 1000);
				}
		//	if(from.length<11)
			//	{
				const options: OptionsWithUri = {
					headers: {
						Accept: 'application/json',
					},
					method: 'POST',
					body: {
						messages: [
							{
								from: from,
								to: to,
								body: message,
								source: 'n8n',
								custom_string:custom_string,
								schedule:unixTimestamp
							},
						],
					},
					uri: `https://rest.clicksend.com/v3/sms/send`,
					json: true,
				};
				responseData = await this.helpers.requestWithAuthentication.call(this, 'clickSendApi', options);
				if(responseData.response_code=="SUCCESS" && responseData.data.queued_count>0)
				{
				returnData.push(responseData);
				}else
				{
					if(responseData.data.messages[0].status=="INVALID_RECIPIENT")
					{
						let data=
					{
						status:"INVALID_RECIPIENT",
						reason:"That number doesn't look quite right. Check it and try again. "
					}
					returnData.push(data);

					}else if(responseData.data.messages[0].status=="INSUFFICIENT_CREDIT")
					{
						let data=
					{
						status:"INSUFFICIENT_CREDIT",
						reason:"You don't have enough credit to send. Top up your account."
					}
					returnData.push(data);
					}



			}







		}//#2 for sending sms to list
		else if(resource==='list' && operation==='send')
		{
			const from = this.getNodeParameter('from', 0) as string;
			const list_id = this.getNodeParameter('contact_list', 0) as number;
			const message = this.getNodeParameter('message', 0) as string;
			const custom_string=this.getNodeParameter('custom_string',0) as string;
			const schedule=this.getNodeParameter('schedule',0) as string;
			const dateObject = new Date(schedule);
			let unixTimestamp = null;
			if(schedule!=null)
				{
					unixTimestamp=Math.floor(dateObject.getTime() / 1000);
				}
			const options: OptionsWithUri = {
				headers: {
					Accept: 'application/json',
				},
				method: 'POST',
				body: {
					messages: [
						{
							from: from,
							list_id: list_id,
							body: message,
							source: 'n8n',
							schedule:unixTimestamp,
							custom_string:custom_string,

						},
					],
				},
				uri: `https://rest.clicksend.com/v3/sms/send`,
				json: true,
			};
			responseData = await this.helpers.requestWithAuthentication.call(this, 'clickSendApi', options);
			if(responseData.response_code=="SUCCESS" && responseData.data.queued_count>0)
			{
			returnData.push(responseData);
			}else
			{
				if(responseData.data.messages[0].status=="INVALID_RECIPIENT")
				{
					let data=
				{
					status:"INVALID_RECIPIENT",
					reason:"That number doesn't look quite right. Check it and try again. "
				}
				returnData.push(data);

				}else if(responseData.data.messages[0].status=="INSUFFICIENT_CREDIT")
				{
					let data=
				{
					status:"INSUFFICIENT_CREDIT",
					reason:"You don't have enough credit to send. Top up your account."
				}
				returnData.push(data);
				}
			}

		}//#3 for sending fax
		else if(resource==='fax' && operation==='send')
		{
			const from = this.getNodeParameter('from', 0) as string;
			const to = this.getNodeParameter('to', 0) as number;
			const file_url = this.getNodeParameter('url', 0) as string;
			const from_email=this.getNodeParameter('from_email',0) as string;
			const schedule=this.getNodeParameter('schedule',0) as string;
			const dateObject = new Date(schedule);
			let unixTimestamp = null;
			if(schedule!=null)
				{
					unixTimestamp=Math.floor(dateObject.getTime() / 1000);
				}
			const options: OptionsWithUri = {
				headers: {
					Accept: 'application/json',
				},
				method: 'POST',
				body: {
					file_url:file_url,
					from_email:from_email,
					messages: [
						{
						to: to,
      					from: from,
      					source: "n8n",
					  	schedule:unixTimestamp
						},
					],
				},
				uri: `https://rest.clicksend.com/v3/fax/send`,
				json: true,
			};
			responseData = await this.helpers.requestWithAuthentication.call(this, 'clickSendApi', options);
			returnData.push(responseData);
		}//#4 for sending mms
		else if(resource==='mms' && operation==='send')
		{
			const from = this.getNodeParameter('from', 0) as string;
			const to = this.getNodeParameter('to', 0) as number;
			const file_url = this.getNodeParameter('url', 0) as string;
			const body=this.getNodeParameter('body',0) as string;
			const subject = this.getNodeParameter('subject', 0) as string;

			const options: OptionsWithUri = {
				headers: {
					Accept: 'application/json',
				},
				method: 'POST',
				body: {
					media_file:file_url,
					messages: [
						{
							subject:subject,
							from: from,
							to: to,
							body: body,
							source: 'n8n',
						},
					],
				},
				uri: `https://rest.clicksend.com/v3/mms/send`,
				json: true,
			};
			responseData = await this.helpers.requestWithAuthentication.call(this, 'clickSendApi', options);
			returnData.push(responseData);
		}//#5 for sending Voice
		else if(resource==='voice' && operation==='send')
		{

			const to = this.getNodeParameter('to', 0) as number;
			const body=this.getNodeParameter('body',0) as string;
			const voice=this.getNodeParameter('voice',0) as string;
			const lang=this.getNodeParameter('lang',0) as string;
			const schedule=this.getNodeParameter('schedule',0) as string;
			const dateObject = new Date(schedule);
			let unixTimestamp = null;
			if(schedule!=null)
				{
					unixTimestamp=Math.floor(dateObject.getTime() / 1000);
				}
			const options: OptionsWithUri = {
				headers: {
					Accept: 'application/json',
				},
				method: 'POST',
				body: {
					messages: [
						{

							to: to,
							body: body,
							source: 'n8n',
							lang:lang,
							voice:voice,
							machine_detection: 0,
							schedule:unixTimestamp
						},
					],
				},
				uri: `https://rest.clicksend.com/v3/voice/send`,
				json: true,
			};
			responseData = await this.helpers.requestWithAuthentication.call(this, 'clickSendApi', options);
			returnData.push(responseData);
		}//#6 for sending Letter
		else if(resource==='letter' && operation==='send')
		{
			const file_url = this.getNodeParameter('url', 0) as string;
			const address_name = this.getNodeParameter('address_name', 0) as string;
			const address_line_1 = this.getNodeParameter('address_line_1', 0) as number;
			const address_line_2=this.getNodeParameter('address_line_2',0) as string;
			const address_city = this.getNodeParameter('address_city', 0) as string;
			const address_state=this.getNodeParameter('address_state',0) as string;
			const address_postal_code = this.getNodeParameter('address_postal_code', 0) as string;
			const address_country=this.getNodeParameter('country',0) as string;
			const return_address_id = this.getNodeParameter('return_address_id', 0) as number;
			const template_used=this.getNodeParameter('template_used',0) as number;
			const colour = this.getNodeParameter('colour', 0) as number;
			const duplex=this.getNodeParameter('duplex',0) as number;
			const priority_post = this.getNodeParameter('priority_post', 0) as number;
			const options: OptionsWithUri = {
				headers: {
					Accept: 'application/json',
				},
				method: 'POST',
				body: {
					file_url:file_url,
					template_used: template_used,
  				colour: colour,
  				duplex: duplex,
  				priority_post: priority_post,
					source:"n8n",
					recipients: [
						{
							return_address_id: return_address_id,
							schedule: 0,
							address_postal_code: address_postal_code,
							address_country: address_country,
							address_line_1: address_line_1,
							address_state: address_state,
							address_name: address_name,
							address_line_2: address_line_2,
							address_city: address_city
						},
					],
				},
				uri: `https://rest.clicksend.com/v3/post/letters/send`,
				json: true,
			};
			responseData = await this.helpers.requestWithAuthentication.call(this, 'clickSendApi', options);
			returnData.push(responseData);
		}//#7 for sending postcard
		else if(resource==='card' && operation==='send')
		{

			const file_url = this.getNodeParameter('cardurl', 0) as string;
			const address_name = this.getNodeParameter('address_name', 0) as string;
			const address_line_1 = this.getNodeParameter('address_line_1', 0) as number;
			const address_line_2=this.getNodeParameter('address_line_2',0) as string;
			const address_city = this.getNodeParameter('address_city', 0) as string;
			const address_state=this.getNodeParameter('address_state',0) as string;
			const address_postal_code = this.getNodeParameter('address_postal_code', 0) as string;
			const address_country=this.getNodeParameter('country',0) as string;
			const return_address_id = this.getNodeParameter('return_address_id', 0) as number;
			const schedule=this.getNodeParameter('schedule',0) as string;
			const dateObject = new Date(schedule);
			let unixTimestamp = null;
			if(schedule!=null)
				{
					unixTimestamp=Math.floor(dateObject.getTime() / 1000);
				}
			// const custom_string = this.getNodeParameter('custom_string', 0) as string;
			const options: OptionsWithUri = {
				headers: {
					Accept: 'application/json',
				},
				method: 'POST',
				body: {
					file_urls:[file_url],
					source:"n8n",
					recipients: [
						{
							return_address_id: return_address_id,
							address_postal_code: address_postal_code,
							address_country: address_country,
							address_line_1: address_line_1,
							address_state: address_state,
							address_name: address_name,
							address_line_2: address_line_2,
							address_city: address_city,
							schedule:unixTimestamp,
						},
					],
				},
				uri: `https://rest.clicksend.com/v3/post/postcards/send`,
				json: true,
			};
			responseData = await this.helpers.requestWithAuthentication.call(this, 'clickSendApi', options);
			returnData.push(responseData);
		}

			// Map data to n8n data structure
			return [this.helpers.returnJsonArray(returnData)];
	}

}
