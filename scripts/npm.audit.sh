#!/bin/bash
#source ./get_input.sh
function get_input()
{
  # prompt for input
  # $1 is prompt
  # $2 is default value
  local prompt=$1
  local default=$2
  local answer
  prompt+="[${default}]"
  read -p $prompt answer
  if [ "$answer" = "" ]; then
    answer=$default
  fi
  echo $answer
}
cd ..


echo 'npm audit'
npm audit
# npm audit fix
#npm audit fix --force

export CONT=N
export CONT=$(get_input "Continue_audit_fix?" "${CONT}")
if [ ${CONT} = "N" ]; then
  echo "Stopping."
  exit 0
fi

echo "npm audit fix --force?"
npm audit fix --force