const axios = require('axios');
const path = require('path');
const fs = require('fs');

module.exports = {
  config: {
    name: "album",
    version: "1.0.0",
    role: 0,
    author: "𝙏𝘼𝙈𝙄𝙈 🎀", // Don't Change Author name.
    longDescription: "Displays album options for selection.",
    category: "𝗠𝗘𝗗𝗜𝗔",
    countDown: 5,
    guide: {
      en: "{p}{n} or add [cartoon/photo/lofi/sad/islamic/funny/horny/anime]"
    }
  },

  onStart: async function ({ api, Reply, event, message, args }) {
    if (!args[0]) {
      api.setMessageReaction("😘", event.messageID, (err) => {}, true);

      const albumOptions = [
        "𝗙𝘂𝗻𝗻𝘆 𝘃𝗶𝗱𝗲𝗼",
        "𝗜𝘀𝗹𝗮𝗺𝗶𝗰 𝘃𝗶𝗱𝗲𝗼",
        "𝗦𝗮𝗱 𝘃𝗶𝗱𝗲𝗼",
        "𝗔𝗻𝗶𝗺𝗲 𝘃𝗶𝗱𝗲𝗼",
        "𝗖𝗮𝗿𝘁𝗼𝗼𝗻 𝘃𝗶𝗱𝗲𝗼",
        "𝗟𝗼𝗙𝗶 𝗩𝗶𝗱𝗲𝗼",
        "𝗛𝗼𝗿𝗻𝘆 𝘃𝗶𝗱𝗲𝗼",
        "𝗖𝗼𝘂𝗽𝗹𝗲 𝗩𝗶𝗱𝗲𝗼",
        "𝗖𝘂𝘁𝗲 𝗕𝗮𝗯𝘆 𝗩𝗶𝗱𝗲𝗼",
        "𝗦𝗶𝗴𝗺𝗮 𝗥𝘂𝗹𝗲",
        "𝗟𝘆𝗿𝗶𝗰𝘀 𝗩𝗶𝗱𝗲𝗼",
        "𝗥𝗮𝗻𝗱𝗼𝗺 𝗣𝗵𝗼𝘁𝗼"
      ];

      const messageText =
        "❤‍🩹 𝗖𝗵𝗼𝗼𝘀𝗲 𝗮𝗻 𝗼𝗽𝘁𝗶𝗼𝗻𝘀 𝗕𝗮𝗯𝘆 <💝\n" +
        "✿━━━━━━━━━━━━━━━━━━━━━━━✿\n" +
        albumOptions.map((option, index) => `${index + 1}. ${option} 📛`).join("\n") +
        "\n✿━━━━━━━━━━━━━━━━━━━━━━━✿";

      await api.sendMessage(messageText, event.threadID, (error, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          type: 'reply',
          messageID: info.messageID,
          author: event.senderID,
          link: albumOptions
        });
      }, event.messageID);

      return; // Stop here if no args[0]
    }

    // Valid commands list
    const validCommands = ['cartoon', 'photo', 'lofi', 'sad', 'islamic', 'funny', 'horny', 'anime', 'love', 'baby', 'lyrics', 'sigma', 'photo'];

    api.setMessageReaction("👀", event.messageID, (err) => {}, true);

    // List command to show total videos
    if (args[0] === 'list') {
      try {
        const lRes = await axios.get(`https://zzxfh5-3000.csb.app/data?list=dipto`);
        const data = lRes.data;
        api.sendMessage(`🖤 𝗧𝗼𝘁𝗮𝗹 𝘃𝗶𝗱𝗲𝗼 𝗮𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗶𝗻 𝗮𝗹𝗯𝘂𝗺 🩵\n${data.data}`, event.threadID, event.messageID);
      } catch (error) {
        api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
      }
      return;
    }

    // Validate second argument and reply message with attachment
    if (!args[1] || !validCommands.includes(args[1].toLowerCase())) {
      return api.sendMessage("Please specify a valid category: cartoon/photo/lofi/sad/islamic/funny/horny/anime/love/baby/lyrics/sigma", event.threadID, event.messageID);
    }

    if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
      return api.sendMessage("Please reply to a message containing an image or video to add.", event.threadID, event.messageID);
    }

    const attachment = event.messageReply.attachments[0].url;
    const URL = attachment;
    const cmd = args[1].toLowerCase();

    // Map command to query string
    const queryMap = {
      cartoon: 'addVideo',
      photo: 'addPhoto',
      lofi: 'addLofi',
      sad: 'addSad',
      funny: 'addFunny',
      islamic: 'addIslamic',
      horny: 'addHorny',
      anime: 'addAnime',
      love: 'addLove',
      lyrics: 'addLyrics',
      baby: 'addBaby',
      sigma: 'addSigma'
    };

    let query = queryMap[cmd] || null;

    if (!query) {
      return api.sendMessage("Invalid category specified.", event.threadID, event.messageID);
    }

    try {
      // Get imgur link from the URL
      const response = await axios.get(`https://d1p-imgur.onrender.com/dip?url=${encodeURIComponent(URL)}`);
      const imgurLink = response.data.data;

      // Check file extension
      const fileExtension = path.extname(imgurLink).toLowerCase();
      let query2;

      if (['.jpg', '.jpeg', '.png'].includes(fileExtension)) {
        query2 = 'addPhoto';
      } else if (fileExtension === '.mp4') {
        query2 = query;
      } else {
        api.sendMessage('Invalid file format. Only jpg, jpeg, png, and mp4 are supported.', event.threadID, event.messageID);
        return;
      }

      // Save the media to server using the appropriate query param
      const svRes = await axios.get(`https://zzxfh5-3000.csb.app/data?${query2}=${imgurLink}`);
      const data = svRes.data;

      api.sendMessage(`✅ | ${data.data}\n\n🔰 | ${data.data2}`, event.threadID, event.messageID);
    } catch (error) {
      console.error('Error:', error);
      api.sendMessage(`Failed to convert media.\n${error.message}`, event.threadID, event.messageID);
    }
  },

  onReply: async function ({ api, event, Reply }) {
    api.unsendMessage(Reply.messageID);
    if (event.type !== "message_reply") return;

    const reply = parseInt(event.body.trim());
    if (isNaN(reply) || reply < 1 || reply > 12) {
      return api.sendMessage("Please reply with a number between 1 and 12.", event.threadID, event.messageID);
    }

    const optionsMap = {
      1: { query: "funny", text: "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗙𝘂𝗻𝗻𝘆 𝘃𝗶𝗱𝗲𝗼 <🤣" },
      2: { query: "islamic", text: "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗜𝘀𝗹𝗮𝗺𝗶𝗰 𝘃𝗶𝗱𝗲𝗼 <😇" },
      3: { query: "sad", text: "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗦𝗮𝗱 𝘃𝗶𝗱𝗲𝗼 <🥺" },
      4: { query: "anime", text: "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗮𝗻𝗶𝗺𝗲 𝘃𝗶𝗱𝗲𝗼 <😘" },
      5: { query: "video", text: "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗖𝗮𝗿𝘁𝗼𝗼𝗻 𝘃𝗶𝗱𝗲𝗼 <😇" },
      6: { query: "lofi", text: "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗟𝗼𝗳𝗶 𝘃𝗶𝗱𝗲𝗼 <😇" },
      7: { query: "horny", text: "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗛𝗼𝗿𝗻𝘆 𝘃𝗶𝗱𝗲𝗼 <🥵" },
      8: { query: "love", text: "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗟𝗼𝘃𝗲 𝘃𝗶𝗱𝗲𝗼 <😍" },
      9: { query: "baby", text: "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗖𝘂𝘁𝗲 𝗕𝗮𝗯𝘆 𝘃𝗶𝗱𝗲𝗼 <🧑‍🍼" },
      10: { query: "sigma", text: "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗦𝗶𝗴𝗺𝗮 𝘃𝗶𝗱𝗲𝗼 <🐤" },
      11: { query: "lyrics", text: "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗟𝘆𝗿𝗶𝗰𝘀 𝘃𝗶𝗱𝗲𝗼 <🥰" },
      12: { query: "photo", text: "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗥𝗮𝗻𝗱𝗼𝗺 𝗣𝗵𝗼𝘁𝗼 <😙" }
    };

    const { query, text: cp } = optionsMap[reply];

    try {
      const res = await axios.get(`https://zzxfh5-3000.csb.app/data?type=${query}`);
      const imgUrl = res.data.data;
      const imgRes = await axios.get(imgUrl, { responseType: 'arraybuffer' });

      const filename = path.join(__dirname, 'cache', `${Date.now()}_${Math.floor(Math.random() * 10000)}.mp4`);
      fs.writeFileSync(filename, Buffer.from(imgRes.data, 'binary'));

      api.sendMessage({
        body: cp,
        attachment: fs.createReadStream(filename),
      }, event.threadID, () => fs.unlinkSync(filename), event.messageID);
    } catch (error) {
      api.sendMessage('An error occurred while fetching the media.', event.threadID, event.messageID);
    }
  }
};
