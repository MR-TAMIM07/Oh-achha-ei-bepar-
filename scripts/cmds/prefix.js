module.exports = {
  config: {
    name: "prefix",
    version: "4.1",
    author: "Tamim x GPT",
    countDown: 5,
    role: 0,
    shortDescription: "Show bot prefix",
    longDescription: "Display global & group prefix dynamically",
    category: "🌌 Auto System 🌌",
  },

  onStart: async function () {},

  onChat: async function ({ event, message, threadsData }) {
    if (event.body && event.body.toLowerCase() === "prefix") {
      const threadData = await threadsData.get(event.threadID);
      const globalPrefix = global.GoatBot.config.prefix; // Bot's global prefix
      const groupPrefix = threadData?.prefix || globalPrefix; // Show group prefix if set

      return message.reply({
        body: `
┏━━━━━━━━━━━━━━━┓
┃ ✇ 𝗕𝗢𝗧 𝗣𝗥𝗘𝗙𝗜𝗫 ✇
┗━━━━━━━━━━━━━━━┛

🌍 𝐆𝐋𝐎𝐁𝐀𝐋 𝐏𝐑𝐄𝐅𝐈𝐗: 『 ${globalPrefix} 』
💬 𝐆𝐑𝐎𝐔𝐏 𝐏𝐑𝐄𝐅𝐈𝐗: 『 ${groupPrefix} 』

👑 𝗔𝗗𝗠𝗜𝗡
➤ 𓆩𝐂.𝐄.𝐎⸙𝐓𝐀𝐌𝐈𝐌𓆪

🌐 𝙎𝙊𝘾𝙄𝘼𝙇𝙎
➤ ✯ Facebook: 〆 Tʌɱɩɱﮩﮩﮩᰔ

━━━━━━━━━━━━━━━━━━
♢ 𝑻𝒉𝒂𝒏𝒌𝒔 𝑭𝒐𝒓 𝑼𝒔𝒊𝒏𝒈 𝑴𝒆♢
━━━━━━━━━━━━━━━━━━
`,
        attachment: await global.utils.getStreamFromURL(
          "https://files.catbox.moe/xcl5at.mp4"
        ),
      });
    }
  },
};
