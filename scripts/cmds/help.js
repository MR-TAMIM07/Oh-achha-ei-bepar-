fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "2.0",
    author: "𓆩𝐂.𝐄.𝐎⸙𝐓𝐀𝐌𝐈𝐌𓆪",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Stylish help menu with command details",
    },
    longDescription: {
      en: "View usage and list all commands in a stylish way",
    },
    category: "info",
    guide: {
      en: "{pn} / help [cmdName]",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      const categories = {};
      let msg = "╭━━━『 ✨ 𝐓𝐀𝐌𝐈𝐌 𝐁𝐎𝐓 𝐂𝐌𝐃 𝐋𝐈𝐒𝐓 ✨ 』━━━╮";

      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;

        const category = value.config.category || "Uncategorized";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(name);
      }

      Object.keys(categories).forEach((category) => {
        if (category !== "info") {
          msg += `\n\n✧ 『 ${category.toUpperCase()} 』 ✧`;

          const names = categories[category].commands.sort();
          for (let i = 0; i < names.length; i += 3) {
            const cmds = names.slice(i, i + 3).map((item) => `✦ ${item}`);
            msg += `\n${cmds.join("   ")}`;
          }
          msg += `\n━━━━━━━━━━━━━━━`;
        }
      });

      const totalCommands = commands.size;
      msg += `\n\n📌 𝗧𝗼𝘁𝗮𝗹 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀: ${totalCommands}`;
      msg += `\n🌟 𝗨𝘀𝗲: ${prefix}help [command]`;
      msg += `\n\n╰━━━『 🩶 ᴛᴀᴍɪᴍ_ʙᴏᴛ 🎀 』━━━╯`;

      const helpMedia = [ 
        "https://files.catbox.moe/gyt9g2.mp4", 
        "https://files.catbox.moe/gyt9g2.mp4" 
      ];
      const media = helpMedia[Math.floor(Math.random() * helpMedia.length)];

      await message.reply({
        body: msg,
        attachment: await global.utils.getStreamFromURL(media)
      });
    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`⚠️ Command "${commandName}" not found.`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "Unknown";

        const longDescription = configCommand.longDescription ? configCommand.longDescription.en || "No description" : "No description";
        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

        const response = `
╭━━━━━━━━━━━━━━『 ⸙ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐈𝐍𝐅𝐎 ⸙ 』━━━━━━━━━━━━━━╮
┃ 🌟 𝐍𝐀𝐌𝐄        : ${configCommand.name}
┃ 🌟 𝐃𝐄𝐒𝐂𝐑𝐈𝐏𝐓𝐈𝐎𝐍 : ${longDescription}
┃ 🌟 𝐀𝐔𝐓𝐇𝐎𝐑      : ${author}
┃ 🌟 𝐔𝐒𝐀𝐆𝐄       : ${usage}
┃ 🌟 𝐕𝐄𝐑𝐒𝐈𝐎𝐍     : ${configCommand.version || "1.0"}
┃ 🌟 𝐑𝐎𝐋𝐄        : ${roleText}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

        await message.reply(response);
      }
    }
  },
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0: return "0 (All users)";
    case 1: return "1 (Group admins)";
    case 2: return "2 (Bot admin)";
    default: return "Unknown role";
  }
}
