# Mvalleza E-learning Vue

## Overview

IN PROGRESS

Front-end training project for viewing subjects and courses.

### Mock Implementation

Due to absence of a backend, the endpoints have been mocked using [MirageJS](https://miragejs.com/docs/getting-started/introduction/)

The MirageJS configs can be found in `src/mock-server`

Note that whatever data you created will be lost once you refresh the app since they are saved within the front-end instance only.

The initial start of the app might run slow since MirageJS is seeding mock data

These mock implementations will be removed once an actual backend has been developed for this app.

## Installation

### Installing dependencies

```
yarn install
```

### Running the project

Before running the project, make sure to setup a `.env` file at the root folder.

We need to put the API namespace to be used for MirageJS:

```
VITE_SWAPI_BASE_URL=https://swapi.dev/api
```

Run the project with:

```
yarn dev
```

## Users

There are 3 users:

1. Admin
2. Instructor
3. Student

Sample accounts are available:

Instructor (w/ sample subjects, courses, and modules)
```
email: tr1@test
password: 123
```

Student
```
email: s@test
password: 123
```

### Creating your own account

Creating an account is still possible even without the backend.

Simply go through the registration process as normal.

No email verification has been set yet since actual sending of email is not present in the mocks. Instead, a temporary button that will redirect to user to verification will appear in the app.

Note that this account will also be lost once the app is refreshed.
