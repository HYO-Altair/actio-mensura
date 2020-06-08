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

  object.days[date_key] = 1;
  object.users[user_key] = 1;

  // Create the object at root
  db.ref(`/${serverName}`).set(object);
}
async function addMessage(serverName) {
  let path = serverName + "/days/" + getDateString();
  console.log("path is " + path);
  // get current value
  let curr = await db
    .ref(path)
    .once("value")
    .then((snapshot) => {
      return snapshot.val();
    });
  // increment current value
  db.ref(path).set(curr + 1);
}

async function numEntries(serverName, dateString) {
  let path = serverName + "/days/" + dateString;
  console.log("other path is " + path);

  // find number at date
  let result = "n/a";
  result = await db
    .ref(path)
    .once("value")
    .then((snapshot) => {
      console.log("ss val is " + snapshot.val());
      return snapshot.val().toString();
    });

  return result;
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
