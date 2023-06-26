/**
 * Turns an array of strings into keys of an object
 *
 * Default value when accessing the keys is set to `null`
 * @param {String[]} arr 
 */

const objectifyArray = (arr) => {
  return arr.reduce((acc, val) => ({
    ...acc,
    [val]: null,
  }), {});
};

export {
  objectifyArray,
}