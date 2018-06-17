const parseQuery = function(url) {
  const query = url || location.search.slice(1)
  const res = {}
  query.split('&').forEach(function(part) {
    const item = part.split('=')
    res[item[0]] = item[1]
  })
  return res
}

const removeChildren = (foo) => {
  while (foo.firstChild) {
    foo.firstChild.remove()
  }
}


exports.parseQuery = parseQuery
exports.removeChildren = removeChildren
