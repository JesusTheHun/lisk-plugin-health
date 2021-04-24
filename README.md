### Lisk Plugin Health 

![npm](https://img.shields.io/npm/v/lisk-plugin-health)

## Installation

```bash
npm install lisk-plugin-health
# or
yarn add lisk-plugin-health
```

## Getting started

```js
// src/application/index.js

import { HealthPlugin } from 'lisk-plugin-health';

app.registerPlugin(HealthPlugin);
```

## Usage
To check the health of the app, just run.
```ts
// Use the params as configured, see below
const isHealthy = await this._client.invoke('health:isHealthy');
// or set a custom delay (default is 12000)
const isHealthy = await this._client.invoke('health:isHealthy', {
  delayUntilUnhealthy: 15000,
});
```
It will return `0` if the app is healthy, `1` if there is an issue


## Configuration

The app is considered healthy if it registered a block recently. You can configure the delay before the app is considered unhealthy.
The unit is milliseconds.

```js
// src/application/index.js

const appConfig = utils.objects.mergeDeep({}, configDevnet, {
  plugins:  {
    health: {
      delayUntilUnhealthy: 15000 // default 12000
    }
  },
});

const app = Application.defaultApplication(genesisBlockDevnet, appConfig); 
```
