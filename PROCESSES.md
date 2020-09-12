# Processes
[Participation Processes](#participatin-processes) |
[System Processes](#system-processes)

# Participation Processes

[Contribution Process](#contribution-process)

#### Contribution Process

1. **Find an Issue**: Review the repo's issues
1. [**Clone**](STARTUP.md#manual-setup): Get copy of the repository
1. **Branch**: Make a branch to isolate your contribution
1. **Develop**: Make your contribution (write tests, write code, update documentation, repeat)
1. **Document**: Update the documentation to describe your code contribution
1. **Sync Repo**: Merge changes from trunk/others into your local-branch, and then merge your contributions back to your remote-branch on GitHub
1. **Request a Review**: Notify the repo owner that your contribution is ready for review
1. **Review**: one or more contributor's will review, suggest changes, and/or approve.

# System Processes

[Sign Up](#sign-up) * [Sign In](#sign-in) * [Update Adopter](#update-adopter) * [Adoption](#adoption) * [Unadopt](#unadopt) * [Reset Password](#reset-password)

#### Sign Up
Also known as Create Adopter and Authorize

```
      +-------------->(authorized)------------------>+
      |                                              |
  +-->+----->(unauthorized)                          +-->
      ^           |                                  |
      |    +-->[Get Display Name]-->(cancel)-------->+
      |    ^      |    ^     |                       ^
      |    |      |    +<--[Not Empty Feedback]      |
      |    |      |                                  |
      |    +-->[Get Name      ]---->(cancel)-------->+
      ^    ^      |    ^     |                       ^
      |    |      |    +<--[Username Feedback]       |
      |    |      |                                  |
      |    +<--[Get Password  ]---->(cancel)-------->|
      ^           |    ^     |                       ^
      |           |    +<--[Password Feedback]       |
      |           |                                  |
      |        [Conformant Submit]                   |
      |           |                                  |
      |        (submit-data)                         |
      .           .                                  .
      .               .                              .
      .                   .                          .
      ^                    |                         ^
      |                 [Create]--->(authorized)---->+
      |                    |
      +<--(unauthorized)<--+
```
* [Not Empty Feedback](DEFINITIONS.md#not-empty-feedback)
* [Username Feedback](DEFINITIONS.md#username-feedback)
* [Password Feedback](DEFINITIONS.md#password-feedback)
* [Conformant Submit](DEFINITIONS.md#conformant-submit)
* submit-data is [Authorization Data](DEFINITIONS.md#authorization-data)
* Authorization Data is [Adopter Data](DEFINITIONS.md#adopter-data)

#### Update Adopter

```
      +-------------->(unauthorized)---------------->+
      ^                                              |  
  +-->+----->(authorized)                            +-->
                  |                                  ^
      +--->+-->[Edit Display Name]-->(cancel)------->+
      ^    ^      |    ^       |                     ^
      |    |      |    +<--[Not Empty Feedback]      |
      |    |      |                                  |
      |    +-->[Edit User Name]----->(cancel)------->+  
      ^    ^      |    ^    |                        ^
      |    |      |    +<--[Username Feedback]       |
      |    |      |                                  |
      |    +<--[Edit Password]------>(cancel)------->+
      ^           |    ^    |                        ^
      |           |    +<--[Password Feedback]       |
      |           |                                  |
      |        [Conformant Submit]                   |
      |           |                                  |
      |        (submit-data)                         |
      .           .                                  .
      .               .                              .
      .                   .                          .
      ^                    |                         ^
      |                 [Update]--->(reauthorized)-->+
      |                    |
      +<--(authorized)<----+   

```
* [Not Empty Feedback](DEFINITIONS.md#not-empty-feedback)
* [Username Feedback](DEFINITIONS.md#username-feedback)
* [Password Feedback](DEFINITIONS.md#password-feedback)
* [Conformant Submit](DEFINITIONS.md#conformant-submit)
* submit-data is [Adopter Data](DEFINITIONS.md#authorization-data)

#### Sign In
Also known as login or authentication
```  
      +-------------->(authenticated)--------------->+--->
      ^                                              ^
      |                                              |
  +-->+----->(unauthenticated)                       |  
      ^           |                                  ^
      |           |                                  |
      |    +-->[Get Adopter's Name]                  |
      ^    ^      |    ^         |                   ^  
      |    |      |    |<----[Username Feedback]     |  
      |    |      |                                  |
      |    +<--[Get Adopter's Password]              |
      ^           |    ^         |                   ^  
      |           |    |<----[Password Feedback]     |  
      |           |                                  |  
      |        [Conformant Submit]                   |
      |           |                                  |  
      |        (submit authentication data)                         |
      .           .                                  .
      .               .                              .
      .                   .                          .
      ^                   |                          ^
      |                [Sign In]-->(authenticated)-->+
      |                   |  
      +<---(unauth)<------+

```
* [Username Feedback](DEFINITIONS.md#username-feedback)
* [Password Feedback](DEFINITIONS.md#password-feedback)
* [Conformant Submit](DEFINITIONS.md#conformant-submit)
* submit data is [authentication data](DEFINITIONS.md#authentication-data)



#### Adoption

```
                    +----->(adopted)---------------->+
                    ^                                |
                    |                                |
  (authenticated)-->+------->(orphan)                +-->
                    ^           |                    ^
                    |    [Conformant Submit]         |
                    |           |                    |
                    |   (submit adoption-data)       |
                    |           |                    |
                    .           .                    .
                    .           .                    .
                    .           .                    .
                    |           |                    |
                    |     [Adoptee]-->(my-adopted)-->+
                    |           |
                    +<-(orphan)<+
```
* [Conformant Submit](DEFINITIONS.md#conformant-submit)
* submit-adoption-data is [adoptee data](#DEFINITIONS.md#adoptee-data)
* my-adopted is a drain adopted by the currently authenticated user

#### Orphan
Also known as abandon
```
                    +----->(orphaned)--------------->+
                    ^                                |
                    |                                |
  (authenticated)-->+----->(my-adopted)              +-->
                    ^           |                    ^
                    |    [Conformant Submit]         |
                    |           |                    |
                    |       (submit orphan-data)     |
                    .           .                    .
                    .           .                    .
                    .           .                    .
                    |           |                    |
                    |     [Adoptee]-->(orphan)------>+
                    |           |
                    |           +------+
                    |                  |  
                    +<--(my-adopted)<--+

```   

#### Send Reset Password Email
Also known as reauthorize

``` WIP
+<----[Get            Name]
^        |     ^        |
|        |     |<----[Username Feedback]
|        |   
|     [Conformant Submit]
|        |
.        .
.        .
.        .
|     [Send Reset Password Email]

```
* [Conformant Submit](DEFINITIONS.md#conformant-submit)
