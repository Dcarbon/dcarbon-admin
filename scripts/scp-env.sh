#!/bin/bash
TYPE=
SERVICE=
while getopts "a:b:" opt
do
   # shellcheck disable=SC2220
   case "$opt" in
      a ) TYPE="$OPTARG" ;;
      b ) SERVICE="$OPTARG" ;;
   esac
done
export $(egrep -v '^#' "$PWD/.env.deploy" | xargs)
echo "$PEM_PATH"
echo "$INSTANCE_IP"
PWD=$PWD
eval $(ssh-agent)
ssh-add $PEM_PATH
scp -i $PEM_PATH "$PWD/.env" "$INSTANCE_HOST:/my-app/env/${TYPE}/${SERVICE}/.env"