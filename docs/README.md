# Zerio-Voice

[![Discord](https://img.shields.io/discord/931629164656734238?label=Our%20Discord)](http://discord.zerio-scripts.com/)
[![Wakatime](https://wakatime.com/badge/user/018b872c-750e-4fad-b67c-3c3f0a3f7b07/project/018cabbf-abf8-46d5-8a69-650b017fb95f.svg)](https://wakatime.com/badge/user/018b872c-750e-4fad-b67c-3c3f0a3f7b07/project/018cabbf-abf8-46d5-8a69-650b017fb95f)

This is an W.I.P (Work In Progress) voice script for FiveM.

The primary aim of this is to provide some more exclusive features as compared
to the already existing voice systems. Aswell as writing it in Typescript
instead of Lua.

## WIP Notice

This script is until further notice a work in progress project. It is not
recommend that you use this on your server as it may contain bugs, or in other
ways be incomplete.

## Support & Contribution

This project is completely free of charge to use and intended to stay fully open
sourced, and therefore it is fully maintained by volunteers.

### I found an issue!

If you found an issue with our voice system, please open an
[github issue](https://github.com/Z3rio/zerio-voice/issues) and explain it to
the best of your ability there.

### I wish to contribute!

We are always open to contributions and improvements of our project. If you feel
like you have an idea which might benefit the project, or such. Then follow the
steps below.

1. [Fork the repository](https://github.com/Z3rio/zerio-voice/fork)
2. Commit the changes to your fork
3. Lastly, open a [pull request](https://github.com/Z3rio/zerio-voice/pulls) to
   contribute your changes

## Credits

There are ofcourse people who have already made similar projects, which do
deserve some credit for coming up with all their great ideas and such.

- [@Frazzle](https://github.com/FrazzIe) creator of mumble-voip
- [@AvarianKnight](https://github.com/AvarianKnight) creator of pma-voice.

## Project Structure

This monorepo includes the following packages/apps:

### "Apps"

The apps directory contains standalone stuff, meaning that there is no other
app/package which depends on it.

- [`@zerio-voice/ui`](https://github.com/Z3rio/zerio-voice/tree/main/apps/ui): A
  Vue app for displaying voice info
- [`@zerio-voice/client`](https://github.com/Z3rio/zerio-voice/tree/main/apps/client):
  The clientside of zerio-voice
- [`@zerio-voice/server`](https://github.com/Z3rio/zerio-voice/tree/main/apps/server):
  The serverside of zerio-voice
- [`@zerio-voice/shared`](https://github.com/Z3rio/zerio-voice/tree/main/apps/shared):
  Code which should be ran on both the client and server

### "Packages"

The packages directory contains stuff which is being used accross multiple
different "Apps", pretty much misc/utility stuff

- [`@zerio-voice/utils`](https://github.com/Z3rio/zerio-voice/tree/main/packages/utils):
  Utility functions
- [`@zerio-voice/typescript-config`](https://github.com/Z3rio/zerio-voice/tree/main/packages/typescript-config):
- [`@zerio-voice/eslint-config`](https://github.com/Z3rio/zerio-voice/tree/main/packages/eslint-config):
- [`@zerio-voice/prettier-config`](https://github.com/Z3rio/zerio-voice/tree/main/packages/prettier-config):
  `tsconfig.json`s used throughout the monorepo

### Installing dependencies

To install the dependencies of this project, simply run the following command
**in the root of the project**:

```
pnpm install
```

### Building

To build all apps and packages, run the following command:

```
pnpm build
```

### Dev Server

To develop all apps and packages, run the following command:

```
pnpm dev
```
