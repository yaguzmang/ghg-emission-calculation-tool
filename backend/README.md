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

### ⚙️ Deployment

Strapi gives you many possible deployment options for your project. Find the one that suits you on the [deployment section of the documentation](https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/deployment.html).

### 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://docs.strapi.io) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

### ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

## Import and export data

To save time from manually typing in data, the project comes with a basic starting point based on the [GHG qantification model spreadsheet](https://docs.google.com/spreadsheets/d/1uVMZRZjQ2LFPcwRgRoiAyaYsQhJnL8Ey/edit).

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

## Test users

When running `npm run strapi import`, two test users will be added for development purposes:

### user1
- Email: user1@example.com
- Password: user1pw

### user2
- Email: user2@example.com
- Password: user2pw
