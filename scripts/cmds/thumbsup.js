const fs = require("fs-extra");

module.exports = {
  config: {
    name: "thumbsup",
    version: "1.0",
    author: "Tamim",//don't change author name
    countDown: 5,
    role: 0,
    shortDescription: "👍 দিলে reply দিবে",
    longDescription: "When someone sends 👍 emoji, bot replies with text + image",
    category: "no prefix",
  },

  onStart: async function () {},

  onChat: async function ({ event, message }) {
    if (event.body === "👍") {
      return message.reply({
        body: "এটার মানে আমি রাগ করেছি 😿",
        attachment: await global.utils.getStreamFromURL("https://files.catbox.moe/r3xd3y.jpeg")
      });
    }
  }
};
