## Description

Nodejs Task (using nest.js framework and mongoose) => Backend

## Pre Installation Notes

- Using option 1 requires docker and docker cli to be installed on the system.

- I attached postman collections in the root folder of the project


# Installation and running
* ## Option 1 (Docker)
    ## Command
    ```bash
    $ docker-compose up
    ```
	- This command will seed the database , install dependencies and run the server
* ## Option 2 (Manual commands)
    ## Installation

    ```bash
    $ npm install
    ```

    ### Seeding the database

    ```bash
    $ npm run seed
    ```

    ## Running the app

    ```bash
    # development
    $ npm run start

    # watch mode
    $ npm run start:dev

    # production mode
    $ npm run start:prod
    ```

    ## Test

    ```bash
    # unit tests
    $ npm run test
    ```