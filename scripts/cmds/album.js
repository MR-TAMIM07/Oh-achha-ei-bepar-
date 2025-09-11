const axios = require("axios");
const path = require("path");
const fs = require("fs");

// Ensure assets folder exists
const assetsDir = path.join(__dirname, "assets");
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json`
  );
  return base.data.api;
};

module.exports = {
  config: {
    name: "album",
    version: "1.0.2",
    role: 0,
    author: "𓆩𝐂.𝐄.𝐎⸙𝐓𝐀𝐌𝐈𝐌𓆪",
    description: "Displays album options in stylish format ✨",
    category: "Media",
    countDown: 5,
    guide: {
      en: "{p}{n} or add [cartoon/photo/lofi/sad/islamic/funny/horny/anime]",
    },
  },

  onStart: async function ({ api, event, args }) {
    try {
      // --- Show album options if no args ---
      if (!args[0]) {
        api.setMessageReaction("🎀", event.messageID, () => {}, true);

        const albumOptions = [
          "𝗙𝘂𝗻𝗻𝘆 𝘃𝗶𝗱𝗲𝗼",
          "𝗜𝘀𝗹𝗮𝗺𝗶𝗰 𝘃𝗶𝗱𝗲𝗼",
          "𝗦𝗮𝗱 𝘃𝗶𝗱𝗲𝗼",
          "𝗔𝗻𝗶𝗺𝗲 𝘃𝗶𝗱𝗲𝗼",
          "𝗖𝗮𝗿𝘁𝗼𝗼𝗻 𝘃𝗶𝗱𝗲𝗼",
          "𝗟𝗼𝗙𝗶 𝗩𝗶𝗱𝗲𝗼",
          "𝗛𝗼𝗿𝗻𝘆 𝘃𝗶𝗱𝗲𝗼",
          "𝗖𝗼𝘂𝗽𝗹𝗲 𝗩𝗶𝗱𝗲𝗼",
          "𝗙𝗹𝗼𝘄𝗲𝗿 𝗩𝗶𝗱𝗲𝗼",
          "𝗥𝗮𝗻𝗱𝗼𝗺 𝗣𝗵𝗼𝘁𝗼",
        ];

        const message =
          "🌟 𝗛𝗲𝘆 𝗕𝗮𝗯𝘆, 𝗖𝗵𝗼𝗼𝘀𝗲 𝗮𝗻 𝗩𝗶𝗱𝗲𝗼🎀\n" +
          "━━━━━━━━━━━━━━━━━━━━━━━\n" +
          albumOptions.map((option, i) => `➡️ ${i + 1}. ${option}`).join("\n") +
          "\n━━━━━━━━━━━━━━━━━━━━━━━";

        await api.sendMessage(
          message,
          event.threadID,
          (err, info) => {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: this.config.name,
              type: "reply",
              messageID: info.messageID,
              author: event.senderID,
              link: albumOptions,
            });
          },
          event.messageID
        );
      }

      // --- Video / Photo Add ---
      const validCommands = [
        "cartoon","photo","lofi","sad","islamic","funny","horny",
        "anime","love","baby","lyrics","sigma","aesthetic","cat",
        "flower","ff","sex","girl","football","friend",
      ];

      api.setMessageReaction("🎀", event.messageID, () => {}, true);

      const d1 = args[1] ? args[1].toLowerCase() : "";
      if (!d1 || !validCommands.includes(d1)) return;
      if (!event.messageReply || !event.messageReply.attachments) return;

      const attachment = event.messageReply.attachments[0].url;
      let query = d1.startsWith("add") ? d1 : `add${d1.charAt(0).toUpperCase() + d1.slice(1)}`;

      const response = await axios.get(`${await baseApiUrl()}/drive?url=${encodeURIComponent(attachment)}`);
      const fileUrl = response.data.fileUrl;
      const ext = path.extname(fileUrl) || ".mp4";

      const filename = path.join(assetsDir, `dipto_${Date.now()}${ext}`);
      const fileRes = await axios.get(fileUrl, { responseType: "arraybuffer", headers: { "User-Agent": "Mozilla/5.0" } });
      fs.writeFileSync(filename, Buffer.from(fileRes.data, "binary"));

      const sendMsg = {
        body: `✅ 𝗛𝗲𝗿'𝘀 𝗬𝗼𝘂𝗿 𝘃𝗶𝗱𝗲𝗼!\n💌 𝗨𝗿𝗹: ${fileUrl}\n✨ 𝗘𝗻𝗷𝗼𝘆 𝗬𝗼𝘂𝗿 𝗩𝗶𝗱𝗲𝗼!`,
        attachment: fs.createReadStream(filename),
      };

      await api.sendMessage(sendMsg, event.threadID, () => fs.unlinkSync(filename), event.messageID);

    } catch (error) {
      console.error("Album command error:", error);
      api.sendMessage(`❌ 𝗘𝗿𝗿𝗼𝗿: ${error.message}`, event.threadID, event.messageID);
    }
  },
};
