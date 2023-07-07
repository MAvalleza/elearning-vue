export default class Webservice {
  apiNamespace () {
    return import.meta.env.VITE_API_NAMESPACE;
  }

  requestHeaders () {
    return {
      'Content-Type': 'application/json',
    };
  }
}