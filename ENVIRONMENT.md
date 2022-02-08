# Environment
You will need
a dataworld account
a dataworld key 
a google account

```
# Adopt-a-drain-nuxtjs

NODE_ENV=development

############
# Postgres specific variables
############
POSTGRES_DB=aad_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=mysecretdatabasepassword
# JWT_SECRET requires at least 32 characters
POSTGRES_JWT_SECRET=fe5d9645_302a_493d_b9de_207dfa16ca9c
POSTGRES_API_PASSWORD=mysecretdatabasepassword
POSTGRES_JWT_CLAIMS={"aud":"citizenlabs-api", "iss":"citizenlabs", "sub":"client-api", "user":"guest", "scope":"api_guest", "key":"0"}

########
# LB
########
#LB_ENV=test
# LB_GUEST_PASSWORD=mysecretclientpassword
# LB_WODEN={"org":"CitizenLabs","app":"Adopt-A-Drain","name":"woden@citizenlabs.org","password":"a1A!aaaa"}

########
# Google
########
GOOGLE_MAPS_API_KEY=AIzaSyB9QsOcoUjU5IWfNM3MG6EQVy23ZCDc1sg

########
# Dataworld
########
DW_USER=citizenlabs
DW_AUTH_TOKEN=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwcm9kLXVzZXItY2xpZW50OndpbGZvbmdqdCIsImlzcyI6ImFnZW50OndpbGZvbmdqdDo6NDk5OGU1YTUtY2FmNC00MzZhLWE2MzQtMTMzNDYwYTU5ZjJkIiwiaWF0IjoxNTMwMzgxNTU3LCJyb2xlIjpbInVzZXJfYXBpX3JlYWQiLCJ1c2VyX2FwaV93cml0ZSJdLCJnZW5lcmFsLXB1cnBvc2UiOnRydWV9.ZhUZRbs7cj7ABcJF3IFgtQtPq5WYnCn9YyfWARtt37QAw10S7P2xqan1U1w3vAXMu3oWG6OhzHQVhtzaiSaXqw
DW_DRAIN_URL=https://api.data.world/v0/sql/citizenlabs/lgrow-storm-drains-current

########
# HeroKu
########
#HEROKU_API_KEY=0f6116e0-827f-4da6-8c80-5a23976cca0b

########
# Adopt a Drain
########
API_HOST=0.0.0.0
API_PORT=5555
AAD_API_URL=http://0.0.0.0:5555
# AAD_API_URL=https://api-aad-lgrow-staging.herokuapp.com
AAD_API_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjaXRpemVubGFicy1hcGkiLCJpc3MiOiJjaXRpemVubGFicyIsInN1YiI6ImNsaWVudC1hcGkiLCJ1c2VyIjoiZ3Vlc3QiLCJzY29wZSI6ImFwaV9ndWVzdCIsImtleSI6IjAifQ.P3rZzJPzyCe6X96eyHSWOL_Yt6_c8ql2mwcioI8tkFU

########
# API
########
# API_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjaXRpemVubGFicy1hcGkiLCJpc3MiOiJjaXRpemVubGFicyIsInN1YiI6ImNsaWVudC1hcGkiLCJ1c2VyIjoiZ3Vlc3QiLCJzY29wZSI6ImFwaV9ndWVzdCIsImtleSI6IjAifQ.P3rZzJPzyCe6X96eyHSWOL_Yt6_c8ql2mwcioI8tkFU
DATABASE_URL=postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/aad_db
JWT_SECRET=${POSTGRES_JWT_SECRET}
JWT_CLAIMS=${POSTGRES_JWT_CLAIMS}
# ACCEPTED_ORIGINS is a Security issue, ["*"]" can be used but not a good idea to let everyone connect
#                  add a string list of acceptable urls like '["http://localhost:3000"]'
#ACCEPTED_ORIGINS='["http://localhost:3000"]'
ACCEPTED_ORIGINS='["*"]'
# In dev, the HEROKU_API_KEY can be set to anything
# In GitHub secrets, set HEROKU_API_KEY to actual value from heroku
HEROKU_API_KEY=stub
# API_TOKEN_TIMEOUT=30
# API_DEBUG=true

#######
# Twillio SendGrid
######

# EMAIL_TOKEN=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
# EMAIL_SO
```
