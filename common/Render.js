module.exports = function (req, res, layout, partial, opts) {
  opts = (typeof opts === 'undefined') ? {} : opts;
  if (req.header('x-pjax')) {
    res.renderPjax(partial, opts);
  }
  else {
    res.render(layout, opts);
  }
}

