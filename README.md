# Very simple Backend for Angular 2
[![Build Status](https://travis-ci.org/llafuente/ng2-vs-backend.svg?branch=master)](https://travis-ci.org/llafuente/ng2-vs-backend)
[![npm version](https://badge.fury.io/js/ng2-vs-backend.svg)](http://badge.fury.io/js/ng2-vs-backend)
[![devDependency Status](https://david-dm.org/llafuente/ng2-vs-backend/dev-status.svg)](https://david-dm.org/llafuente/ng2-vs-backend#info=devDependencies)
[![GitHub issues](https://img.shields.io/github/issues/llafuente/ng2-vs-backend.svg)](https://github.com/llafuente/ng2-vs-backend/issues)
[![GitHub stars](https://img.shields.io/github/stars/llafuente/ng2-vs-backend.svg)](https://github.com/llafuente/ng2-vs-backend/stargazers)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/llafuente/ng2-vs-backend/master/LICENSE)

## Demo
https://llafuente.github.io/ng2-vs-backend/demo/

## Table of contents

- [About](#about)
- [Installation](#installation)
- [Documentation](#documentation)
- [Development](#development)
- [License](#licence)

## About

Module to create API Backends for Angular 2

## Installation

Install through npm:
```
npm install --save ng2-vs-backend
```

Then use it in your app like so:

```typescript
import {Component} from '@angular/core';
import {HelloWorld} from 'ng2-vs-backend';

@Component({
  selector: 'demo-app',
  directives: [HelloWorld],
  template: '<hello-world></hello-world>'
})
export class DemoApp {}
```

You may also find it useful to view the [demo source](https://github.com/llafuente/ng2-vs-backend/blob/master/demo/demo.ts).

### Usage without a module bundler
```
<script src="node_modules/dist/umd/ng2-vs-backend/ng2-vs-backend.js"></script>
<script>
    // everything is exported VSBackend namespace
</script>
```

## Documentation
All documentation is auto-generated from the source via typedoc and can be viewed here:
https://llafuente.github.io/ng2-vs-backend/docs/

## Development

### Prepare your environment
* Install [Node.js](http://nodejs.org/) and NPM (should come with)
* Install local dev dependencies: `npm install` while current directory is this repo

### Development server
Run `npm start` to start a development server on port 8000 with auto reload + tests.

### Testing
Run `npm test` to run tests once or `npm run test:watch` to continually run tests.

### Release
* Bump the version in package.json (once the module hits 1.0 this will become automatic)
```bash
npm run release
```

## License

MIT
