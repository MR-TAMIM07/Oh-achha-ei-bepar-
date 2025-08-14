const { getTime, drive } = global.utils;

module.exports = {
	config: {
		name: "leave",
		version: "2.3",
		author: "Tamim (Shadow Hokage)",
		category: "events"
	},

	langs: {
		en: { // only session names in English
			session1: "Morning",
			session2: "Noon",
			session3: "Afternoon",
			session4: "Evening",
			leaveType1: "নিজে চলে গেছে",
			leaveType2: "কিক খেয়েছে",
			defaultLeaveMessages: [
				"⚜ {session} 💔\n\n💠 {userNameTag} ভাই/আপু গ্রুপ ছেড়ে চলে গেছে… এখন গ্রুপ শান্ত 🥲",
				"📢 খবর! {userNameTag} {type} — ওহ দুঃখিত, এখন কে মজা আনবে? 😏",
				"💀 RIP {userNameTag} — গ্রুপে থাকার লাইসেন্স বাতিল 😈",
				"📦 {userNameTag} কে গ্রুপের বাইরে পাঠানো হলো 🚪",
				"😿 {userNameTag} চলে গেলো… সবাই হাততালি 😞",
				"⚠️ সতর্কতা: {userNameTag} {type} — গ্রুপে শান্তি ফিরে এসেছে 🕊"
			]
		}
	},

	onStart: async ({ threadsData, message, event, api, usersData, getLang }) => {
		if (event.logMessageType !== "log:unsubscribe") return;

		const { threadID } = event;
		const threadData = await threadsData.get(threadID);
		if (!threadData?.settings?.sendLeaveMessage) return;

		const { leftParticipantFbId } = event.logMessageData;
		if (leftParticipantFbId == api.getCurrentUserID()) return;

		const hours = parseInt(getTime("HH"));
		const userName = await usersData.getName(leftParticipantFbId);

		// Pick random message
		const leaveMessages = getLang("defaultLeaveMessages");
		let leaveMessage = leaveMessages[Math.floor(Math.random() * leaveMessages.length)];

		// Replace placeholders
		leaveMessage = leaveMessage
			.replace(/\{userName\}|\{userNameTag\}/g, userName)
			.replace(/\{type\}/g, leftParticipantFbId == event.author ? getLang("leaveType1") : getLang("leaveType2"))
			.replace(/\{session\}/g,
				hours <= 10 ? getLang("session1") :
				hours <= 12 ? getLang("session2") :
				hours <= 18 ? getLang("session3") : getLang("session4")
			);

		// Prepare message
		const form = {
			body: leaveMessage,
			mentions: [{
				id: leftParticipantFbId,
				tag: userName
			}]
		};

		// Send
		message.send(form);
	}
};
