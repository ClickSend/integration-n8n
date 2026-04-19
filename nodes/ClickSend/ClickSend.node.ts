import type {
	IExecuteFunctions,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

export class ClickSend implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ClickSend SMS',
		name: 'ClickSend',
		icon: 'file:clickSend.svg',
		group: ['transform'],
		version: 1,
		description: 'Consume ClickSend API',
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		defaults: {
			name: 'ClickSend SMS',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'clickSendApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'MMS',
						value: 'mms',
					},
					{
						name: 'SMS',
						value: 'sms',
					},
					{
						name: 'Contact List',
						value: 'list',
					},
				],
				default: 'sms',
				noDataExpression: true,
				required: true,
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
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
				displayName: 'Sender Name / From Field Name or ID',
				name: 'from',
				type: 'options',
				description:'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				default: '',
				placeholder: '+6144444444',
				typeOptions: {
					loadOptionsMethod: 'dedicatedNumber',
				},
				displayOptions: {
					show: {
						resource: ['sms', 'list'],
					},
				},
			},
			{
				displayName: 'Sender Name / From Field',
				name: 'from',
				type: 'string',
				default: '',
				placeholder: 'Eg: +6144444444',
				description:
					"Sender number. Use a ClickSend dedicated number that you've purchased. If you don't have a ClickSend number, leave it blank to use shared numbers.",
				displayOptions: {
					show: {
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
				placeholder: 'Eg: +6144444444',
				description:
					'The number can be in local or international format. If sending to another country, use international format, for example +61411111111.',
				displayOptions: {
					show: {
						resource: ['sms', 'mms'],
					},
				},
			},
			{
				displayName: 'Name / ID Of Contact List Name or ID',
				name: 'contact_list',
				type: 'options',
				default: '',
				required: true,
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'contactList',
				},
				displayOptions: {
					show: {
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
				description:
					'A standard SMS is 160 standard characters.<a href="https://help.clicksend.com/en/articles/42194-understanding-sms-character-limits-and-message-parts?utm_source=integration&utm_medium=referral&utm_campaign=n8n"> More info</a>',
				displayOptions: {
					show: {
						resource: ['sms', 'list'],
					},
				},
			},
			{
				displayName: 'Image URL',
				name: 'url',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'https://example.com/image.jpg',
				description: 'The URL for the image or GIF you want to send',
				displayOptions: {
					show: {
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
				placeholder: 'Max of 1500 characters allowed in MMS.',
				description: 'Write your message here',
				displayOptions: {
					show: {
						resource: ['mms'],
					},
				},
			},
			{
				displayName: 'Subject Line',
				name: 'subject',
				type: 'string',
				required: true,
				default: '',
				description: 'Enter the subject line of the MMS',
				displayOptions: {
					show: {
						resource: ['mms'],
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
						resource: ['sms', 'list'],
					},
				},
			},
			{
				displayName: 'Custom String',
				name: 'custom_string',
				type: 'string',
				default: '',
				placeholder: 'this is Custom String',
				description:
					'This is your reference. Max 50 characters. For example, users might use it to label a message by campaign name, order ID, or test tag.',
				displayOptions: {
					show: {
						resource: ['sms', 'list'],
					},
				},
			},
		],
	};

	methods = {
		loadOptions: {
			async dedicatedNumber(this: ILoadOptionsFunctions): Promise<any[]> {
				const returnData: Array<{ name: string; value: string }> = [
					{
						name: 'Use Account Default (Shared Number)',
						value: '',
					},
				];

				const numbersResponse = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'clickSendApi',
					{
						headers: {
							Accept: 'application/json',
						},
						method: 'GET',
						url: 'https://rest.clicksend.com/v3/numbers',
						json: true,
					},
				);

				const ownNumbersResponse = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'clickSendApi',
					{
						headers: {
							Accept: 'application/json',
						},
						method: 'GET',
						url: 'https://rest.clicksend.com/v3/own-numbers',
						json: true,
					},
				);

				const alphaTagsResponse = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'clickSendApi',
					{
						headers: {
							Accept: 'application/json',
						},
						method: 'GET',
						url: 'https://rest.clicksend.com/v3/alpha-tags',
						json: true,
					},
				);

				for (const number of numbersResponse.data?.data ?? []) {
					returnData.push({
						name: number.dedicated_number,
						value: number.dedicated_number,
					});
				}

				for (const number of ownNumbersResponse.own_numbers ?? []) {
					returnData.push({
						name: number.phone_number,
						value: number.phone_number,
					});
				}

				for (const tag of alphaTagsResponse.alpha_tags ?? []) {
					returnData.push({
						name: tag.alpha_tag,
						value: tag.alpha_tag,
					});
				}

				return returnData;
			},
			async contactList(this: ILoadOptionsFunctions): Promise<any[]> {
				const response = await this.helpers.httpRequestWithAuthentication.call(this, 'clickSendApi', {
					headers: {
						Accept: 'application/json',
					},
					method: 'GET',
					url: 'https://rest.clicksend.com/v3/lists',
					json: true,
				});

				return (response.data?.data ?? []).map((list: { list_id: string; list_name: string }) => ({
					name: list.list_name,
					value: list.list_id,
				}));
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const getUnixTimestamp = (schedule: string): number | undefined => {
			if (!schedule) {
				return undefined;
			}

			return Math.floor(new Date(schedule).getTime() / 1000);
		};

		for (let i = 0; i < items.length; i++) {
			try {
				let options: IHttpRequestOptions;

				if (resource === 'sms' && operation === 'send') {
					const from = this.getNodeParameter('from', i) as string;
					const to = this.getNodeParameter('to', i) as string;
					const message = this.getNodeParameter('message', i) as string;
					const customString = this.getNodeParameter('custom_string', i) as string;
					const schedule = this.getNodeParameter('schedule', i) as string;

					options = {
						headers: { Accept: 'application/json' },
						method: 'POST',
						body: {
							messages: [
								{
									from,
									to,
									body: message,
									source: 'n8n',
									custom_string: customString,
									schedule: getUnixTimestamp(schedule),
								},
							],
						},
						url: 'https://rest.clicksend.com/v3/sms/send',
						json: true,
					};
				} else if (resource === 'list' && operation === 'send') {
					const from = this.getNodeParameter('from', i) as string;
					const listId = this.getNodeParameter('contact_list', i) as string;
					const message = this.getNodeParameter('message', i) as string;
					const customString = this.getNodeParameter('custom_string', i) as string;
					const schedule = this.getNodeParameter('schedule', i) as string;

					options = {
						headers: { Accept: 'application/json' },
						method: 'POST',
						body: {
							messages: [
								{
									from,
									list_id: listId,
									body: message,
									source: 'n8n',
									schedule: getUnixTimestamp(schedule),
									custom_string: customString,
								},
							],
						},
						url: 'https://rest.clicksend.com/v3/sms/send',
						json: true,
					};
				} else if (resource === 'mms' && operation === 'send') {
					const from = this.getNodeParameter('from', i) as string;
					const to = this.getNodeParameter('to', i) as string;
					const fileUrl = this.getNodeParameter('url', i) as string;
					const body = this.getNodeParameter('body', i) as string;
					const subject = this.getNodeParameter('subject', i) as string;

					options = {
						headers: { Accept: 'application/json' },
						method: 'POST',
						body: {
							media_file: fileUrl,
							messages: [
								{
									subject,
									from,
									to,
									body,
									source: 'n8n',
								},
							],
						},
						url: 'https://rest.clicksend.com/v3/mms/send',
						json: true,
					};
				} else {
					throw new NodeOperationError(
						this.getNode(),
						`Unsupported resource (${resource}) or operation (${operation})`,
					);
				}

				const responseData = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'clickSendApi',
					options,
				);

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray([responseData]),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionError = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray([
							{ error: error instanceof Error ? error.message : 'Unknown error' },
						]),
						{ itemData: { item: i } },
					);
					returnData.push(...executionError);
					continue;
				}

				throw new NodeApiError(this.getNode(), error as JsonObject);
			}
		}

		return [returnData];
	}
}
