const axios = require("axios");
const fs = require("fs");

module.exports = {
  config: {
    name: "pending",
    aliases: ["pen", "pend", "pe"],
    version: "1.8.0",
    author: "♡Modified by 𓆩𝐂.𝐄.𝐎⸙𝐓𝐀𝐌𝐈𝐌𓆪",
    countDown: 5,
    role: 1,
    shortDescription: "Handle pending requests",
    longDescription: "Approve or reject pending users or group requests with style + video 🎥",
    category: "utility",
  },

  onReply: async function ({ message, api, event, Reply, usersData }) {
    const { author, pending, messageID } = Reply;
    if (String(event.senderID) !== String(author)) return;

    const { body, threadID } = event;
    const input = body.trim().toLowerCase();

    if (input === "c") {
      try {
        await api.unsendMessage(messageID);
        return api.sendMessage(`❌ | Operation has been 𝗰𝗮𝗻𝗰𝗲𝗹𝗹𝗲𝗱!`, threadID);
      } catch {
        return;
      }
    }

    const indexes = body.split(/\s+/).map(Number);
    if (isNaN(indexes[0])) {
      return api.sendMessage(`⚠️ | 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗶𝗻𝗽𝘂𝘁! Please try again.`, threadID);
    }

    let count = 0;
    let approvedGroups = [];

    for (const idx of indexes) {
      if (idx <= 0 || idx > pending.length) continue;

      const group = pending[idx - 1];
      try {
        const name = group.name || (await usersData.getName(group.threadID)) || "Unknown Group";

        await api.sendMessage({
          body: `✅ | 𝗚𝗿𝗼𝘂𝗽 𝗔𝗽𝗽𝗿𝗼𝘃𝗲𝗱 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 🎉\n📌 Name: ${name}\n\n📜🎀 Type: ${global.GoatBot.config.prefix}help to see commands!\n🦋 Approved by: 𓆩𝐂.𝐄.𝐎⸙𝐓𝐀𝐌𝐈𝐌𓆪`,
          attachment: await global.utils.getStreamFromURL("https://files.catbox.moe/rhew9e.mp4")
        }, group.threadID);

        await api.changeNickname(
          `${global.GoatBot.config.nickNameBot || "🦋𝙏𝘼𝙈𝙄𝙈✨"}`,
          group.threadID,
          api.getCurrentUserID()
        );

        approvedGroups.push(name);
        count++;
      } catch {
        count++;
      }
    }

    for (const idx of indexes.sort((a, b) => b - a)) {
      if (idx > 0 && idx <= pending.length) {
        pending.splice(idx - 1, 1);
      }
    }

    return api.sendMessage(
      `🎀 | [𝗦𝘂𝗰𝗰𝗲𝘀𝘀] Approved ${count} Group(s) ✨\n${approvedGroups.map((n, i) => `${i + 1}. ${n}`).join("\n")}`,
      threadID
    );
  },

  onStart: async function ({ api, event, args, usersData }) {
    const { threadID, messageID } = event;
    const adminBot = global.GoatBot.config.adminBot;

    if (!adminBot.includes(event.senderID)) {
      return api.sendMessage(`⚠️ | You don't have permission to use this command!`, threadID);
    }

    const type = args[0]?.toLowerCase();
    if (!type) {
      return api.sendMessage(`📌 Usage: pending [user/thread/all]`, threadID);
    }

    let msg = "", index = 1;
    try {
      const spam = (await api.getThreadList(100, null, ["OTHER"])) || [];
      const pending = (await api.getThreadList(100, null, ["PENDING"])) || [];
      const list = [...spam, ...pending];

      let filteredList = [];
      if (type.startsWith("u")) filteredList = list.filter((t) => !t.isGroup);
      if (type.startsWith("t")) filteredList = list.filter((t) => t.isGroup);
      if (type === "all") filteredList = list;

      for (const single of filteredList) {
        const name = single.name || (await usersData.getName(single.threadID)) || "Unknown";
        msg += `【 ${index} 】 ${name}\n`;
        index++;
      }

      msg += `\n🦋 𝗧𝗔𝗠𝗜𝗠, please reply with the correct number(s) to approve.\n✨ Reply with "c" to cancel.`;

      return api.sendMessage(
        `🎀 | [𝗣𝗲𝗻𝗱𝗶𝗻𝗴 ${type.charAt(0).toUpperCase() + type.slice(1)} List] 🎀\n\n${msg}`,
        threadID,
        (error, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            pending: filteredList,
          });
        },
        messageID
      );
    } catch {
      return api.sendMessage(`⚠️ | Failed to retrieve pending list. Please try again later.`, threadID);
    }
  },
};
