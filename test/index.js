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
      serverTiming: 'A=2521.46147;"/users/me",B=102.022688;"getUser",C=33.468153;"mongodb:get",D=54.064163;"validate:user"',
    },
    {
      method: 'GET',
      url: '/users/count',
      status: 500,
      use: 2300,
      serverTiming: 'A=1800.46147;"/users/count",B=1.022688;"mongodb:count"',
    },
    {
      method: 'GET',
      url: '/users/me/token',
      status: 404,
      use: 1400,
      serverTiming: 'A=1000.46147;"/users/me/token",B=10.022688;"mongodb:getUser",C=1.022688;"getToken"',
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
