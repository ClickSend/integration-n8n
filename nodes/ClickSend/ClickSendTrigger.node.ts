/* eslint-disable n8n-nodes-base/node-filename-against-convention */
import type {
	IHookFunctions,
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	IHttpRequestOptions,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';


export class ClickSendTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ClickSend Trigger',
		name: 'clickSendTrigger',
		icon: 'file:clickSend.svg',
		group: ['trigger'],
		version: 1,
		description: 'Handle ClickSend events via webhooks',
		subtitle: 'Inbound SMS webhook',
		triggerPanel: {
			header: 'ClickSend inbound webhook',
			executionsHelp: {
				active: 'Send an SMS to your ClickSend number. n8n receives it at the production webhook URL and triggers this workflow.',
				inactive:
					'Example payload for testing and mapping fields:\n\n```json\n{\n  "originalsenderid": "+61477485926",\n  "body": "trigger reply",\n  "message": "trigger reply",\n  "sms": "+61429912603",\n  "from": "+61429912603",\n  "to": "+61477485926",\n  "timestamp": 1775012927,\n  "message_id": "1F12D781-99C1-6D94-96FE-F5A311C8997D",\n  "original_message_id": "1F12D717-947A-6FBC-BBFE-D14C2927CEEF",\n  "original_body": "TESTING TRIGGER",\n  "user_id": 304497,\n  "subaccount_id": 745158,\n  "custom_string": ""\n}\n```',
			},
		},
		hints: [
			{
				message: 'Example Webhook Payload:\n{\n  "originalsenderid": "+61477485926",\n  "body": "trigger reply",\n  "message": "trigger reply",\n  "sms": "+61429912603",\n  "from": "+61429912603",\n  "to": "+61477485926",\n  "timestamp": 1775012927,\n  "message_id": "1F12D781-99C1-6D94-96FE-F5A311C8997D",\n  "original_message_id": "1F12D717-947A-6FBC-BBFE-D14C2927CEEF",\n  "original_body": "TESTING TRIGGER",\n  "user_id": 304497,\n  "subaccount_id": 745158,\n  "custom_string": ""\n}',
			},
		],
		defaults: {
			name: 'ClickSend Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
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
		properties: [],
	};


	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				if (webhookData.webhookId === undefined) {
					return false;
				}
				try {
					const options: IHttpRequestOptions = {
						headers: {
							Accept: 'application/json',
						},
						method: 'GET',
						url: `https://rest.clicksend.com/v3/automations/sms/inbound/${webhookData.webhookId}`,
						json: true,
					};
					await this.helpers.httpRequestWithAuthentication.call(this, 'clickSendApi', options);
				} catch (error) {
					return false;
				}
				return true;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const webhookData = this.getWorkflowStaticData('node');

				const workflowId = String(this.getWorkflow()?.id ?? 'unknown-workflow').replace(/[^a-zA-Z0-9-_]/g, '-');
				const nodeName = this.getNode().name.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
				const ruleName = `n8n-wf-${workflowId}-${nodeName}`;

				let responseData;
				const options: IHttpRequestOptions = {
					headers: {
						Accept: 'application/json',
					},
					method: 'POST',
					body: {
						message_search_type: 0,
						message_search_term: '',
						action_address: webhookUrl,
						dedicated_number: '*',
						rule_name: ruleName,
						action: 'URL',
						enabled: 1,
						webhook_type: 'json',
					},
					url: 'https://rest.clicksend.com/v3/automations/sms/inbound',
					json: true,
				};
				responseData = await this.helpers.httpRequestWithAuthentication.call(
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
					const options: IHttpRequestOptions = {
						headers: {
							Accept: 'application/json',
						},
						method: 'DELETE',
						url: `https://rest.clicksend.com/v3/automations/sms/inbound/${webhookData.webhookId}`,
						json: true,
					};
					await this.helpers.httpRequestWithAuthentication.call(this, 'clickSendApi', options);
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
