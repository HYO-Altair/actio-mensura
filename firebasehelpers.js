var moment = require("moment"); // require
moment().format();

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
  credential: FirebaseAdmin.credential.cert(
    JSON.parse(serviceAccountKey.replace(/\\n/g, "\n"))
  ), // references process.env.GOOGLE_APPLICATION_CREDENTIALS
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
  const day = new Date();
  const currentDate = moment(day).format("LL");
  return currentDate;
  // replace gets rid of white space inside string
}

// Clears Database and resets to structure in databasestructure.json
function resetDB() {
  db.ref("/").set(DBStructure);
}

async function serverExists(serverID) {
  const result = await (
    await db.ref(`servers/${serverID}`).once("value")
  ).exists();
  return result;
}

// Creates a key value pair of the form {server id: server name} in the server list
// Then creates an entry for the server containing the number of messages every day.
function addServer(serverID, serverName, user) {
  // First add key in Server List
  db.ref(`servers/${serverID}`).set(serverName);

  // Create Object for Message Counter
  const object = { days: {}, users: {} };
  const date_key = getDateString();
  const user_key = (user + "").replace("#", "-"); // # not allowed in Firebase keys

  object.days[date_key] = 1;
  object.users[user_key] = 1;

  // Create the object at root
  db.ref(`/${serverName}`).set(object);
}

// Increments the message count for the particular day
// Then increments the overall message count for a particular user.
async function addMessage(serverName, user) {
  const dayPath = `${serverName}/days/${getDateString()}`;

  // get current value
  const dayCurr = await (await db.ref(dayPath).once("value")).val();

  // increment current value
  db.ref(dayPath).set(dayCurr + 1);

  // Now do the same for particular user
  const userKey = (user + "").replace("#", "-");

  const userPath = `${serverName}/users/${userKey}`;

  // get current value
  const userCurr = await (await db.ref(userPath).once("value")).val();

  // increment current value
  db.ref(userPath).set(userCurr + 1);
}

async function numEntries(serverName, dateString) {
  const path = serverName + "/days/" + dateString;

  // return number at date
  return (await (await db.ref(path).once("value")).val()) || "No Data";
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
