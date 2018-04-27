# TeamTrack

## Overview

TeamTrack is an open-source mobile application for outdoor events with a need
to track the distance covered by their members. Users can adhere to groups and
see in real-time their distance and that of their group and of the event.

## Stack Information

TeamTrack is a fullstack javascript application based upon the following stack:

| Concern            | Solution                                                 |
|--------------------|----------------------------------------------------------|
| Server             | [Node 9.5](https://nodejs.org/)                          |
| Server Framework   | [Express](http://expressjs.com/)                         |
| Database           | [RethinkDB](https://www.rethinkdb.com/)                  |
| Data Transport     | [GraphQL](https://github.com/graphql/graphql-js)         |
| Client State       | [Redux](http://redux.js.org/)                            |
| Client Data Cache  | [Apollo](https://www.apollographql.com/)                 |
| Mobile Framework   | [React Native](https://facebook.github.io/react-native/) |

TeamTrack is coded using ECMAscript ES6/7 (including async/await).
Transpilation is provided by [babel](https://github.com/babel/babel).

## Setup

### Installation

#### Prerequisites

TeamTrack's backend is fully dockerized, from dev to prod.
You will need to install [yarn](https://yarnpkg.com/) which can be installed by running `npm install -g yarn`.

TeamTrack requires Node.js >=8.5.0 (I'm using 8.5.0 in development).
and it also depends on [RethinkDB](https://rethinkdb.com/).
However those dependencies are hidden via docker.

#### Source code

```bash
$ git clone https://github.com/jo-va/team-track.git
$ cd team-track
```

### Server-side development

```bash
$ yarn deploy:dev
```

### Mobile development

Make sure you have an emulator or a connected device.

```bash
$ cd mobile
$ yarn
$ react-native upgrade
$ react-native link
```

#### Android

Set android:windowSoftInputMode="adjustPan" in AndroidManifest.xml.

```bash
$ react-native run-android
```

To generate the release APK:
```bash
$ cd android && ./gradlew assembleRelease
```

#### IOS

```bash
$ react-native run-ios
```

During development, the use of [react-native-debugger](https://github.com/jhen0409/react-native-debugger) is suggested.