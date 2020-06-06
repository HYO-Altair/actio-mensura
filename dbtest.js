// require the firebase admin module
var FirebaseAdmin = require('firebase-admin');

// Module to read environment variables easily
const dotenv = require('dotenv');
dotenv.config();

/*
 * FIREBASE
 */

// Initialize Firebase
var serviceAccountKey = process.env.PATH_TO_FIREBASE_KEY;
var Firebase = FirebaseAdmin.initializeApp({
	credential: FirebaseAdmin.credential.cert(serviceAccountKey), // references process.env.GOOGLE_APPLICATION_CREDENTIALS
	databaseURL: 'https://actio-mensura.firebaseio.com',
});

// Access Database
var db = Firebase.database();

/*
 * TESTING INSERTING INTO DATABASE
 */

var ref = db.ref('SERVER1 CHAN1');
var messagesRef = ref.child('messages');
// set adds new child object (req key and value)
// push auto assigns new message a unique key
messagesRef.push(
	{
		mlen: '20',
		sender: 'USER1 0000',
		timestamp: 'XXXXYYZZ',
	},
	(err) => {
		if (err) {
			console.log('error occured when trying to add to database: ' + err);
		} else {
			console.log('successfully added message to the database');
		}
	}
);

/*
 * TESTING RETRIEVING MESSAGES FROM DATABASE
 * FROM A CHANNEL IN A SERVER
 */

var servername = 'SERVER1'; // change to test output
var channelname = 'CHAN1'; // change to test output
var username = 'USER1 0000'; // change to test output
// if server exists
db.ref('servers/' + servername)
	.once('value')
	.then((snapshot1) => {
		if (snapshot1.val()) {
			console.log('server ' + servername + ' exists!');
			// if channel within server exists
			db.ref('servers/' + servername + '/channels/' + channelname)
				.once('value')
				.then((snapshot2) => {
					if (snapshot2.val()) {
						console.log('channel ' + channelname + ' exists');
					} else console.log('channel ' + channelname + ' does not exist');
				});
			// if user within server exists
			db.ref('servers/' + servername + '/users/' + username)
				.once('value')
				.then((snapshot3) => {
					if (snapshot3.val()) {
						console.log('user ' + channelname + ' exists');
					} else console.log('user ' + channelname + ' does not exist');
				});
			// prints all messages by  any user within channel within server
			var messagesRef = db.ref(servername + ' ' + channelname + '/messages');
			messagesRef.once('value').then((snapshot) => {
				console.log('MESSAGES IN ' + servername + ' ' + channelname);
				console.log(snapshot.val());
			});
		} else console.log('server ' + servername + ' does not exist.');
	});
