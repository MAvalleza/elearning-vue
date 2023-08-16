import { Serializer } from 'miragejs';

export default Serializer.extend({
  // eslint-disable-next-line no-unused-vars
  serialize(user, request) {
    const json = Serializer.prototype.serialize.apply(this, arguments);

    // Exclude the "password" attribute from the response
    delete json.password;

    return json;
  },
});