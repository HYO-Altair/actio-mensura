/*
  Info Needed:
    * Number of Messages over time (Let's make the separation days for now)
    * Messages per user
*/

const FirebaseAdmin = require("firebase-admin");
const DBStructure = require("./databasestructure.json");

// Module to read environment variables easily
const dotenv = require("dotenv");
dotenv.config();

// Initialize Firebase
const serviceAccountKey = process.env.PATH_TO_FIREBASE_KEY;
const Firebase = FirebaseAdmin.initializeApp({
  credential: FirebaseAdmin.credential.cert(serviceAccountKey), // references process.env.GOOGLE_APPLICATION_CREDENTIALS
  databaseURL: "https://actio-mensura.firebaseio.com",
});

// Access Database
const db = Firebase.database();

async function testLog() {
  const rules = await db.getRules();
  console.log(rules);
}

// returns date in //mmmddyyyyy format ie Jun072020
function getDateString() {
  let currentDate = new Date(Date.now());
  return currentDate.toDateString().replace(/\s+/g, "").substr(3);
  // replace gets rid of white space inside string
}

function resetDB() {
  db.ref("/").set(DBStructure);
}

async function serverExists(serverID) {
  let result = await (
    await db.ref(`servers/${serverID}`).once("value")
  ).exists();
  return result;
}

function addServer(serverID, serverName, user) {
  // First add key in Server List
  db.ref(`servers/${serverID}`).set(serverName);

  // Create Object for Message Counter
  let object = { days: {}, users: {} };
  let date_key = getDateString();
  let user_key = (user + "").replace("#", "-");

  object.days[date_key] = { messages: {} };
  object.users[user_key] = 1;

  // Create the object at root
  db.ref(`/${serverName}`).set(object);
}
function addMessage(serverName, user, message, createdTimestamp) {
  // create object for Message
  let object = { user: "", mlen: "", createdTimestamp };
  object["user"] = user.replace("#", "-");
  object["mlen"] = message.length;

  let path = serverName + "/days/" + getDateString() + "/messages";
  // create entry and append message
  db.ref(path).push(object);
}

async function numEntries(serverName, dateString) {
  let path = serverName + "/days/" + dateString + "/messages";
  // check if entry exists for date
  db.ref(path)
    .once("value")
    .then((snapshot) => {
      if (snapshot.numChildren() > 0) {
        return snapshot.numChildren() + " entries on " + dateString;
      } else {
        return `No entries found for ${dateString}; check your formatting? It should be something similar to Jun072020`;
      }
    });
  return "oop" + dateString + path;
}
module.exports = {
  getDateString,
  testLog,
  resetDB,
  serverExists,
  addServer,
  addMessage,
  numEntries,
};
