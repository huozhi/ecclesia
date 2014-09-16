
function saveImage(base64code, _eleType, _page, callback) {
  // var $ele = _ele;
  // var base64code = _ele.get(0).toDataURL();
  console.log(base64code);

  // alert(base64code);
  var imageType;
  switch (_eleType) {
    case 'chart':
      window.console.log('save chart');
      imageType = 'chart';
      break;
    case 'sketch':
      window.console.log('save sketch');
      imageType = 'sketch';
      break;
  }
  $.ajax({
    url: '/chat/upload-img',
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({
      request: imageType,
      page: _page,
      img: lzw_compress( base64code )
    }),
    success: function(data) {
      var objectId = data.objectId,
          saveImgType = data.imgType;
      console.log(data.response, objectId, saveImgType);
      callback({objectId:objectId, imgType:saveImgType});
    },
    err: function(err) {
      alert(err);
    }
  });
}
