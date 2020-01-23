import Discord from "discord.js";
import config from "./config.json";

const Client = new Discord.Client();
const { guildIDs, updateInterval, text } = config;

function getClockEmoji({ h, m }) {
  return m < 30 ? text.clock.zero[h] : text.clock.half[h];
}

function getTime() {
  const date = new Date();
  const h = `${date.getUTCHours()}`.padStart(2, "0");
  const m = `${date.getUTCMinutes()}`.padStart(2, "0");
  const s = `${date.getUTCSeconds()}`.padStart(2, "0");

  return { h, m, s };
}

function timeRun(channel) {
  if (!channel) {
    console.log(text.getChannelError);
    return;
  }

  Client.setInterval(() => {
    const { h, m, s } = getTime();
    channel.edit({ name: `${getClockEmoji({ h, m })} UTC: ${h}-${m}-${s}` }).catch(err => console.log(err));
  }, updateInterval);
}

Client.on("ready", () => {
  console.log(text.botReady);

  guildIDs.forEach(guildID => {
    const guild = Client.guilds.get(guildID);
    const channel = guild.channels.array().find(({ name, type }) => type === "voice" && name.includes("UTC: "));

    if (!channel) {
      const { h, m, s } = getTime();
      guild
        .createChannel(`${getClockEmoji({ h, m })} UTC: ${h}-${m}-${s}`, {
          type: "voice"
        })
        .then(ch => {
          ch.overwritePermissions(guild.roles.get(guildID), { CONNECT: false }).catch(err => console.log(err));
          timeRun(ch);
        })
        .catch(err => console.log(err));
    } else {
      timeRun(channel);
    }
  });
});

Client.login(process.argv[2] || process.env.BOT_TOKEN);
