
module.exports = {
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
  },
};