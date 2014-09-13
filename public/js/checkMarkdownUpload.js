function getUploadMarkdown() {
  var mdFile = $('#upload-md-file').get(0).files[0],
      fileName = mdFile.name,
      fileType = fileName.split('.')[1];
  if (['md','markdown','mdown'].indexOf(fileType) != -1) {
    return true;
  }
  else {
    window.console.log(fileType);
    return false;
  }

}

$(document).ready(function () {
  var $uploadFile = $('#upload-md-file');
  $('#scan-btn').click(function() {
    $uploadFile.click();
  });
  $uploadFile.change(function() {
    if (getUploadMarkdown()) {
      $('#md-file-path').val($(this).val());
      $('#upload-message').removeClass('alert-danger').addClass('alert-success').text('file type accepted');
      $('#upload-btn').removeClass('disabled');
    } else {
      $(this).replaceWith( $uploadFile = $uploadFile.clone(true) );
      $('#upload-message').removeClass('alert-success').addClass('alert-danger').text('file type refused');
      $('#md-file-path').val('');
      $('#upload-btn').addClass('disabled');
    }
  });

  $('#upload-btn').click(function () {
    var upfile = $('#upload-md-file').get(0).files[0];
    var fileReader = new FileReader();
    var _text;
    fileReader.onload = function(e) {
      _text = fileReader.result;      
      $.post('/chat/upload-markdown/',{ text: _text },function(ret) {
        // alert(ret);
      });
    };
    fileReader.readAsText(upfile);
  })
});