const REQUIRED_RULE = (value) => {
  if (value) { return true; }

  return 'This field is required.';
};

const CUSTOM_RULES = {
  /**
   * 
   * @param {Object} data - form object data 
   * @param {String} param.key - the attribute which contains the field value
   * @param {String} param.compareKey - the attribute where we want to compare the field value
   * @param {String} param.message - custom validation message
   */
  match: (data, { key, compareKey, message }) => {
    if (data[key] === data[compareKey]) { return true; }

    return message || 'Values must match';
  },
}

export {
  CUSTOM_RULES,
  REQUIRED_RULE,
};