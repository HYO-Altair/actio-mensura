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

client.on("message", (message) => {
  if (message.content === `${prefix}code`) {
    message.reply(`Your access code is ${message.guild.id}`);
  } else if (message.content === `${prefix}reset`) {
    FirebaseHelpers.resetDB();
  } else if (
    message.content.substr(0, prefix.length + 8) === `${prefix}entries `
  ) {
    const entriesFunction = async () => {
      let response = await FirebaseHelpers.numEntries(
        message.guild.name,
        message.content.substr(prefix.length + 8)
      );
      message.reply(response);
    };
    entriesFunction();
  } else if (!message.author.bot) {
    const existsFunction = async () => {
      let exists = await FirebaseHelpers.serverExists(message.guild.id);
      if (exists) {
        FirebaseHelpers.addMessage(message.guild.name, message.member.user.tag);
      } else {
        FirebaseHelpers.addServer(
          message.guild.id,
          message.guild.name,
          message.member.user.tag
        );
      }
    };
    existsFunction();
  }
});

// login to Discord with your app's token
client.login(`${process.env.TOKEN}`);
