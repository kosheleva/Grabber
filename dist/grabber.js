"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var fs = require('fs');

var GRABBER_CONFIG = {
  OUTPUT_STRUCTURES: {
    'request': {
      fn: 'request',
      file: '---------------OUTPUT-REQUEST.txt'
    },
    'axios': {
      fn: 'axios',
      file: '---------------OUTPUT-AXIOS.txt'
    }
  },
  INPUT_STRUCTURES: {
    'express': {
      path: {
        props: 'route.path',
        "default": ''
      },
      method: {
        props: 'method',
        "default": ''
      },
      params: {
        props: 'params',
        "default": {}
      },
      query: {
        props: 'query',
        "default": {}
      },
      body: {
        props: 'body',
        "default": {}
      },
      result: {
        props: 'result',
        "default": {}
      }
    }
  }
};

var Grabber =
/*#__PURE__*/
function () {
  function Grabber() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Grabber);

    this.config = GRABBER_CONFIG;

    this._validateOptions(options);

    this._init(options);
  }

  _createClass(Grabber, [{
    key: "_getValue",
    value: function _getValue(properties, obj) {
      return properties.split('.').reduce(function (prev, curr) {
        return prev ? prev[curr] : null;
      }, obj || {});
    }
  }, {
    key: "_validateOptions",
    value: function _validateOptions(_ref) {
      var inputType = _ref.inputType,
          outputType = _ref.outputType,
          url = _ref.url;

      if (!this.config.INPUT_STRUCTURES[inputType]) {
        throw new Error("Unfortunately the library doesn't support this input yet: ".concat(inputType));
      }

      if (!this.config.OUTPUT_STRUCTURES[outputType]) {
        throw new Error("Unfortunately the library doesn't support this output yet: ".concat(outputType));
      }

      if (!url) {
        throw new Error("Please specify api url");
      }

      return true;
    }
  }, {
    key: "_init",
    value: function _init(_ref2) {
      var inputType = _ref2.inputType,
          outputType = _ref2.outputType,
          url = _ref2.url;
      this.inputStructure = this.config.INPUT_STRUCTURES[inputType];
      this.outputStructure = this.config.OUTPUT_STRUCTURES[outputType];
      this.url = url;
      this.input = {};
      this.output = {};
    }
  }, {
    key: "grab",
    value: function grab(input) {
      this._setInput(input);

      this._setOutput();

      this._fillFile();

      return this.output;
    }
  }, {
    key: "_setInput",
    value: function _setInput(input) {
      var _this = this;

      Object.keys(this.inputStructure).forEach(function (key) {
        _this.input[key] = _this._getValue(_this.inputStructure[key].props, input) || _this.inputStructure[key]["default"];
      });
    }
  }, {
    key: "_setOutput",
    value: function _setOutput() {
      if (this.outputStructure.fn === 'request') {
        this.output = this._getRequestOutput();
        return;
      }

      if (this.outputStructure.fn === 'axios') {
        this.output = this._getAxiosOutput();
        return;
      }
    }
  }, {
    key: "_fillFile",
    value: function _fillFile() {
      fs.appendFileSync(this.outputStructure.file, "".concat(this.outputStructure.fn, "(").concat(JSON.stringify(this.output), ")\n"));
    }
  }, {
    key: "_getRequestOutput",
    value: function _getRequestOutput() {
      // TODO: convert nested arrays, objects and boolean into supported format
      // { values: [1, 2] } > { 'values[0]': 1, 'values[1]': 2 }
      // { values: {x: 1, y: 2} } > { 'values.x': 1, 'values.y': 2 }
      // { values: true } > { 'values': 'true' }
      return {
        method: this.input.method.toUpperCase(),
        url: "".concat(this.url).concat(this.input.path),
        headers: {},
        formData: this.input.body,
        json: true
      };
    }
  }, {
    key: "_getAxiosOutput",
    value: function _getAxiosOutput() {
      return {
        method: this.input.method.toUpperCase(),
        url: "".concat(this.url).concat(this.input.path),
        data: this.input.body
      };
    }
  }]);

  return Grabber;
}();

module.exports = Grabber;
