const assert = require('assert');
const fs = require('fs');
const path = require('path');

const HTTPTiming = require('..');

describe('HTTPTiming', () => {
  const httpTiming = new HTTPTiming({
    max: 3 * 1000,
  });
  const list = [
    {
      method: 'GET',
      url: '/users/me',
      status: 200,
      use: 2800,
      serverTiming: 'A;dur=2521.46147;desc="/users/me",B;dur=102.022688;desc="getUser",C;dur=33.468153;desc="mongodb:get",D;dur=54.064163;desc="validate:user"',
    },
    {
      method: 'GET',
      url: '/users/count',
      status: 500,
      use: 2300,
      serverTiming: 'A;dur=1800.46147;desc="/users/count",B;dur=1.022688;desc="mongodb:count"',
    },
    {
      method: 'GET',
      url: '/users/me/token',
      status: 404,
      use: 1400,
      serverTiming: 'A;dur=1000.46147;desc="/users/me/token",B;dur=10.022688;desc="mongodb:getUser",C;dur=1.022688;desc="getToken"',
      extra: {
        message: 'Error message',
      },
    },
    {
      method: 'POST',
      url: '/users/login',
    },
  ];

  it('add', () => {
    list.forEach(item => httpTiming.add(item));
    assert.equal(httpTiming.length, list.length);
    const set = httpTiming.add({
      method: 'PUT',
      url: '/users/like/1232',
    });
    let item = httpTiming.get(httpTiming.length - 1);
    assert(!item.use);
    set('use', 1000);
    item = httpTiming.get(httpTiming.length - 1);
    assert.equal(item.use, 1000);
    set({
      use: 2000,
    });
    item = httpTiming.get(httpTiming.length - 1);
    assert.equal(item.use, 2000);
  });

  it('empty', () => {
    httpTiming.empty();
    assert.equal(httpTiming.length, 0);
  });

  it('toHTML', (done) => {
    list.forEach(item => httpTiming.add(item));
    const html = httpTiming.toHTML();
    const timingHtml = `
      <!DOCTYPE html>
      <html lang="zh-CN">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="HandheldFriendly" content="True">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta http-equiv="cleartype" content="on">
        </head>
        <body style="margin:0">
          ${html}
        </body>
      </html>
    `;
    fs.writeFile(path.join(__dirname, '../assets/http-timing.html'), timingHtml, done);
  });
});
