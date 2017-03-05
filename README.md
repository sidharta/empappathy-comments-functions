# Empappathy Image Functions

A Google Function that reads a comment from Firebase, sends to Google Sentiment Analysis and saves back the score and labels received.

## Deploy:

  gcloud alpha functions deploy commentAnalysis \                                
    --stage-bucket [FUNCTIONS_BUCKET] \
    --trigger-http

## Test
curl -X POST https://<YOUR_REGION>-<YOUR_PROJECT_ID>.cloudfunctions.net/commentAnalysis \
  -H "Content-Type:application/json" \
  --data '{"postKey":"", "commentKey":""}'
