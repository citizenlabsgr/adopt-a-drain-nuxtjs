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

# Routes
/adopter
/signin
/adoptee
/map

# System Processes

* [Sign Up Account](#sign-up)
* [Update Account](#update-adopter)     
* [Sign In](#sign-in)
* [Reset Password](#reset-password)
* [Adoption Start Up](#adoption-start-up)  
* [Orphan](#orphan)
* [Adoption](#startup)


## Sign Up
Also known as create user, create adopter or authorize user.

```
 (*)                          (*)                
  |                            |
  |                           [Goto /account]
  |                            |                  
[ Collect ] ................ (displayname, username, password)
  |                            |                  
  |                            |                  
[ Save ] .................. [ Emit upsert ]       
  |                            |                  
  |                            + ---> (request) >>>>>>> [[ Adopter Service ]]
  |                                                       |                   
  |                            + <--- (response) <<<<<<<< +                   
  |                            |                  
  |                         [ Add Account ] ---> (fail) --->  [=]
  |                            |                  
  |                         (success)             
  |                            |                  
  |                         [ Goto /signin ]
  |                            |
 [=]                          [=]  
```
## Sign In
Also known as, login or authenticate.
```
(*)                               (*)                  
 |                                 |
 |                               [Goto /signin]
 |                                 |                         
[ Collect Credentials ] ........ (username, password)        
 |                                 |
 |                                 + ---> (cancel)
 |                                 |         |
 |                                 |      [ Goto Map ]  
 |                                 |         |  
 |                                 |      [ Close Modal ]
 |                                 |         |
 |                                 |        [=]
 |                                 |                         
[ SignIn ] .....................   + ---> (request) >>>>>>>>>>>>>> [[ SignIn Service ]]          
 |                                                                   |                         
 |                                 + <--- (token) <<<<<<<<<<<<<<<<<< +                         
 |                                 |                         
 |                                 |                         
[ Authorize ] ................. [ Set Current Token State ]
 |                                 |                         
 |                                 |                         
 |                              [ Goto Map ]                 
 |                                 |                         
 |                              [ Close Modal ]              
 |                                 |                         
[=]                               [=]

```

## Password Reset

```
```

### Adoption Start Up
The application start-up looks something like...
http://localhost:3000
```
[ Adoption.vue ]     
  (*)                         (*)               
   |                            |                 
 [ Init Adoption] .........   [ Mount Adoption ]  
   |                            |                 
   |                            + ---> (request) >>>>>> [[ Location Service ]]  
   |                                                        |                 
   |                            + <--- (location) <<<<<<<<< +                  
   |                            |                 
 [ Map ] .............          + ---> (request) >>>>>> [[ Map Service ]]       
   |                                                       |                  
   |                            + <--- (map) <<<<<<<<<<<<< +                  
   |                            |                 
   |                         [ Center Map ]       
   |                            |                 
   |                         [ Setup map click listeners ]
   |                            |                 
 [ Load Drains ] .....       (centerBox)          
   |                            |                 
   |                            + ---> (request) >>>>>> [[ Adoptee Service ]]   
   |                                                        |                 
   |                            + <--- (adoptees) <<<<<<<<< +                  
   |                            |                 
   |                         [ Cache Adpotees ]   
   |                            |                 
   |                         [ Clean Cache ]      
   |                            |                 
   |                         (centerBox)          
   |                            |                 
   |                            + ---> (request) >>>>>> [[ Drain Service ]]     
   |                                                        |                  
   |                            + <--- (drains) <<<<<<<<<<< +                 
   |                            |                 
   |                         [ Cache Drains ]     
   |                            |                 
[ Display Symbols ] ..       [ Symbolize ]        
   |                            |                 
   |                            |       [ Processed 42 Symbols ]
   |                            |   
  [=]                         [=]  
```

### Adopt

```
```

### Orphan
```
```

### Rename Drain

```
```




#### Update Adopter
```
 (*)                          (*)   
  |                            |
[ Retrieve Account ] ...... (user-token)  
  |                            |
  |                            + ---> (request) >>>>>>> [[ Adopter Service ]]
  |                                                               |                   
  |                            + <--- (displayname, username) <<< +              
  |                            |                  
[ Collect Changes ] ....... (displayname, username)
  |                            |  
  |                            + ---> (cancel) ---> [ Goto SignUp ] ---> [=]                      
  |                            |                  
[ Save ] .................. [ Emit upsert ]       
  |                            |                  
  |                            + ---> (request) >>>>>>> [[ Adopter Service ]]
  |                                                       |                   
  |                            + <--- (response) <<<<<<<< +                   
  |                            |                  
  |                            + ---> (fail) ---> [ Goto SignUp] ---> [=]
  |                            |                  
  |                         (success)             
  |                            |                  
  |                         [ Goto SignIn ]
  |                            |
 [=]                          [=]  
```
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
      .               .                              .  }---- REST Call
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
       (*)                              (*)                       
        |                                 |                         
     [ Collect Credentials ] .......... (username, password)        
        |                                 |                         
        |                                 |                         
     [ SignIn ] .......................   + ---> (request) >>>>>>>>>>>>>> [[ SignIn Service ]]          
        |                                                                   |                         
        |                                 + <--- (token) <<<<<<<<<<<<<<<<<< +                         
        |                                 |                         
        |                                 |                         
     [ Authorize ] .................... [ Set Current Token State ]
        |                                 |                         
        |                                 |                         
        |                              [ Goto Map ]                 
        |                                 |                         
        |                              [ Close Modal ]              
        |                                 |                         
       [=]                               [=]

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
                    .           .                    .  }---- REST Call
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
                    .           .                    .  }---- REST Call
                    .           .                    .
                    |           |                    |
                    |     [Adoptee]-->(orphan)------>+
                    |           |
                    |           +------+
                    |                  |  
                    +<--(my-adopted)<--+

```   

#### Send Reset Password Email
Also known as forgot your password, reauthorize


```
TBD

 (*)                     (*)
  |                       |
[Request New Password]  (email_address, <id>)
  |                       |
  |                       + ---> (request) >>>>>>>>>> [[ Password Reset Service]]
  |                                                       |
  |                       + <--- (reset-link) <<<<<<<<<<< +
  |                       |  
  |                       + ---> (request) >>>>>>>>>> [[ Email Service ]]
  |                                                       |
  |                       + <--- (sent-confirmation) <<<< +
  |                       |
[Wait]                  [ Wait ]
  .
  .  wait for response
  .
[ Respond to Email ]    [ Click Link ]
  |                       |
  |                     [ Goto /renew/<id> ]
  |                       |    
[ Collect ]             (password, username, <id>)
  |                       |
[ Submit ]                + ---> (request) >>>>>>>>> [[ Password Renew Service ]]
  |                                                       |
  |                       + <--- (confirm-change) <<<<<<< +  
  |                       |
  |                    [ Goto Signin ]
  |                       |   
 [=]                     [=]  

```
* [Conformant Submit](DEFINITIONS.md#conformant-submit)
