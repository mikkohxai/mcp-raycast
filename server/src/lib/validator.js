export function validateParams(schema, params) {
  for (const [field, rules] of Object.entries(schema)) {
    if (rules.required && (params[field] === undefined || params[field] === null)) {
      return { valid: false, error: `Missing required parameter: ${field}` };
    }
    if (
      params[field] !== undefined &&
      rules.type &&
      typeof params[field] !== rules.type
    ) {
      return {
        valid: false,
        error: `Parameter ${field} must be of type ${rules.type}`,
      };
    }
  }
  return { valid: true };
}
