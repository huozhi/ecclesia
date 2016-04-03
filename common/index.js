var response = function(status, result) {
  return {
    status: status,
    result: result
  }
}

exports.successResult = function(data) {
  return response('success', data)
}

exports.errors = {
  400: function(res, message) {
    return res.status(400).send(response('bad request', message))
  },
  403: function(req, message) {
    return res.status(403).send(response('access denied', message))
  },
  404: function(res, message) {
    return res.status(404).send(response('not found', message))
  },
  500: function(res, message) {
    return res.status(500).send(response('internal server error', message))
  },
}

exports.getAuthToken = function(req) {
  if (!req.session.user) {
    return req.cookies['c_u']
  }
  return req.session.user._id
}


exports.renderPjax = function (req, res, layout, partial, opts) {
  opts = (typeof opts === 'undefined') ? {} : opts;
  if (req.header('x-pjax')) {
    res.renderPjax(partial, opts);
  }
  else {
    res.render(layout, opts);
  }
}

exports.handleError = function (err, callback) {
  if (err) {
    console.log(err); return callback(err)
  }
}
