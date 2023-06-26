import isEmpty from 'lodash-es/isEmpty';
import { CUSTOM_RULES } from '@/constants/validation-rules';

/**
 * 
 * @param {Object} field - the form field that we are creating rules for
 * @param {Object} data - form data
 * @returns 
 */

const createRules = (field, data) => {
  const { componentOpts, ruleConfigs } = field;

  // Rules already declared in the component props
  const propRules = componentOpts.rules || [];

  // If there are no custom rules, we simply return the prop rules
  if (isEmpty(ruleConfigs)) {
    return propRules;
  }

  return propRules.concat(
    createCustomRules(ruleConfigs, { data })
  );
}

/**
 * Shapes and creates the rules based on the configs
 */
const createCustomRules = (configs, { data }) => {
  let rules = [];

  configs.forEach(config => {
    const { type, opts } = config;

    rules.push(CUSTOM_RULES[type](data, opts));
  });

  return rules;
};

export {
  createRules,
}

