# Adoption
```
/data/
[]
()

Adoption
    |
  template
    |    GmapMap
    |    feedback
  data  
    |    page  
    |    drain_dict -------------------+  
    |    location                      |
    |    gettingLocaton                |
    |    errorStr                      |
    |    info_window                   |
    |    settings                      |
    |                                  |
  watch                                |
+-->+    adopter_token --(expired)->+  |
|   |                               |  |
|  computed                         |  |
|   |    google                     |  |
|   |    aad_headers                |  |
|   |    aad_headers_authorized     |  |
+---+    adopter_token ----------+  |  |
    |    adopter_token_helper <--+  |  |
    |    dwHandlers                 |  |
    |    dwGuestHeader              |  |
    |    dwBody                     |  |
    |    dwURL                      |  |
    |    mapHelper                  |  |
    |    utils                      |  |
    |                               |  |
  beforeDestroy                     |  |
    |                               |  |
  created                           |  |
    |                               |  |
  mounted                           |  |
    |                               |  |
  methods                           |  |
    |    form_button_handler        |  |
    |    reset_symbol <-------------+<-+
    |    adopt_a_drain  
    |    log   
    |    doDragEnd
    |    visualizeMarkers  
    |    loadDrains






```
