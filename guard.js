const config = require("./config");
const rules = require("./rules");
const { isNuke } = require("./antinuke");

function isAdmin(userId) {
  return config.ADMINS.includes(userId);
}

function hasLink(text = "") {
  return /(https?:\/\/|line\.me\/R\/ti\/g)/i.test(text);
}

module.exports = async function guard(event, client) {
  if (!event.source.groupId) return;

  const groupId = event.source.groupId;
  const userId = event.source.userId;

  if (isAdmin(userId)) return;

  const group = rules.getGroup(groupId);

  /* 🚨 Anti-Nuke */
  if (event.type === "message") {
    if (isNuke(userId)) {
      await client.kick(groupId, [userId]);
      await client.replyMessage(event.replyToken, {
        type: "text",
        text: "🚨 Anti-Nuke ตรวจพบการถล่มกลุ่ม"
      });
      return;
    }
  }

  /* 🔗 กันลิงก์ */
  if (
    group.rules.link &&
    event.type === "message" &&
    event.message.type === "text" &&
    hasLink(event.message.text)
  ) {
    await client.kick(groupId, [userId]);
    return;
  }

  /* 🧩 กัน Flex */
  if (
    group.rules.flex &&
    event.type === "message" &&
    event.message.type === "flex"
  ) {
    await client.kick(groupId, [userId]);
    return;
  }

  /* 👥 กันคนเข้าใหม่ */
  if (
    group.rules.join &&
    event.type === "memberJoined"
  ) {
    await client.kick(
      groupId,
      event.joined.members.map(m => m.userId)
    );
  }
};
