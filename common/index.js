const statusCodes = require('http').STATUS_CODES

const response = function(message, data) {
  return {
    message: message,
    data: data
  }
}

exports.validParams = function() {
  return arguments.every(item => item != null)
}

exports.successResult = function(data) {
  return response('success', data)
}

exports.errors = function(res, code, err) {
  console.error(err && err.stack)
  return res.status(code).send(err || statusCodes[code])
}

exports.getAuthToken = function(req) {
  if (!req.session.user) {
    return req.cookies['c_u']
  }
  return req.session.user._id
}
