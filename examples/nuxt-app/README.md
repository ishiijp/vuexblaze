# VuexBlaze Nuxt Example

## How to setup

### Create a firebase project and a collection named 'customers' in your firestore

https://firebase.google.com/docs/firestore/quickstart

### Clone the repo and move nuxt-app folder

```bash
$ git clone https://github.com/ishiijp/vuexblaze.git
$ cd examples/nuxt-app
```

### Copy .env.template to .env and modify.

```bash
$ mv .env.template .env
```

```bash
FIRE_ENV=env
FIRE_API_KEY=[YOUR FIREBASE KEY]
FIRE_DATABASE_URL=[YOUR FIREBASE DATABASE URL]
FIRE_PROJECT_ID=[YOUR PROJECT ID]
```

### Install dependencies

```bash
$ yarn install
   or
$ npm install
```

### Run the server

```bash
$ yarn dev
   or
$ npm run dev
```

Access http://localhost:3000
