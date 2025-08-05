const axios = require("axios");
const { getTime } = global.utils;

if (!global.temp.welcomeEvent) global.temp.welcomeEvent = {};

module.exports = {
  config: {
    name: "welcome",
    version: "2.1",
    author: "𝐓𝐚𝐦𝐢𝐦",
    category: "events"
  },

  langs: {
    en: {
      session1: "𝑴𝒐𝒓𝑵𝒊𝒏𝑮 🌅",
      session2: "𝑵𝒐𝒐𝑵 ☀️",
      session3: "𝑨𝒇𝒕𝒆𝑹𝒏𝒐𝒐𝑵 🌤️",
      session4: "𝑬𝒗𝒆𝑵𝒊𝒏𝑮 🌆",
      session5: "𝑵𝒊𝒈𝑯𝒕 🌙",
      welcomeMessage:
        `💮 𝐀𝐒𝐒𝐀𝐋𝐀𝐌𝐔𝐀𝐋𝐀𝐈𝐊𝐔𝐌 ꨄ︎\n` +
        `\n🔗 𝑩𝒐𝒕 𝑪𝒐𝒏𝒏𝒆𝒄𝒕𝒆𝒅 𝑻𝒐 𝑻𝒉𝒆 𝑮𝒓𝒐𝒖𝒑!` +
        `\n🔹 𝑷𝒓𝒆𝒇𝒊𝒙: %1` +
        `\n🧑‍💻 𝑶𝒘𝒏𝒆𝒓: https://www.facebook.com/its.x.tamim` +
        `\n💬 𝑭𝒐𝒓 𝑪𝒐𝒎𝒎𝒂𝒏𝒅𝒔 𝑼𝒔𝒆: %1help`,
      multiple1: "𝑻𝒐 𝑻𝒉𝑬",
      multiple2: "𝑻𝒐 𝑶𝒖𝑹",
      defaultWelcomeMessage:
        `🌸 𝐀𝐒𝐒𝐀𝐋𝐀𝐌𝐔𝐀𝐋𝐀𝐈𝐊𝐔𝐌 ꨄ︎\n\n` +
        `👋 𝐇𝐞𝐥𝐥𝐨 {userNameTag}\n` +
        `🌟 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 {multiple} 𝐂𝐡𝐚𝐭 𝐆𝐫𝐨𝐮𝐩: 『{boxName}』\n` +
        `🕒 𝐇𝐚𝐯𝐞 𝐀 𝐁𝐥𝐞𝐬𝐬𝐞𝐝 {session} 💫`
    }
  },

  onStart: async ({ threadsData, message, event, api, getLang }) => {
    if (event.logMessageType !== "log:subscribe") return;

    const hours = parseInt(getTime("HH"));
    const { threadID } = event;
    const prefix = global.utils.getPrefix(threadID);
    const dataAddedParticipants = event.logMessageData.addedParticipants;
    const { nickNameBot } = global.GoatBot.config;

    // Bot joined
    if (dataAddedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
      if (nickNameBot)
        api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());

      const image = (await axios.get("https://files.catbox.moe/77ww0u.jpg", { responseType: "stream" })).data;

      return message.send({
        body: getLang("welcomeMessage", prefix),
        attachment: image
      });
    }

    // New member(s) join
    if (!global.temp.welcomeEvent[threadID])
      global.temp.welcomeEvent[threadID] = {
        joinTimeout: null,
        dataAddedParticipants: []
      };

    global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
    clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

    global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async () => {
      const threadData = await threadsData.get(threadID);
      if (threadData?.settings?.sendWelcomeMessage === false) return;

      const data = global.temp.welcomeEvent[threadID].dataAddedParticipants;
      const bannedList = threadData.data.banned_ban || [];
      const threadName = threadData.threadName;
      const userName = [], mentions = [];
      const multiple = data.length > 1;

      for (const user of data) {
        if (bannedList.some(i => i.id == user.userFbId)) continue;
        userName.push(user.fullName);
        mentions.push({ tag: user.fullName, id: user.userFbId });
      }

      if (!userName.length) return;

      let { welcomeMessage = getLang("defaultWelcomeMessage") } = threadData.data;

      const form = {
        mentions: welcomeMessage.includes("{userNameTag}") ? mentions : null
      };

      welcomeMessage = welcomeMessage
        .replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
        .replace(/\{boxName\}|\{threadName\}/g, threadName)
        .replace(/\{multiple\}/g, multiple ? getLang("multiple2") : getLang("multiple1"))
        .replace(/\{session\}/g,
          hours <= 10 ? getLang("session1") :
          hours <= 12 ? getLang("session2") :
          hours <= 18 ? getLang("session3") :
          hours <= 20 ? getLang("session4") : getLang("session5")
        );

      form.body = welcomeMessage;

      const staticImage = (await axios.get("https://files.catbox.moe/77ww0u.jpg", { responseType: "stream" })).data;

      const profilePics = await Promise.allSettled(
        mentions.map(user =>
          axios.get(
            `https://graph.facebook.com/${user.id}/picture?height=720&width=720&access_token=${api.getAccessToken()}`,
            { responseType: "stream" }
          ).then(res => res.data)
        )
      );

      form.attachment = profilePics
        .filter(r => r.status === "fulfilled")
        .map(r => r.value)
        .concat(staticImage);

      await message.send(form);
      delete global.temp.welcomeEvent[threadID];
    }, 1500);
  }
};
