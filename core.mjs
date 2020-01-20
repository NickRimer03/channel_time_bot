import Discord from "discord.js";
import config from "./config.json";

const Client = new Discord.Client();
const { channelID } = config;

Client.on("ready", () => {
  console.log("-- channel_time_bot ready");

  const channel = Client.channels.get(channelID);
  const interval = Client.setInterval(() => {
    if (channel) {
      const date = new Date();
      const h = `${date.getUTCHours()}`.padStart(2, "0");
      const m = `${date.getUTCMinutes()}`.padStart(2, "0");
      const s = `${date.getUTCSeconds()}`.padStart(2, "0");
      const name = `${h}-${m}-${s}_🇺🇹🇨`;

      channel.edit({ name });
    } else {
      console.log("-- get channel error");
      Client.clearInterval(interval);
    }
  }, 5000);
});

Client.login(process.argv[2] || process.env.BOT_TOKEN);
