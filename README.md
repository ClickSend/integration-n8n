# n8n-nodes-clicksendsms

An [n8n](https://n8n.io) community node that lets you use [ClickSend](https://www.clicksend.com) inside your n8n workflows to send SMS, MMS, Fax, Voice messages, Letters, and Postcards — and to trigger workflows when an inbound SMS is received.

---

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Getting ClickSend Credentials](#getting-clicksend-credentials)
- [Configuration in n8n](#configuration-in-n8n)
- [Node Parameters](#node-parameters)
- [Trigger Node](#trigger-node)
- [Usage Examples](#usage-examples)
- [Error Handling](#error-handling)
- [Support](#support)

---

## Features

**Action node:**
- Send SMS
- Send SMS to a Contact List

**Trigger node:**
- Receive inbound SMS via webhook

---

## Requirements

- An active [ClickSend account](https://www.clicksend.com)
- Your ClickSend **username** (the email you signed up with) and **API key**
- n8n v0.200.0 or later

---

## Installation

### In n8n (recommended)

1. Open n8n and go to **Settings → Community Nodes**
2. Click **Install**
3. Enter `n8n-nodes-clicksendsms` and click **Install**
4. Restart n8n

### Manual / self-hosted

```bash
npm install n8n-nodes-clicksendsms
```

Then restart n8n.

---

## Getting ClickSend Credentials

You need two things from your ClickSend account: your **username** and your **API key**.

### Step 1 — Log in to ClickSend

Go to [https://dashboard.clicksend.com](https://dashboard.clicksend.com) and log in.

### Step 2 — Find your API key

1. Click your name or avatar in the top-right corner
2. Select **Account → Subaccounts & API** from the menu  
   (Direct link: [https://dashboard.clicksend.com/account/subaccounts](https://dashboard.clicksend.com/account/subaccounts))
3. You will see your **Username** (your login email) and **API Key** listed on this page
4. Copy both values

> **Tip:** If you want a dedicated key, create a new subaccount on the same page and use that subaccount's username + API key instead.

---

## Configuration in n8n

1. In your n8n workflow, add a **ClickSend** node
2. Click **Create new credential** (or select an existing one)
3. In the credential form:
   - **ClickSend Username** — paste your ClickSend login email
   - **ClickSend API Key** — paste the API key from the dashboard
4. Click **Save**
5. n8n will test the credential automatically by calling `GET /v3/account`

---

## Node Parameters

### Send SMS

| Field | Required | Description |
|---|---|---|
| Sender / From | No | Select from your purchased dedicated numbers, own numbers, or alpha tags. Leave blank to use ClickSend's free shared numbers. |
| Recipient / To | Yes | Recipient phone number in international format, e.g. `+61411111111` |
| Message Body | Yes | SMS text. Standard SMS is 160 characters. |
| Schedule | No | Date/time to send the message. Leave blank to send immediately. |
| Custom String | No | Your internal reference tag (max 50 chars), e.g. `order_123` |

### Send SMS to a Contact List

| Field | Required | Description |
|---|---|---|
| Sender / From | No | Same as above |
| Contact List | Yes | Select a contact list from your ClickSend account |
| Message Body | Yes | SMS text |
| Schedule | No | Optional scheduled send time |
| Custom String | No | Internal reference tag |

### Send MMS

| Field | Required | Description |
|---|---|---|
| Sender / From | No | Sender number |
| Recipient / To | Yes | Recipient number in international format |
| Subject Line | Yes | Subject of the MMS |
| Image URL | Yes | Publicly accessible URL of the image or GIF |
| Message Body | Yes | Text body of the MMS (max 1500 characters) |

### Send Fax

| Field | Required | Description |
|---|---|---|
| Sender / From | No | Sender fax number |
| Recipient / To | Yes | Recipient fax number in international format |
| Image URL | Yes | Publicly accessible URL of the document to fax |
| Schedule | No | Optional scheduled send time |

### Send Voice Message

| Field | Required | Description |
|---|---|---|
| Recipient / To | Yes | Recipient phone number |
| Message Body | Yes | The text that will be read aloud |
| Voice Type | Yes | `Male` or `Female` |
| Language | Yes | Select the language that matches your message text |
| Schedule | No | Optional scheduled send time |

### Send Letter

| Field | Required | Description |
|---|---|---|
| Letter URL | Yes | Publicly accessible URL of the PDF letter |
| Recipient Name | Yes | Full name of the recipient |
| Address Line 1 | Yes | Street address |
| Address Line 2 | No | Apartment/suite/unit (optional) |
| City | Yes | City |
| State | Yes | State or province |
| Postal Code | Yes | Postcode / ZIP code |
| Country | Yes | Select country from dropdown |
| Return Address | Yes | Select a return address from your ClickSend account |
| Letter Template | Yes | `Yes` if using a ClickSend letter template |
| Colour Printing | Yes | `Yes` for colour, `No` for black & white |
| Double-Sided | Yes | `Yes` for duplex printing |
| Priority Post | Yes | `Yes` to send via priority post |

### Send Postcard

Same address fields as Letter, plus:

| Field | Required | Description |
|---|---|---|
| File URL | Yes | Publicly accessible URL of the postcard image |

---

## Trigger Node

The **ClickSend Trigger** node listens for inbound SMS messages via a webhook.

### How it works

1. Add the **ClickSend Trigger** node to your workflow
2. Enter a **Rule Name** (any label you like, e.g. `My n8n Trigger`)
3. **Activate** the workflow — n8n will automatically register the webhook with ClickSend using your credentials
4. When an SMS is received on your ClickSend number, the payload is forwarded to n8n and the workflow runs
5. When the workflow is **deactivated**, n8n automatically removes the webhook from ClickSend

> **Note:** You need an active ClickSend inbound number for this to work. Purchase one at [https://dashboard.clicksend.com/numbers](https://dashboard.clicksend.com/numbers).

---

## Usage Examples

### Send an SMS

1. Add a **ClickSend** node to your workflow
2. Set **Action** → `Send SMS`
3. Fill in **To** (e.g. `+61411111111`) and **Message Body**
4. Leave **From** blank to use a shared sender, or select your dedicated number
5. Execute the workflow

### Trigger a workflow on inbound SMS

1. Add a **ClickSend Trigger** node as the first node in your workflow
2. Set a **Rule Name**
3. Activate the workflow
4. Send an SMS to your ClickSend inbound number — your workflow will fire with the message data

---

## Error Handling

- **`INVALID_RECIPIENT`** — The recipient number is invalid. Check the format (must be international, e.g. `+61411111111`).
- **`INSUFFICIENT_CREDIT`** — Your ClickSend account is out of credit. Top up at [https://dashboard.clicksend.com/topup](https://dashboard.clicksend.com/topup).
- **401 Unauthorized** — Your credentials are wrong. Re-check your username and API key.
- **Credential test fails** — Make sure you are using your login email as the username, not a display name.

---

## Support

- ClickSend API docs: [https://developers.clicksend.com/docs/rest/v3/](https://developers.clicksend.com/docs/rest/v3/)
- ClickSend Help Centre: [https://help.clicksend.com](https://help.clicksend.com)
- Issues with this node: open a GitHub issue at [https://github.com/ClickSend/integration-n8n/issues](https://github.com/ClickSend/integration-n8n/issues)
