# Development Testing
### Tests

* Database Tests (aad-db): https://pgtap.org , run automatically when docker creates database  
* Application Tests (aad-web): https://jestjs.io, run manually from command line

### Database Tests
* SQL test scrips are run when the database is created.

### Application Tests   
```
cd adopt-a-drain-nuxtjs/
docker-compose run web npm run test
```
