$.postJSON = function (url, dataObject, callback, dataType) {
  var opts = {
    url: url,
    type: 'post',
    data: JSON.stringify(dataObject),
    contentType: 'application/json',
    success: callback
  };
  if (dataType !== undefined) {
    opts.dataType = dataType;
  }
  return $.ajax(opts);
}