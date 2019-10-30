
import Grabber from '../dist/grabber';

describe("Grabber: ", () => {

  it("should return error for empty options", () => {
    expect(() => {
      new Grabber()
    }).toThrowError(`Unfortunately the library doesn't support this input yet: undefined`);
  })

  it("should return error for invalid inputType", () => {
    expect(() => {
      new Grabber({ inputType: 'invalid type'})
    }).toThrowError(`Unfortunately the library doesn't support this input yet: invalid type`);
  })

  it("should return error for invalid outputType", () => {
    expect(() => {
      new Grabber({ inputType: 'express', outputType: 'invalid output'})
    }).toThrowError(`Unfortunately the library doesn't support this output yet: invalid output`);
  })

  it("should return error for invalid url", () => {
    expect(() => {
      new Grabber({ inputType: 'express', outputType: 'request'})
    }).toThrowError(`Please specify api url`);
  })

  it("should return correct output for request.js", () => {
    const lib = new Grabber({ inputType: 'express', outputType: 'request', url: 'http://example.comm'});

    const result = lib.grab({
      route: { path: '/api/test-route'},
      method: 'post',
      params: { x: 12 },
      query: { y: 'test' },
      body: { value: 100 },
      result: {}
    });

    expect(result).toMatchObject({
      method: 'POST',
      url: 'http://example.comm/api/test-route',
      headers: {},
      formData: { value: 100 },
      json: true
    });
  });

  it("should return correct output for axios.js", () => {
    const lib = new Grabber({ inputType: 'express', outputType: 'axios', url: 'http://example.comm'});

    const result = lib.grab({
      route: { path: '/api/test-route'},
      method: 'post',
      params: { x: 12 },
      query: { y: 'test' },
      body: { value: 100 },
      result: {}
    });

    expect(result).toMatchObject({
      method: 'POST',
      url: 'http://example.comm/api/test-route',
      data: { value: 100 },
    });
  });

})