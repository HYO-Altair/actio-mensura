// require the discord.js module
const Discord = require("discord.js");

// Module to read environment variables easily
const dotenv = require("dotenv");
dotenv.config();

const FirebaseHelpers = require("./firebasehelpers");

// create a new Discord client
const client = new Discord.Client();

const prefix = "et! ";

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", async (message) => {
  // Do nothing if it is a bot message
  if (message.author.bot) {
    return;
  }

  switch (message.content) {
    case `${prefix}code`:
      message.reply(`Your access code is ${message.guild.id}`);
      break;

    case `${prefix}reset`:
      FirebaseHelpers.resetDB();
      break;

    case `${prefix}entries`:
      const response = await FirebaseHelpers.numEntries(
        message.guild.name,
        message.content.substr(prefix.length + 7) // 7 represents length of string "entries"
      );
      message.reply(JSON.stringify(response));
      break;

    default:
      const exists = await FirebaseHelpers.serverExists(message.guild.id);
      if (exists) {
        FirebaseHelpers.addMessage(message.guild.name, message.member.user.tag);
      } else {
        FirebaseHelpers.addServer(
          message.guild.id,
          message.guild.name,
          message.member.user.tag
        );
      }
  }
  //   if (message.content === `${prefix}code`) {
  //     message.reply(`Your access code is ${message.guild.id}`);
  //   } else if (message.content === `${prefix}reset`) {
  //     FirebaseHelpers.resetDB();
  //   } else if (message.content === `${prefix}entries`) {
  //     const response = await FirebaseHelpers.numEntries(
  //       message.guild.name,
  //       message.content.substr(prefix.length + 7) // 7 represents length of string "entries"
  //     );
  //     message.reply(JSON.stringify(response));
  //   } else if (!message.author.bot) {
  //     const exists = await FirebaseHelpers.serverExists(message.guild.id);
  //     if (exists) {
  //       FirebaseHelpers.addMessage(message.guild.name, message.member.user.tag);
  //     } else {
  //       FirebaseHelpers.addServer(
  //         message.guild.id,
  //         message.guild.name,
  //         message.member.user.tag
  //       );
  //     }
  //   }
});

// login to Discord with your app's token
client.login(`${process.env.TOKEN}`);
