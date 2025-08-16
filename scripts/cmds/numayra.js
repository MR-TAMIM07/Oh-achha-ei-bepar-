const fs = require("fs-extra");

module.exports = {
  config: {
    name: "numayra",
    version: "1.0",
    author: "Tamim",
    countDown: 5,
    role: 0,
    shortDescription: "No prefix test",
    longDescription: "No prefix command with text + video",
    category: "no prefix",
  },

  onStart: async function () {},
  onChat: async function ({ event, message }) {
    if (event.body && event.body.toLowerCase() === "numayra") {
      return message.reply({
        body: "যখন ছিলো না কেউ আমার করে ছিলে আপন 🫠🎀",
        attachment: await global.utils.getStreamFromURL("https://files.catbox.moe/ue94u6.mp4")
      });
    }
  }
};
