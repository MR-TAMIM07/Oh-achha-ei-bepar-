const os = require("os");
const axios = require("axios");

const startTime = new Date();

module.exports = {
  config: {
    name: "uptime",
    aliases: ["up"],
    author: "𓆩𝐂.𝐄.𝐎⸙𝐓𝐀𝐌𝐈𝐌𓆪",
    countDown: 5,
    role: 0,
    category: "⚡System Info⚡",
    shortDescription: "Show stylish uptime",
    longDescription: "Get uptime & system status in anime styled premium design",
  },

  onStart: async function ({ api, event, threadsData, usersData }) {
    try {
      // Runtime
      const uptimeInSeconds = (new Date() - startTime) / 1000;
      const d = Math.floor(uptimeInSeconds / (3600 * 24));
      const h = Math.floor((uptimeInSeconds % (3600 * 24)) / 3600);
      const m = Math.floor((uptimeInSeconds % 3600) / 60);
      const s = Math.floor(uptimeInSeconds % 60);
      const runtime = `${d}d ${h}h ${m}m ${s}s`;

      // System
      const cpuUsage = os.cpus().reduce((a, b) => a + b.times.user, 0) / os.cpus().length;
      const totalMem = os.totalmem() / 1024 ** 3;
      const freeMem = os.freemem() / 1024 ** 3;
      const usedMem = totalMem - freeMem;

      // Users & threads
      const users = await usersData.getAll();
      const threads = await threadsData.getAll();

      // Date & time
      const now = new Date();
      const date = now.toLocaleDateString("en-US");
      const time = now.toLocaleTimeString("en-US", { timeZone: "Asia/Dhaka", hour12: true });

      // Ping
      const pingStart = Date.now();
      await api.sendMessage("⚡ Summoning system status...", event.threadID);
      const ping = Date.now() - pingStart;
      const status = ping < 1000 ? "🌸 Ultra Smooth" : "💀 Lag Detected";

      // Stylish output
      const info = `
✦──────────★──────────✦
        ⚡ 𝗨𝗣𝗧𝗜𝗠𝗘 𝗦𝗧𝗔𝗧𝗨𝗦 ⚡
✦──────────★──────────✦

⏰ Runtime » ${runtime}
💻 OS » ${os.type()} (${os.arch()})
⚙️ CPU » ${os.cpus()[0].model}
💾 Storage » ${usedMem.toFixed(2)} GB / ${totalMem.toFixed(2)} GB
📊 CPU Usage » ${cpuUsage.toFixed(1)}%
📌 RAM Used » ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)} MB

📆 Date » ${date}
🕒 Time » ${time}
👥 Users » ${users.length}
💬 Threads » ${threads.length}
📡 Ping » ${ping}ms
✨ Status » ${status}

✦──────────★──────────✦
   𓆩𝐂.𝐄.𝐎⸙𝐓𝐀𝐌𝐈𝐌𓆪
✦──────────★──────────✦`;

      // Random media
      const videos = [
        "https://files.catbox.moe/01lzcv.mp4",
        "https://files.catbox.moe/01lzcv.mp4",
        "https://files.catbox.moe/01lzcv.mp4"
      ];
      const mediaUrl = videos[Math.floor(Math.random() * videos.length)];
      const res = await axios.get(mediaUrl, { responseType: "stream" });

      api.sendMessage({ body: info, attachment: res.data }, event.threadID);
    } catch (e) {
      console.error("Uptime Error:", e);
      api.sendMessage("⚠️ Error fetching system info!", event.threadID);
    }
  },
};
