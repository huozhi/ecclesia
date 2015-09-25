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
  404: function(res, message) {
    return res.status(404).send(response('not found', message))
  },
  500: function(res, message) {
    return res.status(500).send(response('internal server error', message))
  },
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
};

exports.compress = function (s) {
    var dict = {};
    var data = (s + "").split("");
    // console.log(data);
    var out = [];
    var currChar;
    var phrase = data[0];
    var code = 256;
    for (var i=1; i<data.length; i++) {
        currChar=data[i];
        // hash here
        if (dict[phrase + currChar] != null) {
            phrase += currChar;
        }
        else {
            out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
            dict[phrase + currChar] = code;
            code++;
            phrase=currChar;
        }
    }
    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
    for (var i=0; i<out.length; i++) {
        out[i] = String.fromCharCode(out[i]);
    }
    // console.log(dict);
    return out.join("");
}
 
// Decompress an LZW-encoded string
exports.uncompress = function (s) {
    var dict = {};
    var data = (s + "").split("");
    // console.log(data);
    var currChar = data[0];
    var oldPhrase = currChar;
    var out = [currChar];
    var code = 256;
    var phrase;
    for (var i=1; i<data.length; i++) {
        var currCode = data[i].charCodeAt(0);
        if (currCode < 256) {
            phrase = data[i];
        }
        else {
            phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
            // case (oldPhrase + currChart) for utf-8 character encode in two integers
        }
        out.push(phrase);
        currChar = phrase.charAt(0);
        dict[code] = oldPhrase + currChar;
        code++;
        oldPhrase = phrase;
    }
    return out.join("");
}

