
const fs = require('fs');

const GRABBER_CONFIG = {
  OUTPUT_STRUCTURES: {
    'request': {
      fn: 'request',
      file: '---------------OUTPUT-REQUEST.txt',
    },
    'axios': {
      fn: 'axios',
      file: '---------------OUTPUT-AXIOS.txt',
    },
  },
  INPUT_STRUCTURES: {
    'express': {
      path: { props: 'route.path', default: '' },
      method: { props: 'method', default: '' },
      params: { props: 'params', default: {} },
      query: { props: 'query', default: {} },
      body: { props: 'body', default: {} },
      result: { props: 'result', default: {} },
    },
  }
};

class Grabber {
  constructor(options = {}) {
    this.config = GRABBER_CONFIG;
    this._validateOptions(options);
    this._init(options);
  }

  _getValue(properties, obj) {
    return properties
      .split('.')
      .reduce((prev, curr) => {
        return prev ? prev[curr] : null
      }, obj || {});
  }

  _validateOptions({ inputType, outputType, url }) {
    if (!this.config.INPUT_STRUCTURES[inputType]) {
      throw new Error(`Unfortunately the library doesn't support this input yet: ${inputType}`);
    }

    if (!this.config.OUTPUT_STRUCTURES[outputType]) {
      throw new Error(`Unfortunately the library doesn't support this output yet: ${outputType}`);
    }

    if (!url) {
      throw new Error(`Please specify api url`);
    }

    return true;
  }

  _init({ inputType, outputType, url }) {
    this.inputStructure = this.config.INPUT_STRUCTURES[inputType];
    this.outputStructure = this.config.OUTPUT_STRUCTURES[outputType];
    this.url = url;

    this.input = {};
    this.output = {};
  }

  grab(input) {
    this._setInput(input);
    this._setOutput();
    this._fillFile();

    return this.output;
  }

  _setInput(input) {
    Object.keys(this.inputStructure).forEach(key => {
      this.input[key] = this._getValue(this.inputStructure[key].props, input) || this.inputStructure[key].default;
    });
  }

  _setOutput() {
    if (this.outputStructure.fn === 'request') {
      this.output = this._getRequestOutput();
      return;
    }

    if (this.outputStructure.fn === 'axios') {
      this.output = this._getAxiosOutput();
      return;
    }
  }

  _fillFile() {
    fs.appendFileSync(this.outputStructure.file, `${this.outputStructure.fn}(${JSON.stringify(this.output)})\n`);
  }

  _getRequestOutput() {
    // TODO: convert nested arrays, objects and boolean into supported format
    // { values: [1, 2] } > { 'values[0]': 1, 'values[1]': 2 }
    // { values: {x: 1, y: 2} } > { 'values.x': 1, 'values.y': 2 }
    // { values: true } > { 'values': 'true' }
    return {
      method: this.input.method.toUpperCase(),
      url: `${this.url}${this.input.path}`,
      headers: {},
      formData: this.input.body,
      json: true,
    }
  }

  _getAxiosOutput() {
    return {
      method: this.input.method.toUpperCase(),
      url: `${this.url}${this.input.path}`,
      data: this.input.body,
    }
  }
}

module.exports = Grabber;