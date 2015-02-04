
function login () {
  var name = $("#username").val();
  var pwd = $("#password").val();
  $.postJSON('/login',
    { username: name, password: pwd },
    function(data, textStatus, jqXHR) {
      if(data.response) {
        $.cookie('username', data.username);
        sessionStorage.setItem('username', data.username);
        window.location.href = "/home";
      }
      else {
        window.location.href = "/login";
      }
    }, 'json');
}

function reg () {
  var username = $('#username').val(),
      password = $('#password').val(),
      passrept = $('#repeatpwd').val(),
      email = $('#useremail').val();
  $.postJSON('/register', {
      username: username,
      password: password,
      passrept: passrept,
      email: email
    },
    function (data) {
      if (data.result === true) {
        window.location.href = '/home';
      } else {
        window.location.href = '/';
      }
    }
  }, 'json');
}

$(document).ready(function () {
  $('#login-btn').click(login);
  $('#sign-up-btn').click(reg);
  $('input').keypress(function (e) {
    var key = e.which;
    if (key === 13) {
      $("button").trigger('click');
    }
  });
});


