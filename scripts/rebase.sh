#!/bin/bash
source ./get_input.sh
source ./config.sh
# Prerequisites:
#   1. have a cloned repo
#   2. Open a command window
#   3. create a config.sh file

# get a commit message

export MY_GIT_PROJECT=$(get_input "Git Project Name" "${MY_GIT_PROJECT}")
export MY_BRANCH=$(get_input "Your Branch Name" "${MY_BRANCH}")
export COMMIT_MSG=$(get_input "Commit Message" "${MY_BRANCH}")

exit 0
# Git Commands#                 Process
# ---------------------------   ---------------------------------   ---------------------
cd ${MY_GIT_PROJECT}/           #       [
git checkout ${MY_BRANCH}       #   +---->[checkout your branch]              git checkout <your-branch-name>
                                #   |               |
                                #   |   |-->[make your changes]
                                #   |   |           |
                                #   |   |           |
git add .                       #   |   |   [save your changes]                 git add .
git commit -m "${COMMIT_MSG}"   #   |   |           |                           git commit -m "#<issue-no>.<description>"
                                #   |   |           |
                                #   |   ^-----------|
                                #   |   |           |
git checkout master             #   |   |   [get collaborator changes]          git checkout master
git pull origin master          #   |   |           |                           git pull origin master
                                #   |   ^-----------|
git checkout ${MY_BRANCH}       #   |   |   [start to merge yours and their changes]            git checkout <your-branch-name>
git rebase master               #   |   |           |                           git rebase master
                                #   |   |           |
                                #   |   |   [fix any conflicts]                 #Use an editor like atom or visual studio
                                #   |   ^-----------|
                                #   |               |
git status                      #   |       [check your repo's status]          git status
                                #   ^---------------|
exit 0                          #           [terminate]
                                #               .
                                #               .
                                #               .
git push origin "${MY_BRANCH}"  #       [Optionally, push your change to GitHub]
                                #       [Open Github in browser]
open -a safari "https://github.com/${MY_GIT_OWNERNAME}/${MY_GIT_PROJECT}"

git status

# open a browser for convenience

