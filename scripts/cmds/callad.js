const { getStreamsFromAttachment, log } = global.utils;
const mediaTypes = ["photo", "png", "animated_image", "video", "audio"];

module.exports = {
  config: {
    name: "callad",
    version: "2.5",
    author: "Tamim x GPT",
    countDown: 5,
    role: 0,
    shortDescription: "📨Contact Admin",
    longDescription: "feedback, bug... directly to bot admins",
    category: "🌌 Stylish System 🌌",
    guide: {
      en: "   {pn} <message>"
    }
  },

  langs: {
    en: {
      missingMessage: "⚠️ | Please enter the message you want to send to admin.",
      sendByGroup: "\n✨ Sent from group: %1\n✨ Thread ID: %2",
      sendByUser: "\n🌟 Sent from user",
      content: "\n\n📝 Content:\n━━━━━━━━━━━━━━━\n%1\n━━━━━━━━━━━━━━━\n💬 Reply this message to send message back to user",
      success: "✅ | Sent your message successfully to %1 admin(s):\n\n%2",
      failed: "❌ | Failed to deliver message to %1 admin(s):\n\n%2\n⚡ Check console for error logs.",
      reply: "📍 Reply from Admin %1:\n━━━━━━━━━━━━━━━\n%2\n━━━━━━━━━━━━━━━\n💬 Reply this message to continue conversation",
      replySuccess: "✅ | Your reply was delivered successfully to the user!",
      feedback: "📝 Feedback from User %1\n🆔 User ID: %2%3\n\n━━━━━━━━━━━━━━━\n%4\n━━━━━━━━━━━━━━━\n💬 Reply this message to respond back",
      replyUserSuccess: "✅ | Your reply was delivered successfully to the admin!",
      noAdmin: "⚠️ | Currently no admin is registered for this bot."
    }
  },

  onStart: async function ({ args, message, event, usersData, threadsData, api, commandName, getLang }) {
    const { config } = global.GoatBot;
    if (!args[0]) return message.reply(getLang("missingMessage"));
    if (config.adminBot.length === 0) return message.reply(getLang("noAdmin"));

    const { senderID, threadID, isGroup } = event;
    const senderName = await usersData.getName(senderID);

    const msgHeader = "🌌 ━━━『 𝗖𝗔𝗟𝗟 𝗔𝗗𝗠𝗜𝗡 』━━━ 🌌";
    const msg = `${msgHeader}`
      + `\n👤 User: ${senderName}`
      + `\n🆔 User ID: ${senderID}`
      + (isGroup ? getLang("sendByGroup", (await threadsData.get(threadID)).threadName, threadID) : getLang("sendByUser"));

    const formMessage = {
      body: msg + getLang("content", args.join(" ")),
      mentions: [{ id: senderID, tag: senderName }],
      attachment: await getStreamsFromAttachment(
        [...event.attachments, ...(event.messageReply?.attachments || [])]
          .filter(item => mediaTypes.includes(item.type))
      )
    };

    const successIDs = [];
    const failedIDs = [];
    const adminNames = await Promise.all(config.adminBot.map(async item => ({
      id: item,
      name: await usersData.getName(item)
    })));

    for (const uid of config.adminBot) {
      try {
        const messageSend = await api.sendMessage(formMessage, uid);
        successIDs.push(uid);

        // 🐸 Auto reaction to notify admin
        api.setMessageReaction("📨", messageSend.messageID, () => {}, true);

        global.GoatBot.onReply.set(messageSend.messageID, {
          commandName,
          messageID: messageSend.messageID,
          threadID,
          messageIDSender: event.messageID,
          type: "userCallAdmin"
        });
      } catch (err) {
        failedIDs.push({ adminID: uid, error: err });
      }
    }

    let msg2 = "";
    if (successIDs.length > 0) {
      msg2 += getLang("success", successIDs.length,
        adminNames.filter(item => successIDs.includes(item.id))
          .map(item => `✨ ${item.name} (@${item.id})`).join("\n")
      );
    }
    if (failedIDs.length > 0) {
      msg2 += "\n\n" + getLang("failed", failedIDs.length,
        failedIDs.map(item =>
          `⚠️ ${adminNames.find(item2 => item2.id === item.adminID)?.name || item.adminID}`
        ).join("\n")
      );
      log.err("CALL ADMIN", failedIDs);
    }

    return message.reply({
      body: msg2,
      mentions: adminNames.map(item => ({ id: item.id, tag: item.name }))
    });
  },

  onReply: async ({ args, event, api, message, Reply, usersData, commandName, getLang }) => {
    const { type, threadID, messageIDSender } = Reply;
    const senderName = await usersData.getName(event.senderID);
    const { isGroup } = event;

    switch (type) {
      case "userCallAdmin": {
        const formMessage = {
          body: getLang("reply", senderName, args.join(" ")),
          mentions: [{ id: event.senderID, tag: senderName }],
          attachment: await getStreamsFromAttachment(
            event.attachments.filter(item => mediaTypes.includes(item.type))
          )
        };

        api.sendMessage(formMessage, threadID, (err, info) => {
          if (err) return message.err(err);
          message.reply(getLang("replyUserSuccess"));

          // ⭐ Auto reaction for admin reply
          api.setMessageReaction("⭐", info.messageID, () => {}, true);

          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            messageIDSender: event.messageID,
            threadID: event.threadID,
            type: "adminReply"
          });
        }, messageIDSender);
        break;
      }

      case "adminReply": {
        let sendByGroup = "";
        if (isGroup) {
          const { threadName } = await api.getThreadInfo(event.threadID);
          sendByGroup = getLang("sendByGroup", threadName, event.threadID);
        }
        const formMessage = {
          body: getLang("feedback", senderName, event.senderID, sendByGroup, args.join(" ")),
          mentions: [{ id: event.senderID, tag: senderName }],
          attachment: await getStreamsFromAttachment(
            event.attachments.filter(item => mediaTypes.includes(item.type))
          )
        };

        api.sendMessage(formMessage, threadID, (err, info) => {
          if (err) return message.err(err);
          message.reply(getLang("replySuccess"));

          // 🦋 Auto reaction for user feedback
          api.setMessageReaction("🦋", info.messageID, () => {}, true);

          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            messageIDSender: event.messageID,
            threadID: event.threadID,
            type: "userCallAdmin"
          });
        }, messageIDSender);
        break;
      }

      default: break;
    }
  }
};
