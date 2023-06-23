const REQUIRED_RULE = (value) => {
  if (value) { return true; }

  return 'This field is required.';
};

export {
  REQUIRED_RULE
};