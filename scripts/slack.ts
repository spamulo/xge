// Require the Bolt package (github.com/slackapi/bolt)
// const { App } = require("@slack/bolt");
import { App } from "@slack/bolt"
const token = process.env.SLACK_BOT_TOKEN
const signingSecret = process.env.SLACK_BOT_SECRET

const slackDisabled = process.env.SLACK_DISABLED

const app = new App({
	token,
	signingSecret
});

export async function sendMessage(msg) {
	if (slackDisabled || !token) {
		console.log('Did not send message, slack disabled');
		console.log(msg)
	} else {
		await app.client.chat.postMessage({ token, channel: '#sge-build', text: msg })

	}
}

export default {
	sendMessage
}