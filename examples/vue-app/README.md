# VuexBlaze Vue Example

## How to setup

### Create a firebase project and a collection named 'customers' in your firestore

https://firebase.google.com/docs/firestore/quickstart

### Clone the repo and move to vue-app folder

```bash
$ git clone https://github.com/ishiijp/vuexblaze.git
$ cd examples/vue-app
```

### Copy .env.template to .env and modify.

```bash
$ mv .env.template .env
```

```bash
VUE_APP_FIRE_API_KEY=[YOUR FIREBASE KEY]
VUE_APP_FIRE_DATABASE_URL=[YOUR FIREBASE DATABASE URL]
VUE_APP_FIRE_PROJECT_ID=[YOUR PROJECT ID]
```

### Install dependencies

```bash
$ yarn install
   or
$ npm install
```

### Run the server

```bash
$ yarn serve
   or
$ npm run serve
```

Access http://localhost:8080
