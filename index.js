const COLOR_GREEN = '#4caf50';
const COLOR_RED = '#da3805';
const COLORS = [COLOR_GREEN, '#cddc39', '#daa507', COLOR_RED];

/**
 * Get the server timing table
 * @param {String} serverTiming The server timing string
 * @param {Number} max The max ms for time line
 */
function getServerTimingTable(serverTiming, max) {
  if (!serverTiming) {
    return `<div style="
      text-align:center;
      margin: 5px 0;
      ">Loading...</div>`;
  }
  const items = serverTiming.split(',');
  const html = items.map((item) => {
    const reg = /(\S+?)=(\d+.\d*);"([\S\s]+)"/;
    const result = reg.exec(item);
    /* istanbul ignore if */
    if (result.length < 2) {
      throw new Error('Server timing is invalid');
    }
    const name = result[3] || result[1];
    const use = parseFloat(result[2]);
    const percent = Math.min(Math.ceil(100 * (use / max)), 100);
    const color = COLORS[Math.floor(percent / 25)];
    let useDesc = '';
    if (use > 1000) {
      useDesc = `${(use / 1000).toFixed(2)}s`;
    } else {
      useDesc = `${use.toFixed(2)}ms`;
    }
    return `<tr>
      <td style="padding:0 0 0 5px;width:150px">${name}</td>
      <td style="padding:3px 0">
        <div style="float:right;width:${percent}%;background-color:${color}">&nbsp;</div>
      </td>
      <td style="padding:0 5px 0 0;width:80px;text-align:right;">${useDesc}</td>
    </tr>`;
  }).join('');
  return `
  <table style="border-collapse:collapse;border-spacing:0;width:100%">
    <tbody>
      ${html}
    </tbody>
  </table>
  `;
}

/**
 * Get the status html
 * @param {Number} status The http response status
 */
function getStatus(status) {
  if (!status) {
    return '<span style="margin-right:5px">pending</span>';
  }
  let color = COLOR_GREEN;
  if (status >= 400) {
    color = COLOR_RED;
  }
  return `<span style="color:${color};margin:0 5px 0 0">${status}</span>`;
}

/**
 * Get the use time html
 * @param {Number} use The use time
 */
function getUse(use) {
  if (use < 0 || use == null) {
    return '';
  }
  return `${use}ms`;
}

class HTTPTiming {
  /**
   * The HTTPTiming constructor
   * @param {Object} options {max: Number, size: Nuber}
   * max: the max time(ms)
   * size: the size of timing cache
   */
  constructor(options) {
    this.options = Object.assign({
      max: 10 * 1000,
      size: 10,
    }, options);
    this.list = [];
  }
  /**
   * Get the timing by index
   * @param {Number} index The timing index
   */
  get(index) {
    const item = this.list[index];
    /* istanbul ignore if */
    if (!item) {
      return null;
    }
    return Object.assign({}, item);
  }
  /**
   * Add the data to timing view
   * @param {Object} data {
   *  url: String,
   *  method: String,
   *  status: Number,
   *  use: Number,
   *  serverTiming: String,
   * }
   */
  add(data) {
    /* istanbul ignore if */
    if (!data || !data.url) {
      throw new Error('the url can\'t be null');
    }
    const {
      size,
    } = this.options;
    const item = Object.assign({}, data);
    this.list.push(item);
    /* istanbul ignore if */
    if (this.list.length > size) {
      this.list.shift();
    }
    return (key, value) => {
      item[key] = value;
    };
  }
  /**
   * the length of cache
   */
  get length() {
    return this.list.length;
  }
  /**
   * Remove all cache
   */
  empty() {
    this.list.length = 0;
    return this;
  }
  /**
   * Get the http timing view
   */
  toHTML() {
    const list = this.list;
    const {
      max,
    } = this.options;

    const count = list.length;
    const htmlArr = list.map((item, index) => {
      let marginBottom = 5;
      if (index === count - 1) {
        marginBottom = 0;
      }
      const html = `<div style="
        font-size: 14px;
        margin-bottom: ${marginBottom}px;
      ">
        <h5 style="
          margin:0;padding:0;
          line-height:24px;
          text-indent:5px;
          background-color: #35405b;
          color: #fff;
        ">
          ${(item.method || 'unknown').toUpperCase()}
          <span style="margin: 0 5px 0 0">${item.url}</span>
          ${getStatus(item.status)}
          ${getUse(item.use)}
        </h5>
        ${getServerTimingTable(item.serverTiming, max)}
      </div>`;
      return html;
    });
    return `<div>
      ${htmlArr.join('')}
    </div>`;
  }
}

module.exports = HTTPTiming;
