const parseQuery = function(url) {
  const query = url || location.search.slice(1)
  const res = {}
  query.split('&').forEach(function(part) {
    const item = part.split('=')
    res[item[0]] = item[1]
  })
  return res
}

exports.parseQuery = parseQuery
