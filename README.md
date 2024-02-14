# n8n ClickSend Node

## Description

This node allows you to interact with ClickSend API to send SMS, MMS, Fax, Voice messages, and more using n8n workflows.

## Prerequisites

Before using this node, you need to have a ClickSend account. Obtain the API key from your ClickSend account, as it will be required for authentication.

## Installation

1. Open your n8n workflow editor.
2. Navigate to "Nodes" in the top menu.
3. Click on the "+" button to add a new node.
4. Search for "ClickSend" in the search bar.
5. Click on the "ClickSend" node to add it to your workflow.
6. Configure the ClickSend node with your API key and other required parameters.

## Usage

1. Drag and drop the ClickSend node into your workflow.
2. Connect it to other nodes as needed.
3. Configure the parameters based on the type of message you want to send (SMS, MMS, Fax, Voice, etc.).
4. Execute your workflow.

## Parameters

- **Resource**: Select the type of resource you want to interact with (SMS, MMS, Fax, Voice, etc.).
- **Operation**: Select the operation to perform on the chosen resource (e.g., Send, List, etc.).
- **From**: The sender's phone number for SMS, Fax, or Voice messages.
- **From/Sender ID**: The sender's ID for MMS messages.
- **To**: The recipient's phone number.
- **Contact List ID**: The contact list ID for sending SMS to a contact list.
- **Message**: The text message to send.
- **Body**: The message body for Voice and MMS messages.
- **Custom String**: Custom string to include with the message.
- **URL**: The media file URL for MMS and Fax messages.
- **Subject**: The subject for MMS messages.
- **From Email**: The email address for Fax messages.
- **Voice**: Select the voice type for Voice messages (Male or Female).
- **Schedule**: Schedule the message to be sent at a specific date and time.
- **Address Name**: Name of the recipient for Letter messages.
- **Address Line 1/2**: Address details for Letter messages.
- **Address City/State/Postal Code**: City, state, and postal code for Letter messages.
- **Return Address ID**: ID for the return address for Letter messages.
- **Country Name or ID**: Country name or ID for Fax messages.

## Example

Here's an example of a workflow using the ClickSend node to send an SMS:

1. Drag and drop the ClickSend node.
2. Connect it to a Trigger node or any other nodes in your workflow.
3. Set the parameters:
   - Resource: SMS
   - Operation: Send
   - From: Your phone number
   - To: Recipient's phone number
   - Message: Your text message
4. Execute the workflow.
## ClickSend Trigger Node

This ClickSend n8n package also includes a trigger node that allows you to initiate a workflow when a message is received in your ClickSend account.

### Trigger Configuration

1. Drag and drop the ClickSend Trigger node into your workflow.
2. Configure the parameters:
   - **Event Type**: Select the type of event to trigger the workflow (e.g., "Message Received").
   - **Webhook URL**: Set up a webhook in your ClickSend account and enter the URL here.
   - **Shared Secret**: (Optional) If you've configured a shared secret in your webhook, enter it here.
3. Connect the trigger node to other nodes in your workflow.
4. Execute the workflow.

### Example Workflow

Here's a simple example of a workflow that triggers when a message is received:

1. Add the ClickSend Trigger node.
2. Connect it to other nodes in your workflow.
3. Configure the trigger node with the appropriate settings.
4. Add nodes to process the received message.
5. Execute the workflow.

### Note

- Make sure to configure your ClickSend account to send message events to the webhook URL provided in the ClickSend Trigger node configuration.

### License

The ClickSend Trigger node for n8n is licensed under the [MIT License](LICENSE).

### Support

For assistance or issues related to the ClickSend Trigger node, please [raise a GitHub issue](https://github.com/your-repository/clicksend-trigger-node/issues).


## License

This ClickSend node for n8n is licensed under the [MIT License](LICENSE).

## Acknowledgments

- This node is not officially affiliated with ClickSend and is provided as a community contribution.

## Support

For assistance or issues, please [raise a GitHub issue](https://github.com/your-repository/clicksend-node/issues).

