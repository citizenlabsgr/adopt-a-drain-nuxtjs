
# Contribution Process

```
  Process                                     Git Commands
  -----------------------------------------   ---------------------------------

   +---->[checkout your branch]               git checkout <your-branch-name>
   |               |
   |   |-->[make your changes]
   |   |           |
   |   |           |
   |   |   [save your changes]                 git add .
   |   |           |                           git commit -m "#<issue-no>.<description>"
   |   ^-----------|
   |   |           |
   |   |   [get collaborator changes]          git checkout trunk
   |   |           |                           git pull origin trunk
   |   ^-----------|
   |   |           |
   |   |   [merge their changes with yours]
   |   |           |                           git checkout <your-branch-name>
   |   |           |                           git rebase
   |   |           |
   |   |   [fix any conflicts]
   |   |           |
   |   |   [continue merge]                    After fixes complete then
   |   |           |                                git rebase --continue
   |   ^-----------|
   |               |
   |       [check your repo's status]          git status
   |               |
   ^---------------|
                   |
           [terminate]
                   .
                   .
                   .
    [Optionally, push your change to GitHub]   git push origin <your-branch-name>
              |
       [Submit a Pull Request]
```
