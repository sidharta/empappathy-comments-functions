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
  var postKey = req.body.postKey
  var commentKey = req.body.commentKey

  if( !postKey && !commentKey ) {
    console.log("No postKey and commentKey provided!")
    return
  }

  var commentRef = firebase.database()
    .ref("/user-comments/" + postKey)
    .child(commentKey)

  commentRef.once("value", function(snap) {
    var comment = snap.val()

    language.detectSentiment(comment.comment, function(err, sentiment){
      if(err) {
        console.log(err)
      } else {
        comment.score = sentiment
        commentRef.update(comment)
      }
    })
  })

  res.send('OK')
}

module.exports = {
  commentAnalysis: commentAnalysis
}
