
# AAD Issues
We use three kinds of issues Stories, Things, and Actions.
## Stories
You should almost never need to write a story.
1. __Stories__ describe the needs and wants of the business Owner and/or the Team Leader
1. Name Pattern: As a \<stakeholder>, I need <general-description>, so I can <reason>. 
1. Common Stakeholders: developer, process owner, team leader
1. Get a  [Story List](https://github.com/Wilfongjt/adopt-a-drain/issues?q=As+a) by filtering issues with "As a"

## Things
All things are logical constructs of Stories. You can't have a thing that doesn't relate to a Story.
1. __Things__, Things need to be designed, tested, and developed.
1. Name Pattern: #<story-number>.\<noun>:\<description>
1. Common nouns include: API, Component, Database, Process, Table
1. Thing titles always start with a "#" followed by story number (aka, issue number), followed by a noun 
1. Get a list of Things by filtering issues with # followed by a story number.
    1. e.g., #45, list all things and actions associated with Story #45 

## Actions
Actions are the activities necessary to construct things
1. __Actions__ are verbs describing activity to be taken. 
1. Name Pattern: #<story-number>.\<verb>.\<description>
1. Common verbs include: Create, Change, Cleanup, Document, Delete, Integrate, Migrate, Update, Refactor, Remove, and Rename. 
1. Get a list of Actions by filtering issues with # followed by a story number.
    1. e.g., #45, list all things and action associated with Story #45 

