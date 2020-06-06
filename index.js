// require the discord.js module
const Discord = require('discord.js');

// require the firebase admin module
var FirebaseAdmin = require('firebase-admin');

// Module to read environment variables easily
const dotenv = require('dotenv');
dotenv.config();

/*
 * FIREBASE
 */
// firebase code currently being tested in dbtest.js

/*
 * DISCORD
 */

// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', (message) => {
	console.log(message.content);
});

// login to Discord with your app's token
client.login(`${process.env.TOKEN}`);
