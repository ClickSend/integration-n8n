/* eslint-disable n8n-nodes-base/node-filename-against-convention */
import type {
	IHookFunctions,
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';
import { OptionsWithUri } from 'request-promise-native';


export class ClickSendTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ClickSend Trigger',
		name: 'clicksendTrigger',
		icon: 'file:clickSend.svg',
		group: ['trigger'],
		version: 1,
		description: 'Handle ClickSend events via webhooks',
		defaults: {
			name: 'ClickSend Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'clickSendApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Rule Name',
				name: 'rule_name',
				type: 'string',
				default: "",
				description:'Write a Rule Name',

			}

		],
	};


	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				if (webhookData.webhookId === undefined) {
					return false;
				}
				try {
					const options: OptionsWithUri = {
						headers: {
							Accept: 'application/json',
						},
						method: 'GET',
						uri: `https://rest.clicksend.com/v3/automations/sms/inbound/${webhookData.webhookId}`,
						json: true,
					};
					await this.helpers.requestWithAuthentication.call(this, 'clickSendApi', options);
				} catch (error) {
					return false;
				}
				return true;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const webhookData = this.getWorkflowStaticData('node');
				const rule = this.getNodeParameter('rule_name', []) as string[];
				let responseData;
				const options: OptionsWithUri = {
					headers: {
						Accept: 'application/json',
					},
					method: 'POST',
					body: {
						message_search_type: 1,
						message_search_term: 0,
						action_address: webhookUrl,
						dedicated_number: '*',
						rule_name: rule,
						action: 'URL',
						enabled: 1,
						webhook_type: 'json',
					},
					uri: `https://rest.clicksend.com/v3/automations/sms/inbound`,
					json: true,
				};
				responseData = await this.helpers.requestWithAuthentication.call(
					this,
					'clickSendApi',
					options,
				);
				webhookData.webhookId = responseData.data.inbound_rule_id;
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				try {
					const options: OptionsWithUri = {
						headers: {
							Accept: 'application/json',
						},
						method: 'DELETE',
						uri: `https://rest.clicksend.com/v3/automations/sms/inbound/${webhookData.webhookId}`,
						json: true,
					};
					await this.helpers.requestWithAuthentication.call(this, 'clickSendApi', options);
				}  catch (error) {
					return false;
				}
				delete webhookData.webhookId;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		return {
			workflowData: [this.helpers.returnJsonArray(req.body as IDataObject[])],
		};
	}
}
