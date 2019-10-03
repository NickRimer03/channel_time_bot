import Discord from "discord.js";
import config from "./config.json";

const Client = new Discord.Client();
const { channelID } = config;

Client.on("message", message => {
  const { author, channel, content } = message;

  if (author.bot) {
    return;
  }

  if (content === "clear") {
    channel.bulkDelete(100);
  } else if (content === "id") {
    channel.send(channel.id);
  }
});

Client.on("ready", () => {
  console.log("-- channel_time_bot ready");

  const channel = Client.channels.get(channelID);
  const interval = Client.setInterval(() => {
    if (channel) {
      const date = new Date();
      const h = `${date.getUTCHours()}`.padStart(2, "0");
      const m = `${date.getUTCMinutes()}`.padStart(2, "0");
      const s = `${date.getUTCSeconds()}`.padStart(2, "0");
      const name = `${h}-${m}-${s}_utc`;

      channel.edit({ name });
    } else {
      console.log("-- get channel error");
      Client.clearInterval(interval);
    }
  }, 250);
});

Client.login(process.argv[2] || process.env.BOT_TOKEN);
