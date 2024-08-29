#!/bin/bash
TYPE=
SERVICE=
OG=
while getopts "a:b:c:" opt
do
   # shellcheck disable=SC2220
   case "$opt" in
      a ) TYPE="$OPTARG" ;;
      b ) SERVICE="$OPTARG" ;;
      c ) OG="$OPTARG" ;;
   esac
done
export $(egrep -v '^#' "$PWD/.env.$OG.deploy" | xargs)
echo "$PEM_PATH"
echo "$INSTANCE_IP"
PWD=$PWD
eval $(ssh-agent)
ssh-add $PEM_PATH
scp -i $PEM_PATH "$PWD/.env.$OG.$TYPE" "$INSTANCE_HOST:/my-app/env/${TYPE}/${SERVICE}/.env"