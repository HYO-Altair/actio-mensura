const FirebaseAdmin = require("firebase-admin");

// Module to read environment variables easily
const dotenv = require("dotenv");
dotenv.config();

/*
 * FIREBASE
 */

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

module.exports = {
  testLog,
};
