# Adopt a Drain (AAD)

**Slack:** #project-adoptdrain

We prefer to use the word "trunk" rather than "master." Trunk better fits the tree metaphor used to describe the repository.

**Project Description:**

> A joint project with the [Grand Valley Metropolitan Council](http://www.gvmc.org) and the [Lower Grand River Organization of Watersheds](https://www.lgrow.org). The very broad goal is create an Adopt-a-Drain program for the Grand River watershed, covering nearly 3,000 square miles of land from just west of Lansing to Lake Michigan.
>
> **Project**: * [Goals](#goals) * [Strategies](#strategies)
> **Design**:  * [Understanding AAD](UNDERSTANDING-AAD.md)
> **Data**: * [Data](DATA.md)
> **Developers**: * [Setup](STARTUP.md) * [Prerequisites](#prerequisites) * [Docker](DOCKER.md) * [GitHub](GITHUB.md) * [github-playground](https://github.com/citizenlabsgr/open-lab) * [Tools](TOOLS.md)
> **Contributing**: * [Contributing](CONTRIBUTIONS.md) * [Submit an Issue](ISSUES.md)


**Why Change Adopt-a-Drain?**

> The original Adopt a Drain idea, design and code is the product of the San Francisco Brigade of Code for America. Citizen Labs has taken the idea, simplified the code, and reworked the architecture to appeal to a broader group of developers.

**Project Guides:**

> * Courtney C (LGROW)
* Cara D (LGROW)
* Eileen B (LGROW)
* James W (Citizen Labs)

**Maintainers (people with write access):**

> * Jace B
* Dave W
* Ross H

**Note:**
* Docker is configured so as to not persist the development database
---
### Goals
| ID | Goal
| :------ | --------
| G   | **Continue**, the Adopt-a-Drain program for the Grand River watershed |
| G1  | **Grow**, the AAD developer pool  |
| G2  | **Clarify**, the codebase  |
| G3  | **Simplify**, AAD's development and deployment  |
| G4  | **Decouple**, the application from the data and services  |
| G   |   |

### Strategies   
| Strategy | Goal IDs
| :------ | --------
| Replace Ruby with Nuxtjs (nodejs) | G1, G2         
| Use Postgrest APIs to decoupled the application and data storage | G1, G2 |
| Replace the current application's user interface with a Single page design | G3,G4 |
| ~~Static Website, should run on github or aws S3~~  | G1,G3  |
| Establish Test Driven Development | G2 |

# Developers

**Guides**
* Small tasks are better than big tasks.
* A small task is any work that can be done in a single setting
* Big tasks are broken into small tasks

**Rules**
* The Trunk is always production ready
* Development is always associated with an issue
* Development is always done on a branch

**Roles**
* Developer: YOU
* Owner: Courtney Cromley (LGROW)
* Team Leader: James Wilfong (Citizen Labs)

**Responsibilities**
* A developer is responsible for their branches, writing and maintaining tests, writing testable code, code reviews and documentation
* The team leader(s) is responsible for this repository's trunk
* The team leader(s) is responsible for clarifying and maintaining issues

**Developers**
1. Complete the [Prerequisites](STARTUP.md#prerequisites)
1. Development [Setup](STARTUP.md#setup)
1. [Testing](TESTING.md)
1. Local AAD http://localhost:3000
