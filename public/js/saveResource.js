
function saveImage(_ele, _eleType, _page) {
  var $ele = _ele;
  var base64code = $ele.get(0).toDataURL().replace(/^data:image\/(png|jpg);base64,/, "");
  var req;
  switch (_eleType) {
    case 'chart':
      req = 'upload-chart';
      break;
    case 'sketch':
      req = 'upload-sketch';
      break;
  }
  $.ajax({
    url: '/chat/upload-img',
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stingfy({
      request: req,
      page: _page,
      img: base64code
    }),
    success: function(data) {
      alert(JSON.stringify(data));
    },
    err: function(err) {
      alert(err);
    }
  });
}
