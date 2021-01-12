/**
 * @description error and response formats
*/

/**
 * @description Send success response
 *
 * @param { String } message
 * @param { Object | Array } data
 * @param { Number } statusCode
 *
 */

exports.success = (message, data, statusCode) => ({
    message,
    error: false,
    statusCode,
    data,
});

/**
 * @description Send error response
 *
 * @param { String } message
 * @param { Number } statusCode
 */

exports.error = (message, statusCode) => ({
  message,
  statusCode,
  error: true,
  data: null,
});

/**
 * @description Send validation error response
 *
 * @param { Object | Array } errors
 */

exports.validationError = (errors) => ({
  message: 'Validation Error',
  statusCode: 422,
  error: true,
  errors,
  data: null,
});
  