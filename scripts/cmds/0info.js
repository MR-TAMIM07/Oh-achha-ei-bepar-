const fs = require('fs');
const moment = require('moment-timezone');

module.exports = {
	config: {
		name: "info",
		version: "1.1",
		author: "𝐓𝐀𝐌𝐈𝐌ღ",
		countDown: 20,
		role: 0,
		shortDescription: { vi: "", en: "" },
		longDescription: { vi: "", en: "" },
		category: "owner",
		guide: { en: "" },
		envConfig: {}
	},
	onStart: async function ({ message }) {
		const authorName = "🎀 ღ⸙𝐓𝐀𝐌𝐈𝐌ღ⸙ 🎀";
		const ownAge = "『 ⸙__17+__⸙ 』";
		const messenger = "https://m.me/its.x.tamim";
		const authorFB = "https://www.facebook.com/its.x.tamim";
		const authorNumber = "_0189*****𝙚𝙧𝙧𝙤𝙧";
		const Status = "ღ__𝙋𝙐𝙍𝘼𝙄 𝙎𝙄𝙉𝙂𝙇𝙀__ღ";
		const urls = [
			"https://files.catbox.moe/0gfdrm.mp4",
			"https://files.catbox.moe/0gfdrm.mp4",
			"https://files.catbox.moe/0gfdrm.mp4",
			"https://files.catbox.moe/0gfdrm.mp4"
		];
		const link = urls[Math.floor(Math.random() * urls.length)];
		const now = moment().tz('Asia/Dhaka');
		const date = now.format('MMMM Do YYYY');
		const time = now.format('h:mm:ss A');
		const uptime = process.uptime();
		const seconds = Math.floor(uptime % 60);
		const minutes = Math.floor((uptime / 60) % 60);
		const hours = Math.floor((uptime / (60 * 60)) % 24);
		const days = Math.floor(uptime / (60 * 60 * 24));
		const uptimeString = `⏳ ${days}d ${hours}h ${minutes}m ${seconds}s`;

		message.reply({
			body: `✨🌸 《 ⸙__𝐁𝐨𝐭 & 𝐎𝐰𝐧𝐞𝐫 𝐈𝐧𝐟𝐨 》⸙ 🌸✨

🤖 𝐁𝐨𝐭 𝐍𝐚𝐦𝐞 : ⩸__${global.GoatBot.config.nickNameBot}__⩸
👾 𝐁𝐨𝐭 𝐏𝐫𝐞𝐟𝐢𝐱 : ${global.GoatBot.config.prefix}

💙 𝐎𝐰𝐧𝐞𝐫 : ${authorName}
📝 𝐀𝐠𝐞 : ${ownAge}
💞 𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧𝐬𝐡𝐢𝐩 : ${Status}
📱 𝐖𝐡𝐚𝐭𝐬𝐚𝐩𝐩 : ${authorNumber}
🌐 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 : ${authorFB}

🗓 𝐃𝐚𝐭𝐞 : ${date}
⏰ 𝐂𝐮𝐫𝐫𝐞𝐧𝐭 𝐓𝐢𝐦𝐞 : ${time}

🔰 𝐍𝐞𝐞𝐝 𝐇𝐞𝐥𝐩? 𝐂𝐨𝐧𝐭𝐚𝐜𝐭 : ⩸__${messenger}__⩸

📊 𝐁𝐨𝐭 𝐔𝐩𝐭𝐢𝐦𝐞 : ${uptimeString}

🌟 𝐓𝐠: https://t.me/@IMTAMIMOK69
🌟 𝐈𝐧𝐬𝐭𝐚: https://www.instagram.com/tamim__4047
🌟 𝐂𝐚𝐩𝐂𝐮𝐭: 𝐬𝐨𝐫𝐫𝐲 >³
🌟 𝐓𝐢𝐤𝐓𝐨𝐤: 𝐭𝐢𝐤𝐭𝐨𝐤 𝐦𝐚𝐫𝐚𝐲 𝐧𝐚
🌟 𝐘𝐨𝐮𝐓𝐮𝐛𝐞: 𝐰𝐚𝐢𝐭 ⚠

─────────────────────`,
			attachment: await global.utils.getStreamFromURL(link)
		});
	},
	onChat: async function ({ event, message, getLang }) {
		if (event.body && event.body.toLowerCase() === "info") {
			this.onStart({ message });
		}
	}
};
