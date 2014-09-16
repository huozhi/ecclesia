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
      $('#upload-impress-btn').removeClass('disabled');
    } else {
      $(this).replaceWith( $uploadFile = $uploadFile.clone(true) );
      $('#upload-message').removeClass('alert-success').addClass('alert-danger').text('file type refused');
      $('#md-file-path').val('');
      $('#upload-impress-btn').addClass('disabled');
    }
  });

  $('#upload-impress-btn').click(function () {
    var upfile = $('#upload-md-file').get(0).files[0];
    var fileReader = new FileReader();
    var _text;
    fileReader.onload = function(e) {
      _text = fileReader.result;      
      $.ajax({
        url: '/chat/upload-markdown',
        type: 'POST',
        data: JSON.stringify({ text: _text }),
        contentType: 'application/json',
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
          // the server return value and 
          // database structure should be fixed          var splitedMdArr = data.markdowns;
          var $mdScript = $("<script />", {
            html: splitedMdArr,
            type: "text/template"
          });
          var $text = $('<section data-markdown></section>').append($mdScript);
          // console.log($impressText);
          $('#reveal > .slides').append($text);
          while (!Reveal.isLastSlide()) Reveal.next();
          RevealMarkdown.reinit();
        },
        error: function (err) {
          alert(err);
        }
      });
    };
    fileReader.readAsText(upfile);
    $('#add-impress-modal').modal('toggle');
  });
});