![](public/img/readme-header.png)

## Dependencies

Dependency | Min Version | Brew† | Choco†† | Apt
-- | -- | -- | -- | --
`node` | 9.0.0 | `node` | `nodejs` | `nodejs`
`postgres` | 9.5 | `postgresql` | `postgresql` | `postgresql`
`redis` | ~ | `redis` | `redis` | `redis`
`php` | 7.2 | `php72` | `php` | `php7`
`composer` | ~  | [instructions](https://getcomposer.org/doc/00-intro.md#installation-linux-unix-osx)
`yarn` | ~ | `yarn` | `yarn` | `npm install -g yarn`
`git` | ~ | `git` | `git` | `git`

## Developing
If you're developing on this project, the following sections should help you get setup and going.

### First time setup
1. Copy `.env.example` to `.env` and modify the values in it according to your local environment.
If you see errors in the upcoming commands, you may need to check these settings.
2. Run `yarn run init` - Sets up your database, example data, logins, etc. You can run this anytime
you want to completely reset your local environment and database

### Day-to-day work

> After pulling new code, run `yarn run catchup`. This will install new dependencies and run any necessary migrations.

In addition to the following commands you <u>**must**</u> run `php artisan serve` to boot up the API.

Coding | Command | Notes
-- | -- | --
api | `yarn run dev` | Will build (but not watch) all JS components.
dashboard | `yarn run dev:dashboard` | Watches changes to the react app in `./resources/dashboard` and static builds everything else.
importer | `yarn run dev:importer` | Watches changes to the react app in `./resources/importer` and static builds everything else.
everything | `yarn run dev:all` | Compiles and watches all components. There's a lot happening here, so if you're not actively coding on all components use one of the above commands for performance.

## Using package managers on Windows and Mac
- † `brew` is a package manager like yum or apt-get for Mac. You can install it here: https://brew.sh
- †† `choco` is a similar package manager for windows: https://chocolatey.org
