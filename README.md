# atom-task-server

## Overview

`atom-task-server` is a backend server for a simple task todo frontend application. It is built using Firebase Functions, Express.js, and Firestore, providing a scalable and serverless architecture for managing tasks.

## Features

- **Firebase Functions**: Serverless backend logic
- **Express.js**: RESTful API endpoints
- **Firestore**: NoSQL database for storing tasks and user data
- **Firetools**: Used for local development and deployment to Firebase

## Project Structure

```
functions/
	src/
		index.js        # Express entry point
		firebase.js          # Firebase initialization
		models/              # Auth and tasks modules
		shared/              # Middlewares and utilities
	lib/
		...                  # build output
```

## Getting Started

### Prerequisites

- Node.js
- Firebase CLI (`npm install -g firebase-tools`)
- Firetools (for local emulation and deployment)

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/xXAntonioXx/atom-task-server.git
    cd atom-task-server
    ```
2. Install dependencies:
    ```sh
    cd functions
    npm install
    ```

### Local Development

at functions/ level.

Use Firebase to emulate the backend locally:

```sh
firebase emulators:start
```

### Deployment

Deploy to Firebase Functions using Firetools:

```sh
firebase deploy --only functions
```

## API Endpoints

- `/auth` - Authentication routes
- `/tasks` - Task management routes

## Technologies Used

- **Firebase Functions**
- **Express.js**
- **Firestore**
- **Firetools**

## License

MIT
