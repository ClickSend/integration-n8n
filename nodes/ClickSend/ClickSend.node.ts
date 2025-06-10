import { IExecuteFunctions, ILoadOptionsFunctions } from 'n8n-workflow';
import { INodeExecutionData,NodeConnectionType, INodeType, INodeTypeDescription,NodeOperationError,IHttpRequestOptions } from 'n8n-workflow';


export class ClickSend implements INodeType {
	description: INodeTypeDescription = {
		// Basic node details will go here
		displayName: 'ClickSend',
		name: 'ClickSend',
		icon: 'file:clickSend.svg',
		group: ['transform'],
		version: 1,
		description: 'Consume Clicksend API',
		defaults: {
			name: 'ClickSend',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
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
						name: 'Send MMS.',
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
						name: 'Send SMS to a Contact List',
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
				displayName: 'Sender Name / From Field Name or ID',
				name: 'from',
				type: 'options',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
				default: '',
				placeholder: '+6144444444',
				typeOptions: {
					loadOptionsMethod: 'dedicatednumber',
				},
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['sms', 'list',]
					},
				},
			},
			{
				displayName: 'Sender Name / From Field',
				name: 'from',
				type: 'string',
				default: '',
				placeholder: 'Eg: +6144444444 ',
				description: "Sender Number - Use a ClickSend dedicated number that you've purchased. If you don't have a ClickSend number, leave it blank to use our free shared numbers.",
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['fax'],
					},
				},
			},
			{
				displayName: 'Sender Name/ From Field',
				name: 'from',
				type: 'string',
				default: '',
				placeholder: 'Eg: +6144444444 ',
				description: "Sender Number - Use a ClickSend dedicated number that you've purchased. If you don't have a ClickSend number, leave it blank to use our free shared numbers. "+'<a href="https://help.clicksend.com/article/4kgj7krx00-what-is-a-sender-id-or-sender-number">More info</a>',
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['mms'],
					},
				},
			},
			{
				displayName: 'Recipient Number / To Field',
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
				displayName: 'Name / ID Of Contact List Name or ID',
				name: 'contact_list',
				type: 'options',
				default: '',
				required: true,
				placeholder: '',
				description: 'Enter the name or the ID of the contact list you want to send to. You can find the contact list name or ID via the ClickSend Dashboard. <a href="https://dashboard.clicksend.com/lists/">More info</a>. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
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
				displayName: 'Message Body',
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
				description: 'The URL for the image or GIF you want to send',
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
				description: 'The URL for the image you want to send as a postcard',
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['card'],
					},
				},
			},
			{
				displayName: 'Letter URL',
				name: 'url',
				type: 'string',
				default: '',
				required:true,
				placeholder: 'https://docs.google.com/yurejfJFM/ID',
				description: 'The URL for the letter you want to send',
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['letter'],
					},
				},
			},
			{
				displayName: 'Message Body',
				name: 'body',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				required: true,
				placeholder: 'Max of 1500 characters allowed in MMS.',
				description: 'Write your message here',
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['mms'],
					},
				},
			},
			{
				displayName: 'Message Body',
				name: 'body',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				required: true,
				placeholder: 'You can type your message here.',
				description: 'This is the message you will send via voice',
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['voice'],
					},
				},
			},


			{
				displayName: 'Subject Line',
				name: 'subject',
				type: 'string',
				required:true,
				default: '',
				description: 'Enter the subject line of the MMS',
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['mms'],
					},
				},
			},

			{
				displayName: 'Voice Type',
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
				displayName: 'Recipient Name',
				name: 'address_name',
				type: 'string',
				required:true,
				default: '',
				description: 'The name of the person you\'re sending the postcard to',
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['card'],
					},
				},
			},

			{
				displayName: 'Recipient Name',
				name: 'address_name',
				type: 'string',
				required:true,
				default: '',
				description: 'The name of the person you\'re sending the letter to',
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
				displayName: 'Postal Code',
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
				displayName: 'Return Address Name or ID',
				name: 'return_address_id',
				type: 'options',
				required:true,
				default: '',
				description: 'Select the return address from the drop down list. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
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
				displayName: 'Select Country Name or ID',
				name: 'country',
				type: 'options',
				description: 'Select the country from the dropdown list. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
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
				displayName: 'Letter Template',
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
				description: 'If you\'re using our letter template please select yes',
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['letter'],
					},
				},
			},
			{
				displayName: 'Colour Printing',
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
				description: 'Please select yes for colour or no for black and white',
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['letter'],
					},
				},
			},
			{
				displayName: 'Double-Sided Printing',
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
				description: 'If you would like double-sided printing please select yes',
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['letter'],
					},
				},
			},
			{
				displayName: 'Priority Post',
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
				description: 'If you want to send the letter via priority post please select yes',
				displayOptions: {
					show: {
						operation: ['send'],
						resource: ['letter'],
					},
				},
			},
			{
				displayName: 'Language Name or ID',
				name: 'lang',
				type: 'options',
				description: 'Choose the language that matches your text so your message is read correctly. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
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
						resource: ['sms','list','voice','card','fax'],
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

				const optionsForCountries: IHttpRequestOptions = {
					headers: {
						Accept: 'application/json',
					},
					method: 'GET',
					url: 'https://rest.clicksend.com/v3/countries',
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

				const optionsForLanguage: IHttpRequestOptions = {
					headers: {
						Accept: 'application/json',
					},
					method: 'GET',
					url: 'https://rest.clicksend.com/v3/voice/lang',
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

				const optionsForReturnadress: IHttpRequestOptions = {
					headers: {
						Accept: 'application/json',
					},
					method: 'GET',
					url: 'https://rest.clicksend.com/v3/post/return-addresses',
					json: true,
				};

				const adressResponse = await this.helpers.requestWithAuthentication.call(this,'clickSendApi',optionsForReturnadress);

				const returnadress=adressResponse.data.data;
				if(adressResponse.data.total<1)
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

				const optionsFordedicatednumber:IHttpRequestOptions = {
					headers: {
						Accept: 'application/json',
					},
					method: 'GET',
					url: 'https://rest.clicksend.com/v3/numbers',
					json: true,
				};

				const dedicatednumberResponse = await this.helpers.requestWithAuthentication.call(this,'clickSendApi',optionsFordedicatednumber);
				const dedicated_number=dedicatednumberResponse.data.data;

				//fetch ownnumber
				const optionsForownnumber:IHttpRequestOptions = {
					headers: {
						Accept: 'application/json',
					},
					method: 'GET',
					url: 'https://rest.clicksend.com/v3/own-numbers',
					json: true,
				};

				const ownnumberResponse = await this.helpers.requestWithAuthentication.call(this,'clickSendApi',optionsForownnumber);
				const own_number=ownnumberResponse.own_numbers;

				//fetch alpha tag
				const optionsForalphanumber : IHttpRequestOptions= {
					headers: {
						Accept: 'application/json',
					},
					method: 'GET',
					url: 'https://rest.clicksend.com/v3/alpha-tags',
					json: true,
				};

				const alphanumberResponse = await this.helpers.requestWithAuthentication.call(this,'clickSendApi',optionsForalphanumber);
				const alpha_number=alphanumberResponse.alpha_tags;

				if(dedicatednumberResponse.data.total<1 && (own_number.length <1) && (alpha_number.length<1))
					{
						returnData.push(
							{
								name:"",
								value:"",
							})
					}else
					{	if(dedicatednumberResponse.data.total>0)
						{
							for(let i=0;i<dedicated_number.length;i++)
								{
									returnData.push(
										{
													name: dedicated_number[i].dedicated_number,
													value: dedicated_number[i].dedicated_number,
										})
								};
						}if(own_number.length>0)
							{
								for(let i=0;i<own_number.length;i++)
									{
										returnData.push(
											{
														name: own_number[i].phone_number,
														value: own_number[i].phone_number,
											})
									};
							}if(alpha_number.length>0)
								{
									for(let i=0;i<alpha_number.length;i++)
										{
											returnData.push(
												{
															name: alpha_number[i].alpha_tag,
															value: alpha_number[i].alpha_tag,
												})
										};
								}


					}
					return returnData;

			},
			//fetch contact list from account
			//fetch dedicated number from clicksend
			async contactlist(this: ILoadOptionsFunctions): Promise<any[]> {
				const returnData: any[] = [];

				const optionsForcontactlist : IHttpRequestOptions= {
					headers: {
						Accept: 'application/json',
					},
					method: 'GET',
					url: 'https://rest.clicksend.com/v3/lists',
					json: true,
				};

				const contactlistResponse = await this.helpers.requestWithAuthentication.call(this,'clickSendApi',optionsForcontactlist);

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




	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];
	const resource = this.getNodeParameter('resource', 0) as string;
	const operation = this.getNodeParameter('operation', 0) as string;

	function getUnixTimestamp(schedule: string | null): number | null {
		if (!schedule) return null;
		const date = new Date(schedule);
		return Math.floor(date.getTime() / 1000);
	}

	for (let i = 0; i < items.length; i++) {
		try {
			let options: IHttpRequestOptions;

			if (resource === 'sms' && operation === 'send') {
				const from = this.getNodeParameter('from', i) as string;
				const to = this.getNodeParameter('to', i) as string;
				const message = this.getNodeParameter('message', i) as string;
				const custom_string = this.getNodeParameter('custom_string', i) as string;
				const schedule = this.getNodeParameter('schedule', i) as string;
				const unixTimestamp = getUnixTimestamp(schedule);

				options = {
					headers: { Accept: 'application/json' },
					method: 'POST',
					body: {
						messages: [
							{
								from: from,
								to: to,
								body: message,
								source: 'n8n',
								custom_string: custom_string,
								schedule: unixTimestamp,
							},
						],
					},
					url: 'https://rest.clicksend.com/v3/sms/send',
					json: true,
				};
			}

			else if (resource === 'list' && operation === 'send') {
				const from = this.getNodeParameter('from', i) as string;
				const list_id = this.getNodeParameter('contact_list', i) as number;
				const message = this.getNodeParameter('message', i) as string;
				const custom_string = this.getNodeParameter('custom_string', i) as string;
				const schedule = this.getNodeParameter('schedule', i) as string;
				const unixTimestamp = getUnixTimestamp(schedule);

				options = {
					headers: { Accept: 'application/json' },
					method: 'POST',
					body: {
						messages: [
							{
								from: from,
								list_id: list_id,
								body: message,
								source: 'n8n',
								schedule: unixTimestamp,
								custom_string: custom_string,
							},
						],
					},
					url: 'https://rest.clicksend.com/v3/sms/send',
					json: true,
				};
			}

			else if (resource === 'fax' && operation === 'send') {
				const from = this.getNodeParameter('from', i) as string;
				const to = this.getNodeParameter('to', i) as number;
				const file_url = this.getNodeParameter('url', i) as string;
				const schedule = this.getNodeParameter('schedule', i) as string;
				const unixTimestamp = getUnixTimestamp(schedule);

				options = {
					headers: { Accept: 'application/json' },
					method: 'POST',
					body: {
						file_url: file_url,
						messages: [
							{
								to: to,
								from: from,
								source: 'n8n',
								schedule: unixTimestamp,
							},
						],
					},
					url: 'https://rest.clicksend.com/v3/fax/send',
					json: true,
				};
			}

			else if (resource === 'mms' && operation === 'send') {
				const from = this.getNodeParameter('from', i) as string;
				const to = this.getNodeParameter('to', i) as number;
				const file_url = this.getNodeParameter('url', i) as string;
				const body = this.getNodeParameter('body', i) as string;
				const subject = this.getNodeParameter('subject', i) as string;

				options = {
					headers: { Accept: 'application/json' },
					method: 'POST',
					body: {
						media_file: file_url,
						messages: [
							{
								subject: subject,
								from: from,
								to: to,
								body: body,
								source: 'n8n',
							},
						],
					},
					url: 'https://rest.clicksend.com/v3/mms/send',
					json: true,
				};
			}

			else if (resource === 'voice' && operation === 'send') {
				const to = this.getNodeParameter('to', i) as number;
				const body = this.getNodeParameter('body', i) as string;
				const voice = this.getNodeParameter('voice', i) as string;
				const lang = this.getNodeParameter('lang', i) as string;
				const schedule = this.getNodeParameter('schedule', i) as string;
				const unixTimestamp = getUnixTimestamp(schedule);

				options = {
					headers: { Accept: 'application/json' },
					method: 'POST',
					body: {
						messages: [
							{
								to: to,
								body: body,
								source: 'n8n',
								lang: lang,
								voice: voice,
								machine_detection: 0,
								schedule: unixTimestamp,
							},
						],
					},
					url: 'https://rest.clicksend.com/v3/voice/send',
					json: true,
				};
			}

			else if (resource === 'letter' && operation === 'send') {
				const file_url = this.getNodeParameter('url', i) as string;
				const address_name = this.getNodeParameter('address_name', i) as string;
				const address_line_1 = this.getNodeParameter('address_line_1', i) as number;
				const address_line_2 = this.getNodeParameter('address_line_2', i) as string;
				const address_city = this.getNodeParameter('address_city', i) as string;
				const address_state = this.getNodeParameter('address_state', i) as string;
				const address_postal_code = this.getNodeParameter('address_postal_code', i) as string;
				const address_country = this.getNodeParameter('country', i) as string;
				const return_address_id = this.getNodeParameter('return_address_id', i) as number;
				const template_used = this.getNodeParameter('template_used', i) as number;
				const colour = this.getNodeParameter('colour', i) as number;
				const duplex = this.getNodeParameter('duplex', i) as number;
				const priority_post = this.getNodeParameter('priority_post', i) as number;

				options = {
					headers: { Accept: 'application/json' },
					method: 'POST',
					body: {
						file_url: file_url,
						template_used: template_used,
						colour: colour,
						duplex: duplex,
						priority_post: priority_post,
						source: 'n8n',
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
								address_city: address_city,
							},
						],
					},
					url: 'https://rest.clicksend.com/v3/post/letters/send',
					json: true,
				};
			}

			else {
				throw new NodeOperationError(this.getNode(), `Unsupported resource (${resource}) or operation (${operation})`);

			}

			const responseData = await this.helpers.requestWithAuthentication.call(this, 'clickSendApi', options);

			const executionData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray([responseData]),
				{ itemData: { item: i } }
			);
			returnData.push(...executionData);
		} catch (error: any) {
			if (this.continueOnFail()) {
				const executionError = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray([{ error: error.message }]),
					{ itemData: { item: i } }
				);
				returnData.push(...executionError);
			} else {
				throw error;
			}
		}
	}

	return [returnData];
}




}
