# Strapi Backend

## First time setup

```bash
cd backend
npm install
cp .env.example .env  # Set environment variables
npm run import        # Import data
npm run develop       # Run the development server
```

You are directed to http://localhost:1337/admin to set up your admin user.

## 🚀 Getting started with Strapi

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html) (CLI) which lets you scaffold and manage your project in seconds.

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-develop)

```
npm run develop
# or
yarn develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-start)

```
npm run start
# or
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-build)

```
npm run build
# or
yarn build
```

## Import and export data

To save time from manually typing in data, the project comes with a basic starting point based on the [GHG quantification model spreadsheet](https://docs.google.com/spreadsheets/d/1uVMZRZjQ2LFPcwRgRoiAyaYsQhJnL8Ey/edit).

### `import`

Import the baseline content from version control.

```
npm run import
```

**Warning!** The `import` command overwrites your database.

### `export`

Export your current database content to version control.

```
npm run export
```

## Admin documentation

You can find the admin documentation [here](https://docs.google.com/document/d/1-E18h0reI6fIBbrsh9C1KQadoSTGeZJT11NWxKx5iEc/edit#heading=h.fumehj96yk45).

## Authentication

### Login

POST http://localhost:1337/api/auth/local

```json
{
  "identifier": "user1@example.com",
  "password": "user1pw"
}
```

In the response object, you'll receive a JWT token for authenticating requests:

```json
{
  "jwt": "...",
  "user": { ... }
}
```

### Authenticated requests

For example:<br>
GET http://localhost:1337/api/users/me<br>
Authorization: Bearer `<jwt>`

### Test users

When running `npm run strapi import`, two test users will be added for development purposes:

#### user1

- Email: user1@example.com
- Password: user1pw

#### user2

- Email: user2@example.com
- Password: user2pw

## Deployment

At the moment, only SQLite is supported as a database. PostgreSQL will not work because it truncates some of the auto-generated table names. You can try using MySQL but it is not tested.

The incompatibility with Postgres leaves some commercial deployment options out, for example Heroku. Render, on the other hand, has a [guide for deploying Strapi with SQLite](https://render.com/docs/deploy-strapi).

### Deploying on a dedicated server with Docker

#### Build the production image

```bash
docker build -t ghg-strapi:latest -f Dockerfile.prod .
```

#### Create a volume for the database

```bash
docker volume create ghg-db
```

#### Run the container

```bash
docker run \
  --name ghg-strapi \
  -dit \
  -v ghg-db:/app/db \
  -p 1337:1337 ghg-strapi:latest
```

Strapi runs now on port 1337 of your server.

#### Import seed data

```bash
docker exec -it ghg-strapi npm run import
```

This is a useful command when running the app for the first time. It creates a starting point for the content with English and Finnish translations and two test API users.

Important: `npm run import` overwrites the database so be careful!

#### Create an admin user:

```bash
docker exec -it ghg-strapi npm run strapi admin:create-user -- --firstname=Jane --lastname=Doe --email=jane.doe@taltech.ee --password=Admin123
```

#### Docker compose

Alternatively, you can use Docker Compose to take care of all of the above for you:

```bash
docker compose up
```

#### Test the endpoints

See postman.json for a collection of endpoints to test.
