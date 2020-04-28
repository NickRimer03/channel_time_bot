import Discord from "discord.js";
// import config from "./config.json";

const config = {
  "guildIDs": ["614553758734614644", "351366530115698691", "701796455630766232"],
  "updateInterval": 5000,
  "text": {
  "botReady": "-- channel_time_bot ready",
    "getChannelError": "-- get channel error",
    "clock": {
    "zero": {
      "00": "\uD83D\uDD5B",
        "12": "\uD83D\uDD5B",
        "01": "\uD83D\uDD50",
        "13": "\uD83D\uDD50",
        "02": "\uD83D\uDD51",
        "14": "\uD83D\uDD51",
        "03": "\uD83D\uDD52",
        "15": "\uD83D\uDD52",
        "04": "\uD83D\uDD53",
        "16": "\uD83D\uDD53",
        "05": "\uD83D\uDD54",
        "17": "\uD83D\uDD54",
        "06": "\uD83D\uDD55",
        "18": "\uD83D\uDD55",
        "07": "\uD83D\uDD56",
        "19": "\uD83D\uDD56",
        "08": "\uD83D\uDD57",
        "20": "\uD83D\uDD57",
        "09": "\uD83D\uDD58",
        "21": "\uD83D\uDD58",
        "10": "\uD83D\uDD59",
        "22": "\uD83D\uDD59",
        "11": "\uD83D\uDD5A",
        "23": "\uD83D\uDD5A"
    },
    "half": {
      "00": "\uD83D\uDD67",
        "12": "\uD83D\uDD67",
        "01": "\uD83D\uDD5C",
        "13": "\uD83D\uDD5C",
        "02": "\uD83D\uDD5D",
        "14": "\uD83D\uDD5D",
        "03": "\uD83D\uDD5E",
        "15": "\uD83D\uDD5E",
        "04": "\uD83D\uDD5F",
        "16": "\uD83D\uDD5F",
        "05": "\uD83D\uDD60",
        "17": "\uD83D\uDD60",
        "06": "\uD83D\uDD61",
        "18": "\uD83D\uDD61",
        "07": "\uD83D\uDD62",
        "19": "\uD83D\uDD62",
        "08": "\uD83D\uDD63",
        "20": "\uD83D\uDD63",
        "09": "\uD83D\uDD64",
        "21": "\uD83D\uDD64",
        "10": "\uD83D\uDD65",
        "22": "\uD83D\uDD65",
        "11": "\uD83D\uDD66",
        "23": "\uD83D\uDD66"
    }
  }
}
}

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
