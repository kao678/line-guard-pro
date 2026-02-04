require("dotenv").config();
const express = require("express");
const line = require("@line/bot-sdk");
const guard = require("./guard");
const rules = require("./rules");
const config = require("./config");

const app = express();

const client = new line.Client({
  channelAccessToken: process.env.LINE_ACCESS_TOKEN
});

app.post("/webhook", line.middleware({
  channelSecret: process.env.LINE_CHANNEL_SECRET
}), async (req, res) => {

  for (const event of req.body.events) {

    if (
      event.type === "message" &&
      event.message.type === "text" &&
      event.source.groupId
    ) {
      const text = event.message.text.trim();
      const userId = event.source.userId;
      const groupId = event.source.groupId;

      if (config.ADMINS.includes(userId)) {

        if (text === "/on link") {
          rules.setRule(groupId, "link", true);
          await client.replyMessage(event.replyToken, { type: "text", text: "✅ เปิดกันลิงก์" });
          continue;
        }

        if (text === "/off link") {
          rules.setRule(groupId, "link", false);
          await client.replyMessage(event.replyToken, { type: "text", text: "❌ ปิดกันลิงก์" });
          continue;
        }

        if (text === "/on join") {
          rules.setRule(groupId, "join", true);
          await client.replyMessage(event.replyToken, { type: "text", text: "✅ เปิดกันคนเข้า" });
          continue;
        }

        if (text === "/off join") {
          rules.setRule(groupId, "join", false);
          await client.replyMessage(event.replyToken, { type: "text", text: "❌ ปิดกันคนเข้า" });
          continue;
        }

        if (text === "/status") {
          const g = rules.getGroup(groupId);
          await client.replyMessage(event.replyToken, {
            type: "text",
            text: `📊 STATUS\nLink: ${g.rules.link}\nFlex: ${g.rules.flex}\nJoin: ${g.rules.join}`
          });
          continue;
        }
      }
    }

    await guard(event, client);
  }

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("🛡️ LINE GUARD PRO RUNNING");
});
