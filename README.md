# Adopt a Drain (AAD)

We prefer to use the word "trunk" rather than "master." Trunk better fits the tree metaphor used to descibe the repository.

## Why Change Adopt-a-Drain?
The original Adopt a Drain idea, design and code is the product of the San Francisco Brigade of Code for America.
Citizen Labs has taken the idea, simplified the code, and reworked the architecture to appeal to a broader group of developers.

* [Goals](#goals)
* [Strategies](#strategies)
* [Understanding ADD](UNDERSTANDING-AAD.md)
* [Contribution Process](#contribution-process)
* [Prerequisites](#prerequisites)
* [Developer Setup](STARTUP.md)
* [Docker](DOCKER.md)
* [GitHub](GITHUB.md)
* [Issues](ISSUES.md)
* [Development Tools](TOOLS.md)

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

## Contribution Process
1. **Find an Issue**: Review the repo's issues ([Stories](ISSUES.md#stories), [Things](ISSUES.md#things), and [Actions](ISSUES.md#actions))
1. [**Clone**](STARTUP.md#manual-setup): Get copy of the code
1. **Branch**: Isolate the production code from your new features/development code
1. **Develop**: Make your contribution (write tests, write code, repeat)
    1. Write tests
    1. Write code
    1. Repeat
1. **Document**: Update the documentation to describe your contribution
1. **Pull Push**: Merge changes from trunk/others into your branch (Pull), and then merge your contributions back to your branch on GitHub
1. **Pull Request**: Notifiy the repo owner that your contribution is ready for review
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
1. [Testing](#testing.md)

### Open Adopt-a-Drain
* open browser
* http://localhost:3000
