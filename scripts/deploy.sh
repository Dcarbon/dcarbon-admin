#!/bin/bash
BUILD_MODE=
SERVICE=
LOG_JENKINS=
TELEGRAM_BOT_TOKEN=
TELEGRAM_GROUP_ID=
EV=
WORKSPACE=
URL=
while getopts "a:b:c:d:e:g:i:k:" opt; do
  # shellcheck disable=SC2220
  case "$opt" in
  a) BUILD_MODE="$OPTARG" ;;
  b) SERVICE="$OPTARG" ;;
  c) LOG_JENKINS="$OPTARG" ;;
  d) TELEGRAM_BOT_TOKEN="$OPTARG" ;;
  e) TELEGRAM_GROUP_ID="$OPTARG" ;;
  g) EV="$OPTARG" ;;
  i) WORKSPACE="$OPTARG" ;;
  k) URL="$OPTARG" ;;
  esac
done
BUILD_ARG=$(for arg in $(cat .env); do echo "--build-arg $arg "; done | tr -d '\n')
SERVICE_UPPERCASE=$(echo $SERVICE | tr 'a-z' 'A-Z')
EV_UPPERCASE=$(echo $EV | tr 'a-z' 'A-Z')
ARR_LOG_JENKINS=(${LOG_JENKINS//job/ })
LOG_JENKINS="/job${ARR_LOG_JENKINS[1]}"

function pushTelegramNotification() {
  echo $1
  echo $2
  echo $3
  if [ "$1" == "ERROR" ]; then
    MSG="❌ $SERVICE_UPPERCASE $2

$3"
  elif [ "$1" == "SUCCESS" ]; then
    MSG="✅ $SERVICE_UPPERCASE $2

$3"
  else
    MSG="🟡 $SERVICE_UPPERCASE $2

$3"
  fi
  echo $MSG
  MSG=${MSG//</(}
  MSG=${MSG//>/)}
  MSG=$(urlencode "$MSG")
  curl --location --request GET "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendmessage?chat_id=$TELEGRAM_GROUP_ID&message_thread_id=$TELEGRAM_TOPIC_ID&parse_mode=HTML&text=<code>$MSG</code>"
  if [ "$1" == "ERROR" ]; then
    exit 1
  fi
}

urlencode() {
  python3 -c 'from urllib.parse import quote, sys; print(quote(sys.argv[1], sys.argv[2]))' \
    "$1" "$urlencode_safe"
}
TELEGRAM_MESSAGE="MODE: $EV_UPPERCASE
BUILD MODE: $BUILD_MODE
URL: $URL
BUILD LOG: "$LOG_JENKINS'console'"

- COMMIT INFO

BRANCH: $(git name-rev --name-only HEAD)
COMMIT: $(git log -2)"
pushTelegramNotification "DOING" " is being deployed" "$TELEGRAM_MESSAGE"

export $(egrep -v '^#' "/my-app/env/$EV/common/.env.deploy" | xargs)
npm install
if [ "$?" -eq 0 ]; then
  echo "---NPM INSTALL DONE---"
else
  echo "---NPM INSTALL ERROR---"
  pushTelegramNotification "ERROR" "deployment error: YARN INSTALL ERROR" "$TELEGRAM_MESSAGE"
fi
npm run build
if [ "$?" -eq 0 ]; then
  echo "---NPM RUN BUILD DONE---"
else
  echo "---NPM RUN BUILD ERROR---"
  pushTelegramNotification "ERROR" "deployment error: NPM RUN BUILD ERROR" "$TELEGRAM_MESSAGE"
fi

aws configure set aws_access_key_id $AWS_ACCESS_KEY
aws configure set aws_secret_access_key $AWS_SECRET_KEY
aws configure set default.region $AWS_REGION
if [ "$?" -eq 0 ]; then
  echo "---AWS CONFIGURE DONE---"
else
  echo "---AWS CONFIGURE ERROR---"
  pushTelegramNotification "ERROR" "deployment errors: AWS CONFIGURE ERROR" "$TELEGRAM_MESSAGE"
fi
aws s3 rm s3://$S3_BUCKET --recursive
if [ "$?" -eq 0 ]; then
  echo "---S3 RM DONE---"
else
  echo "---S3 RM ERROR---"
  pushTelegramNotification "ERROR" "deployment error: S3 RM ERROR" "$TELEGRAM_MESSAGE"
fi
aws s3 sync ./dist/ s3://$S3_BUCKET
if [ "$?" -eq 0 ]; then
  echo "---S3 SYNC DONE---"
else
  echo "---S3 SYNC ERROR---"
  pushTelegramNotification "ERROR" "deployment error: S3 SYNC ERROR" "$TELEGRAM_MESSAGE"
fi
aws cloudfront create-invalidation --distribution-id=$CLOUDFRONT_DISTRIBUTION_ID --paths "/*"
if [ "$?" -eq 0 ]; then
  echo "---CLOUDFRONT CREATE-INVALIDATION DONE---"statu
else
  echo "---S3 SYNC ERROR---"
  pushTelegramNotification "ERROR" "deployment error: CLOUDFRONT CREATE-INVALIDATION ERROR" "$TELEGRAM_MESSAGE"
fi
pushTelegramNotification "SUCCESS" "deployment successful" "$TELEGRAM_MESSAGE"
