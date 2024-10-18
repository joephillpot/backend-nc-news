## Project Overview

This project replicates the behavior of a back-end API service to access data.

### Hosted Version

A live version of the project can be accessed here:  
[backend-nc-news](https://backend-nc-news-377j.onrender.com/api)

### Cloning the project 

To get started, open your terminal and navigate to the directory you want this repository in. Then, clone the repository with the following command:
```bash
git clone https://github.com/joephillpot/backend-nc-news.git
```

### Required Dependencies

Before running the project, you’ll need to install several dependencies. Below is a list of required packages along with their minimum versions:

**Main Dependencies:**
- **dotenv** (for environment variable management) – _minimum version: 16.4.5_
- **express** (for handling server requests) – _minimum version: 4.21.1_
- **pg** (for database connections) – _minimum version: 8.7.3_
- **nodemon** (for live server reloading) – _minimum version: 3.1.7_

**Developer Dependencies:**
- **jest** (for testing) – _minimum version: 27.5.1_
- **jest-sorted** (for testing array sorting) – _minimum version: 1.0.15_
- **supertest** (for testing server endpoints) – _minimum version: 7.0.0_

To run the project, you’ll also need **Node.js** version **22.3.0** or higher, and **PostgreSQL** version **14.13** or higher

### Setting Up Local Databases

To set up both test and development databases, run the following command in your terminal:
```bash
npm run setup-dbs
```
For test environments, the data seeding is handled automatically before each test in `app.test.js`.

For the development database, you’ll need to manually seed the data. Run the following command to do so:
```bash
npm run-seed
```
Once the data is seeded, you can start the server using:
```bash
npm run start
```
This will make the server listen for incoming requests.

### Running Tests

There are two test files included:

- **`utils.test.js`** – Tests utility functions required for seeding.
- **`app.test.js`** – Tests the server functionality.

To run both test files, simply run:
```bash
npm test
```
Alternatively, you can run tests individually:
- For utility tests: `npm test utils`
- For server tests: `npm test server`

### Creating Environment Files

To set up your environment variables for development and testing, create two files in the root directory:

1. **`.env.development`** – For the development database.
2. **`.env.test`** – For the test database.

In each file, define the `PGDATABASE` environment variable with the appropriate database name.
 
### Thank you for reading!
