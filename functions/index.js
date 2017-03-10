var util = require('util')
var firebase = require("firebase-admin")
var functions = require('firebase-functions');

var gcloud = require('google-cloud')({
  projectId: process.env.GCP_PROJECT,
})

// Initialize Firebase App with service account
firebase.initializeApp(functions.config().firebase)

var language = gcloud.language()

exports.commentAnalysis = functions
  .database.ref('/user-comments/{key}')
  .onWrite(event => {
    const obj = event.data.val()
    console.log(util.inspect(obj, null, false))

    language.detectSentiment(obj.comment, function(err, sentiment){
      if(err) {
        console.log(err)
      } else {
        return event.data.ref.child('score').set(sentiment)
      }
    })
  }
)
