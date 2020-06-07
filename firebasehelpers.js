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
  let date_key = Date.now();
  let user_key = (user + "").replace("#", "-");

  object.days[date_key] = 1;
  object.users[user_key] = 1;

  // Create the object at root
  db.ref(`/${serverName}`).set(object);
}

module.exports = {
  testLog,
  resetDB,
  serverExists,
  addServer,
};
