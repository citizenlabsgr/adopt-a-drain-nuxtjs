# Adopt a Drain (AAD)

We prefer to use the word "trunk" rather than "master." Trunk better fits the tree metaphor used to describe the repository.

## Why Change Adopt-a-Drain?
The original Adopt a Drain idea, design and code is the product of the San Francisco Brigade of Code for America.
Citizen Labs has taken the idea, simplified the code, and reworked the architecture to appeal to a broader group of developers.

* [Goals](#goals)
* [Strategies](#strategies)
* [Understanding AAD](UNDERSTANDING-AAD.md)
* [Contribution Process](#contribution-process)
* [Prerequisites](#prerequisites)
* [Developer Setup](STARTUP.md)
* [Docker](DOCKER.md)
* [GitHub](GITHUB.md)
* [Submit an Issue](ISSUES.md)
* [Development Tools](TOOLS.md)

### Note:
* Docker is configured so as to not persist the development database

### Goals
| ID | Goal
| :------ | --------
| G1  | **Grow**, the AAD developer pool  |
| G2  | **Clarify**, the codebase  |
| G3  | **Simplify**, AAD's development and deployment  |
| G4  | **Decouple**, the application from the data and services  |

### Strategies   
| Strategy | Goal IDs
| :------ | --------
| Replace Ruby with Nuxtjs (nodejs) | G1, G2         
| Use Postgrest APIs to decoupled the application and data storage | G1, G2 |
| Replace the current application's user interface with a Single page design | G3,G4 |
| ~~Static Website, should run on github or aws S3~~  | G1,G3  |
| Establish Test Driven Development | G2 |

## Guides
* Small tasks are better than big tasks.
* A small task is any work that can be done in a single setting
* Big tasks are broken into small tasks

## Rules
* The Trunk is always production ready
* Development is always associated with an issue
* Development is always done on a branch

## Roles
* Developer: YOU
* Owner: Courtney Cromley (LGROW)
* Team Leader: James Wilfong (Citizen Labs)

## Responsibilities
* A developer is responsible for their branches, writing and maintaining tests, writing testable code, code reviews and documentation
* The team leader(s) is responsible for this repository's trunk
* The team leader(s) is responsible for clarifying and maintaining issues

## Contribution Process
1. **Find an Issue**: Review the repo's issues
1. [**Clone**](STARTUP.md#manual-setup): Get copy of the repository
1. **Branch**: Make a branch to isolate your contribution
1. **Develop**: Make your contribution (write tests, write code, update documentation, repeat)
1. **Document**: Update the documentation to describe your code contribution
1. **Sync Repo**: Merge changes from trunk/others into your local-branch, and then merge your contributions back to your remote-branch on GitHub
1. **Request a Review**: Notify the repo owner that your contribution is ready for review
1. **Review**: one or more contributor's will review, suggest changes, and/or approve.

## Prerequisites
This can be the hardest section for new developers and a challenge to seasoned veterans.
Keys and Tokens are never saved to the repo.
1. **[Install Docker](https://www.docker.com)**
1.  **[Google Map Key](https://developers.google.com/maps/documentation/javascript/get-api-key)**
    1. setup an account
    1. get a key
1. **[Data.World API Token](https://data.world)**
    1. setup an account
    1. get a token from the account page
1. **[AAD API Token](https://jwt.io)** (developers can use the token provided)
    1. header is {"alg": "HS256","typ": "JWT"}
    1. payload is {"iss": "Citizen-Labs","sub": "Origin","name": "Adopt-a-Drain","role": "guest_aad"}
    1. verify signature password is PASSWORDmustBEATLEAST32CHARSLONGLONG
        1. password is configured in the .env as POSTGRES_JWT_SECRET

# Developer Setup
1. Complete the [Prerequisites](#prerequisites)
1. [Get started](STARTUP.md)
1. [Testing](TESTING.md)

### Open Adopt-a-Drain
* open browser
* http://localhost:3000
