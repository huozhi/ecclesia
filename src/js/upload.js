'use strict'

function validMarkdown () {
  var markdown = $('#upload-md-file').get(0).files[0],
      fileName = markdown.name,
      fileType = fileName.split('.')[1];
  if (['md','markdown','mdown'].indexOf(fileType) != -1) {
    return true;
  }
  else {
    console.log(fileType);
    return false;
  }
}

function sendFile (file) {
  if (!file) return;
  var fd = new FormData(file);
  fd.append('impress', file, file.name);
  $.ajax({
    url: '/chat/upload/impress',
    data: fd,
    cache: false,
    contentType: false,
    processData: false,
    type: 'post',
    success: function(data){
      console.log(data);
      file = null;
    }
  });
}

$(document).ready(function () {
  var $uploadFile = $('#upload-md-file');
  var file = null;
  $('#scan-btn').click(function () {
    $uploadFile.click();
  });
  $uploadFile.change(function() {
    $this = $(this);
    file = this.files[0];
    console.log(file);
    if (true) {
      $('#md-file-path').val($this.val());
      $('#upload-message').removeClass('alert-danger').addClass('alert-success').text('file type accepted');
      $('#upload-impress-btn').removeClass('disabled');
    } else {
      $(this).replaceWith( $uploadFile = $uploadFile.clone(true) );
      $('#upload-message').removeClass('alert-success').addClass('alert-danger').text('file type refused');
      $('#md-file-path').val('');
    }
  });

  $sendBtn = $('#upload-impress-btn');
  $sendBtn.click(function() {
    sendFile(file);
  });
});
