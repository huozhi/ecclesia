$(document).ready(function() {
    
  $('#sign-up-btn').click(function () {
    var name = $('#username').val(),
        pwd = $('#password').val(),
        pwdrpt = $('#repeatpwd').val(),
        email = $('#useremail').val();
    $.ajax({
      url: '/reg',
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({username: name, userPwd: pwd}),
      success: function (data) {
        if (data.result === true) {
          window.location.href = '/home';
        } else {
          window.location.href = '/';
        }
      }
    });
  });
  $(window).resize(function() {
    if (document.body.offsetWidth < 1320) {
      $('body').css('zoom',document.body.offsetWidth / 1320);
    }
    else {
      $('body').css('width',document.body.offsetWidth);
      $('body').css('zoom',1.0);
    }
  });
});