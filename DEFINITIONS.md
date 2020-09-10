# Concepts and Definitions

# Action
Action is a task necessary to construct a thing
1. An __Action__ is a verb describing the activity.
1. Name Pattern: #<story-number>.\<verb>.\<description>
1. Action verbs include: Create, Change, Cleanup, Document, Delete, Integrate, Migrate, Update, Refactor, Remove, and Rename.
1. Get a list of Actions by filtering issues with # followed by a story number.
    1. e.g., #45, list all things and action associated with Story #45

# Branch
A branch is an independent line of development.
* Command: git checkout -b <your-branch-name>

# Clone
A clone is a copy of a remote repository on your local drive
* Command: https://github.com/<repo-owner-name>/<repo-name>.git

# Pull
"Pull" refers to a process where a local-repository is refreshed from a remote repository.
* Command: git pull origin trunk

# Pull Request
"Pull Request" how a developer tells the team leader (repository owner) a branch is ready for review.
GitHub: Select your-branch-name and click "Pull request"

# Push
Push is

# Rebase
Rebase is the process of
Command

# Story
You should almost never need to write a story.
1. A __Story__ describes the needs and wants of the business Owner and/or the Team Leader
1. Name Pattern: As a \<stakeholder>, I need <general-description>, so I can <reason>.
1. Common Stakeholders: developer, owner, team leader
1. Get a  [Story List](https://github.com/citizenlabsgr/adopt-a-drain/issues?q=As+a) by filtering issues with "As a"

# Thing
A thing is a logical construct of a Story. You can't have a thing that doesn't relate to a Story.
1. A __Thing__ needs to be designed, tested, and developed.
1. Name Pattern: #<story-number>.\<noun>:\<description>
1. Common nouns include: API, Component, Database, Process, Table
1. A Thing title always starts with a "#" followed by story number (aka, issue number), followed by a noun
1. Get a list of Things by filtering issues with # followed by a story number.
    1. e.g., #45, list all things and actions associated with Story #45

# Trunk
