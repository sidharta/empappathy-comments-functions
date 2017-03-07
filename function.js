// Pull in Firebase and GCloud deps
var util = require('util')
var firebase = require("firebase-admin")

var gcloud = require('google-cloud')({
  projectId: process.env.GCP_PROJECT,
})

var serviceAccount = require(__dirname + '/firebase-credentials.json')

// Initialize Firebase App with service account
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://empappathy.firebaseio.com"
})

var language = gcloud.language()

function commentAnalysis(req, res) {

  // Set CORS headers
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if ( req.method === 'OPTIONS' ) {
    console.log('Preflight request...')
    res.writeHead(200);
		res.end();
		return;
	}

  var commentKey = req.body.commentKey

  if( !commentKey ) {
    console.log("No commentKey provided!")
  } else {
    var commentRef = firebase.database()
      .ref("/user-comments/" + commentKey)

    commentRef.once("value", function(snap) {
      var comment = snap.val()

      language.detectSentiment(comment.comment, function(err, sentiment){
        if(err) {
          console.log(err)
        } else {
          var score = {
            score: sentiment,
            postKey: comment.postKey
          }

          firebase.database().ref('/comment-score/' + commentKey).update(score)
        }
      })
    })
  }

  res.send('OK')
}

module.exports = {
  commentAnalysis: commentAnalysis
}
