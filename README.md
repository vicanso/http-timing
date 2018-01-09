# http-timing

Generate the http timing(Server-Timing)

[![Build Status](https://travis-ci.org/vicanso/http-timing.svg?branch=master)](https://travis-ci.org/vicanso/http-timing)
[![Coverage Status](https://img.shields.io/coveralls/vicanso/http-timing/master.svg?style=flat)](https://coveralls.io/r/vicanso/http-timing?branch=master)
[![npm](http://img.shields.io/npm/v/http-timing.svg?style=flat-square)](https://www.npmjs.org/package/http-timing)
[![Github Releases](https://img.shields.io/npm/dm/http-timing.svg?style=flat-square)](https://github.com/vicanso/http-timing)

![](assets/http-timing.jpeg)

## API

### Constructor

The HTTPTiming constructor

- `options` The constructor options
  - `options.max` The max time(ms), use for the time line bar, default is 10 * 1000
  - `options.size` The cache size, default is 10

```js
const HTTPTiming = require('http-timing');
const httpTiming = new HTTPTiming({
  max: 5 * 1000,
  size: 5,
});
```

### add

Add the data to timing view, return function to change the value of data

- `data` The setting of http timing
  - `data.url` The http request url
  - `data.method` The http request method
  - `data.status` The http response status
  - `data.use` The http response time
  - `data.serverTiming` The http server timing



```js
const HTTPTiming = require('http-timing');
const httpTiming = new HTTPTiming();
const set = httpTiming.add({
  method: 'GET',
  url: '/users/me',
  status: 200,
  use: 3000,
  serverTiming: 'A;dur=2521.46147;desc="/users/me",B;dur=102.022688;desc="getUser",C;dur=33.468153;desc="mongodb:get",D;dur=54.064163;desc="validate:user"',
});
set('use', 5000);
set({
  use: 5000,
});
```

### get

Get the timing by index

- `index` the timing index

```js
const HTTPTiming = require('http-timing');
const httpTiming = new HTTPTiming();
httpTiming.add({
  method: 'GET',
  url: '/users/me',
  status: 200,
  use: 3000,
  serverTiming: 'A;dur=2521.46147;desc="/users/me",B;dur=102.022688;desc"getUser",C;dur=33.468153;desc"mongodb:get",D;dur=54.064163;desc="validate:user"',
});
console.info(httpTiming.get(0));
```

### length

Get the cache length

```js
const HTTPTiming = require('http-timing');
const httpTiming = new HTTPTiming();
// 0
console.info(httpTiming.length);
```

### empty

Remove all cache

```js
const HTTPTiming = require('http-timing');
const httpTiming = new HTTPTiming();
httpTiming.add({
  method: 'GET',
  url: '/users/me',
  status: 200,
  use: 3000,
  serverTiming: 'A;dur=2521.46147;desc="/users/me",B;dur=102.022688;desc="getUser",C;dur=33.468153;desc="mongodb:get",D;dur=54.064163;desc="validate:user"',
});
// 1
console.info(httpTiming.length)
httpTiming.empty();
// 0
console.info(httpTiming.length)
```

### toHTML

Get the html of http timing

```js
const HTTPTiming = require('http-timing');
const httpTiming = new HTTPTiming();
httpTiming.add({
  method: 'GET',
  url: '/users/me',
  status: 200,
  use: 3000,
  serverTiming: 'A;dur=2521.46147;desc="/users/me",B;dur=102.022688;desc="getUser",C;dur=33.468153;desc="mongodb:get",D;dur=54.064163;desc="validate:user"',
});
const html = httpTiming.toHTML();
console.info(html);
```

## License

MIT