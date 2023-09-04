# Mvalleza E-learning Vue

## Overview

**IN PROGRESS**

Front-end training project for viewing subjects and courses.

### Notes

\*MirageJS code is not in typescript since it is not yet fully supported.

### In progress features

- Code evaluation checklist

### Mock Implementation

Due to absence of a backend, the endpoints have been mocked using [MirageJS](https://miragejs.com/docs/getting-started/introduction/)

The MirageJS configs can be found in `src/mock-server`

Note that whatever data you created will be lost once you refresh the app since they are saved within the front-end instance only.

To persist data, we can save it into localStorage by configuring it in our env file. (See installation section)

The initial start of the app might run slow since MirageJS is seeding mock data

## Installation

### Installing dependencies

```
yarn install
```

### Running the project

Before running the project, make sure to setup a `.env` file at the root folder.

We need to put the API namespace and APP env to make sure MirageJS will run:

```
VITE_APP_ENV=test
VITE_API_NAMESPACE=/api

```

Additionally, if you want data to persist for MirageJS, add this in the ENV file (true is recommended in order to mock sessions):

```
VITE_MIRAGE_PERSISTENCE=true
```

Finally, run the project with:

```
yarn dev
```

## Users

There are 3 users:

1. Admin
2. Instructor
3. Student

Sample accounts are available:

Default instructor (w/ sample subjects, courses, and modules)

```
email: tr1@test
password: 123
```

Default Student

```
email: s@test
password: 123
```

Admin

```
email: admin@test
password: 123
```

### Creating your own account

Creating an account is still possible even without the backend.

Simply go through the registration process as normal.

No email verification has been set yet since actual sending of email is not present in the mocks. Instead, a temporary button that will redirect and activate the user to verification will appear in the app.
