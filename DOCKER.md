# Docker
Note:
* Docker is configured to NOT persist the database. This can be changed in the docker-compose.yml.

1. [Install Docker](https://www.docker.com)
1. [Start Docker](#start-docker)
1. [Stop Docker](#stop-docker)

### Start Docker
    ```
    # open a command window
    # from the adopt-a-drain/ folder

    docker-compose build

    docker-compose up
    ```

### Stop Docker
    ```
    # open a command window
    # from the adopt-a-drain/ folder

    docker-compose down
