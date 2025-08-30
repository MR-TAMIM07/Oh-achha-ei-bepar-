const axios = require("axios");
const { getTime } = global.utils;

if (!global.temp.welcomeEvent) global.temp.welcomeEvent = {};

module.exports = {
  config: {
    name: "welcome",
    version: "5.0",
    author: "𝐓𝐀𝐌𝐈𝐌࿐",
    category: "events"
  },

  langs: {
    en: {
      session1: "𝑴𝒐𝒓𝑵𝒊𝒏𝑮 🌅",
      session2: "𝑵𝒐𝒐𝑵 ☀️",
      session3: "𝑨𝒇𝒕𝒆𝑹𝒏𝒐𝒐𝑵 🌤️",
      session4: "𝑬𝒗𝒆𝑵𝒊𝑮 🌆",
      session5: "𝑵𝒊𝒈𝑯𝒕 🌙",
      multiple1: "𝑻𝒐 𝑻𝒉𝑬",
      multiple2: "𝑻𝒐 𝑶𝒖𝑹"
    }
  },

  onStart: async ({ threadsData, message, event, api, getLang }) => {
    if (event.logMessageType !== "log:subscribe") return;

    const hours = parseInt(getTime("HH"));
    const { threadID } = event;
    const prefix = global.utils.getPrefix(threadID);
    const dataAddedParticipants = event.logMessageData.addedParticipants;
    const { nickNameBot } = global.GoatBot.config;

    // Auto enable welcome
    await threadsData.set(threadID, {
      settings: {
        sendWelcomeMessage: true
      }
    });

    // Bot join
    if (dataAddedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
      if (nickNameBot)
        api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());

      const video = (await axios.get("https://files.catbox.moe/7vzv8w.mp4", { responseType: "stream" })).data;

      return message.send({
        body:
          `⸙ 𝐀𝐒𝐒𝐀𝐋𝐀𝐌𝐔𝐀𝐋𝐀𝐈𝐊𝐔𝐌 ♡\n\n` +
          `⸙ ♡𝐁𝐎𝐓 𝐂𝐎𝐍𝐍𝐄𝐂𝐓𝐄𝐃 𝐓𝐎 𝐓𝐇𝐄 𝐆𝐑𝐎𝐔𝐏༊\n` +
          `⸙  𝗣𝗥𝗘𝗙𝗜𝗫: ${prefix}\n` +
          `⸙ 𝑶𝑾𝑵𝑬𝑹: https://www.facebook.com/its.x.tamim\n` +
          `⸙ 𝐅𝐎𝐑 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 𝐔𝐒𝐄: ${prefix}help`,
        attachment: video
      });
    }

    // New members join
    if (!global.temp.welcomeEvent[threadID])
      global.temp.welcomeEvent[threadID] = {
        joinTimeout: null,
        dataAddedParticipants: []
      };

    global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
    clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

    global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async () => {
      const threadData = await threadsData.get(threadID);
      const data = global.temp.welcomeEvent[threadID].dataAddedParticipants;
      const bannedList = threadData.data.banned_ban || [];
      const threadName = threadData.threadName;
      const threadInfo = await api.getThreadInfo(threadID);
      const memberCount = threadInfo.participantIDs.length;

      const userName = [], mentions = [];
      const multiple = data.length > 1;

      for (const user of data) {
        if (bannedList.some(i => i.id == user.userFbId)) continue;
        userName.push(user.fullName);
        mentions.push({ tag: user.fullName, id: user.userFbId });
      }

      if (!userName.length) return;

      // Adder info
      const adderID = event.author;
      const adderName = (await api.getUserInfo(adderID))[adderID]?.name || "Someone";
      mentions.push({ tag: adderName, id: adderID });

      // Random gif/video
      const mediaList = [
        "https://files.catbox.moe/rwec8f.gif",
        "https://files.catbox.moe/rwec8f.gif",
        "https://files.catbox.moe/rwec8f.gif"
      ];
      const randomMedia = mediaList[Math.floor(Math.random() * mediaList.length)];

      const session =
        hours <= 10 ? getLang("session1") :
        hours <= 12 ? getLang("session2") :
        hours <= 18 ? getLang("session3") :
        hours <= 20 ? getLang("session4") : getLang("session5");

      const bannerMessage =
        `╭━━━━〔 ✨ 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 ✨ 〕━━━━╮\n` +
        `┃ 👋 𝐇𝐄𝐋𝐋𝐎: {userNameTag}\n` +
        `┃ 🌟 𝐆𝐑𝐎𝐔𝐏: 『${threadName}』\n` +
        `┃ 🕒 𝐓𝐈𝐌𝐄: ${session}\n` +
        `┃ 👤 𝐀𝐃𝐃𝐄𝐃 𝐁𝐘: ${adderName}\n` +
        `┃ 📊 𝐌𝐄𝐌𝐁𝐄𝐑𝐒: ${memberCount}\n` +
        `╰━━━━━━━━━━━━━━━━━━━━━━━╯\n` +
        `𓆩𝐂.𝐄.𝐎⸙𝐓𝐀𝐌𝐈𝐌𓆪`;

      const form = {
        body: bannerMessage.replace(/\{userNameTag\}/g, userName.join(", ")),
        mentions,
        attachment: (await axios.get(randomMedia, { responseType: "stream" })).data
      };

      await message.send(form);
      delete global.temp.welcomeEvent[threadID];
    }, 1500);
  }
};
