

# Default Page Layout

```
() is a component
[] is visible on screen
"" is a literal string
<> is a variable
@ is external link

(GmapMap) is a third party component
(DWHandlers) is a mixin component (mixins/DWHandler.js)

Layout
  |
  |<---- (Header)
  |       |<---- [Image]
  |       |<---- [Caption]
  |      
  |<---- (Navigation)
  |       |<---- ["Home"]
  |       |<---- ["Sign In"] or ["Sign Out"]
  |       |<---- ["Sign Up"] or ["<user-screen-name>"]
  |
  |<---- (Body)   
  |       |<---- (Adoption)
  |       |       |<---- [(GmapMap)]  
  |       |       |<---- (DWHandlers)  
  |       |   
  |       |<---- (Authenticate)
  |       |       |<---- [(SignIn)]
  |       |       |<---- [(SignOut)]     
  |       |   
  |       |<---- (Authorize)
  |               |<---- [(SignUp)]  
  |               |<---- [(AccountUpd)]
  |                        
  |<---- (Footer)    
          |<---- [(Opportunities)]
          |<---- [(Sponsors)]     
          |<---- [(Stats)]
          |<---- [(About)]  
          |<---- [@Github]  
          |<---- [@Slack]  

```
# Paths
```
["Home"] /home
["Sign In"] /authenticate
["Sign Out"] /autheticate
["Sign Up"] /authorize
["<user-screen-name>"] /authorize

```
