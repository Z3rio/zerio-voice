# Zerio-Voice

This is an W.I.P (Work In Progress) voice script for FiveM.

The primary aim of this is to provide some more exclusive features as compared
to the already existing voice systems. Aswell as writing it in Typescript
instead of Lua.

## What's inside?

This monorepo includes the following packages/apps:

### Apps and Packages

- `@zerio-voice/ui`: A Vue app for displaying voice info
- `@zerio-voice/client`: The clientside of zerio-voice
- `@zerio-voice/server`: The serverside of zerio-voice
- `@zerio-voice/shared`: Shared state/data between the client/server/ui
- `@zerio-voice/typescript-config`: `tsconfig.json`s used throughout the
  monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Build

To build all apps and packages, run the following command:

```
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
pnpm dev
```
