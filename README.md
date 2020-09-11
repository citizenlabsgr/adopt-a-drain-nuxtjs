# Adopt a Drain (AAD)

**Slack:** #project-adoptdrain

We prefer to use the word "trunk" rather than "master." Trunk better fits the tree metaphor used to describe the repository.

#### Project Description:

> A joint project with the [Grand Valley Metropolitan Council](http://www.gvmc.org) and the [Lower Grand River Organization of Watersheds](https://www.lgrow.org). The very broad goal is create an Adopt-a-Drain program for the Grand River watershed, covering nearly 3,000 square miles of land from just west of Lansing to Lake Michigan.

[Project](#project) * [Design](#design) * [Data](#data) * [Contributions](#contributing) *[Developers](#developers) *  [Tools](#tools)

**Why Change Adopt-a-Drain?**

> The original Adopt a Drain idea, design and code is the product of the San Francisco Brigade of Code for America. Citizen Labs has taken the idea, simplified the code, and reworked the architecture to appeal to a broader group of developers.



# Project
[Goals](#goals) * [Strategies](#strategies) * [Guides](#project-guides) * [Maintainers](#maintainers)

#### Goals
| ID | Goal
| :------ | --------
| G   | **Continue**, the Adopt-a-Drain program for the Grand River watershed |
| G1  | **Grow**, the AAD developer pool  |
| G2  | **Clarify**, the codebase  |
| G3  | **Simplify**, AAD's development and deployment  |
| G4  | **Decouple**, the application from the data and services  |
| G   |   |

#### Strategies   
| Strategy | Goal IDs
| :------ | --------
| Replace Ruby with Nuxtjs (nodejs) | G1, G2         
| Use Postgrest APIs to decoupled the application and data storage | G1, G2 |
| Replace the current application's user interface with a Single page design | G3,G4 |
| ~~Static Website, should run on github or aws S3~~  | G1,G3  |
| Establish Test Driven Development | G2 |

#### Project Guides:

* Courtney C (LGROW)
* Cara D (LGROW)
* Eileen B (LGROW)
* James W (Citizen Labs)

#### Maintainers (people with write access):

* Jace B
* Dave W
* Ross H

# Design
* [Understanding AAD](UNDERSTANDING-AAD.md)

# Data

> Data is provided by Grand Valley Metropolitan Council's REGIS, or [Regional Geographic Information System](http://www.gvmc.org/regis/index.shtml). REGIS provides a common database, infrastructure, and suite of applications used for spatial data management by our members.  To facilitate a more informed decision making process, twenty cities, townships, and quasi-governmental organizations have joined together to develop REGIS, one of the largest local government multi-participant Geographic Information System (GIS) projects.

* Storm Drain data is hosted at data.world: https://data.world/activity/citizenlabs


# Contributions

[Contributing](#contributing) * [Contribution Process](#contribution-process) * [Submit an Issue](ISSUES.md)

#### Contributing

> In the spirit of [free software][free-sw], **everyone** is encouraged to help
improve this project. We welcome contributions from first timers. Updates to documentation or readme are greatly appreciated and make for a great first PR. They do not need to be discussed in advance and will be merged as soon as possible.

> Core maintainers and project guides are responsible for reviewing and merging all pull requests (PR). In order to prevent frustrations with your first PR we recommend you reach out to our core maintainers who can help you through your first PR. Need to practice working with github in a group setting? Checkout our [github-playground](https://github.com/citizenlabsgr/open-lab).

[free-sw]: http://www.fsf.org/licensing/essays/free-sw.html

Here are some ways *you* can contribute:

* by using alpha, beta, and prerelease versions
* by reporting bugs
* by suggesting new features
* by [translating to a new language][locales]
* by writing or editing documentation
* by writing specifications
* by writing code (**no patch is too small**: fix typos, add comments, clean up
  inconsistent whitespace)
* by refactoring code
* by closing issues
* by reviewing patches

#### Contribution Process
1. **Find an Issue**: Review the repo's issues
1. [**Clone**](STARTUP.md#manual-setup): Get copy of the repository
1. **Branch**: Make a branch to isolate your contribution
1. **Develop**: Make your contribution (write tests, write code, update documentation, repeat)
1. **Document**: Update the documentation to describe your code contribution
1. **Sync Repo**: Merge changes from trunk/others into your local-branch, and then merge your contributions back to your remote-branch on GitHub
1. **Request a Review**: Notify the repo owner that your contribution is ready for review
1. **Review**: one or more contributor's will review, suggest changes, and/or approve.

#### Submit an Issue
  * [Submit an Issue](ISSUES.md)

# Developers
[Tasks](#tasks) * [Rules](#rules) * [Roles](#roles) * [Responsibilities](#Responsibilities) * [Get Started](STARTUP.md) * [GitHub](#github) * [Docker](#docker) * [Notes](#notes)

#### Tasks
* Small tasks are better than big tasks.
* A small task is any work that can be done in a single setting
* Big tasks are broken into small tasks

#### Rules
* The Trunk is always production ready
* Development is always associated with an issue
* Development is always done on a branch

#### Roles
* Developer: YOU
* Owner: Courtney C (LGROW)
* Team Leader: James W (Citizen Labs)

#### Responsibilities
* A developer is responsible for their branches, writing and maintaining tests, writing testable code, code reviews and documentation
* The team leader(s) is responsible for this repository's trunk
* The team leader(s) is responsible for clarifying and maintaining issues

#### Get Started
1. Complete the [Prerequisites](STARTUP.md#prerequisites)
1. Development [Setup](STARTUP.md#setup)
1. [Testing](TESTING.md)
1. Local AAD http://localhost:3000

#### GitHub
* [github-playground](https://github.com/citizenlabsgr/open-lab)

#### Docker
* [Docker](DOCKER.md)

#### Notes:
* Docker is configured so as to not persist the development database

# Tools

#### Required
* Docker: https://www.docker.com

#### Recommendations
* Code Editor: Atom https://atom.io
* Python Editor: PyCharm https://www.jetbrains.com/pycharm/download/#section=mac
* SQL Client: Postico https://eggerapps.at/postico/

#### Dependencies
Loaded in Docker container
* Node
* Database: Postgres https://www.postgresql.org
* API: Postgrest http://postgrest.org/en/v7.0.0/
