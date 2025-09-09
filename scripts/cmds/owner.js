const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "owner",
    author: "𓆩𝐓𝐚𝐦𝐢𝐦𓆪",
    role: 0,
    shortDescription: "Shows stylish owner info",
    longDescription: "Displays owner details with premium stylish format + video",
    category: "admin",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    try {
      const ownerInfo = {
        name: '💫 𝗜𝗧𝗦 𝗧𝗔𝗠𝗜𝗠 💫',
        gender: '𝗠𝗔𝗟𝗘 ',
        age: '17+ 🌸',
        height: '5,6 ⚡',
        facebookLink: '🌐 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: https://www.facebook.com/its.x.tamim',
        nick: '👑 𝗧𝗔𝗠𝗜𝗠ᰔᩚ'
      };

      const videoUrl = 'https://files.catbox.moe/tgx5i8.mp4';
      const tmpFolderPath = path.join(__dirname, 'tmp');

      if (!fs.existsSync(tmpFolderPath)) fs.mkdirSync(tmpFolderPath);

      const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
      const videoPath = path.join(tmpFolderPath, 'owner_video.mp4');
      fs.writeFileSync(videoPath, Buffer.from(videoResponse.data, 'binary'));

      const response = `
╭─────────────────★
│ 🎀 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 🎀
╰─────────────────★

🌟 𝗡𝗮𝗺𝗲: ${ownerInfo.name}
💠 𝗚𝗲𝗻𝗱𝗲𝗿: ${ownerInfo.gender}
💠 𝗔𝗴𝗲: ${ownerInfo.age}
💠 𝗛𝗲𝗶𝗴𝗵𝘁: ${ownerInfo.height}
${ownerInfo.facebookLink}
💠 𝗡𝗶𝗰𝗸: ${ownerInfo.nick}

═════════════════════
   ✨ 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐓𝐀𝐌𝐈𝐌 ✨
═════════════════════
`;

      await api.sendMessage({
        body: response,
        attachment: fs.createReadStream(videoPath)
      }, event.threadID, () => {
        fs.unlinkSync(videoPath); // delete temp file
      }, event.messageID);

      // React 🎀
      api.setMessageReaction('💫', event.messageID, () => {}, true);

    } catch (error) {
      console.error('Error in owner command:', error);
      return api.sendMessage('⚠️ 𝗦𝗼𝗿𝗿𝘆! 𝗦𝗼𝗺𝗲𝘁𝗵𝗶𝗻𝗴 𝗪𝗲𝗻𝘁 𝗪𝗿𝗼𝗻𝗴.', event.threadID, event.messageID);
    }
  },
};
