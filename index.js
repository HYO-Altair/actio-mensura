// require the discord.js module
const Discord = require("discord.js");

// Module to read environment variables easily
const dotenv = require("dotenv");
dotenv.config();

const FirebaseHelpers = require("./firebasehelpers");

/*
 * FIREBASE
 */
// firebase code currently being tested in dbtest.js

/*
 * DISCORD
 */

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
  } else if (!message.author.bot) {
    const existsFunction = async () => {
      let exists = await FirebaseHelpers.serverExists(message.guild.id);
      if (exists) {
        message.reply("You exist");
      } else {
        message.reply("You don't exist");
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
