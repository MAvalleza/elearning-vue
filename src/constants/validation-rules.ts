const REQUIRED_RULE = (value: string) => {
  if (value) {
    return true;
  }

  return 'This field is required.';
};

const EMAIL_FORMAT_RULE = (value: string) => {
  return /^[^\s@]+@[^\s@]+$/.test(value) || 'Invalid email address';
};

const CUSTOM_RULES = {
  /**
   *
   * @param {Object} data - form object data
   * @param {String} param.key - the attribute which contains the field value
   * @param {String} param.compareKey - the attribute where we want to compare the field value
   * @param {String} param.message - custom validation message
   */
  match: (
    data: object,
    {
      key,
      compareKey,
      message,
    }: { key: string; compareKey: string; message: string }
  ) => {
    if (
      data[key as keyof typeof data] === data[compareKey as keyof typeof data]
    ) {
      return true;
    }

    return message || 'Values must match';
  },
};

export { CUSTOM_RULES, EMAIL_FORMAT_RULE, REQUIRED_RULE };
