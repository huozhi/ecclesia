function User(name, pass, email) {
  this.username = name;
  this.password = pass;
  this.email = email;
}

User.prototype.login = function () {
  var user = { 
    username: this.username,
    password: this.password
  };
  $.postJSON('/login',
    user,
    function(data, textStatus, jqXHR) {
      if (data.response) {
        $.cookie('username', data.username);
        sessionStorage.setItem('username', data.username);
        window.location.href = "/home";
      }
      else {
        alert(data.message);
        // window.location.href = "/login";
      }
    }, 'json');
}

User.prototype.register = function () {
  var user = {
    username: this.username,
    password: this.password,
    passrept: passrept,
    email: this.email   
  };
  $.postJSON('/register', 
    function (data) {
      if (data.result === true) {
        window.location.href = '/home';
      }
      else {
        alert(data.message);
        // window.location.href = '/';
      }
    }, 'json');
}

User.prototype.set = function (name, pass, email) {
  this.username = name;
  this.password = pass;
  this.email = email;
}

User.prototype.valid = function () {
  // var password = $('#password').val(),
  var passrept = $('#repeatpwd').val();
  return this.password === passrept;
}


$(document).ready(function () {
  var user = new User();
  var name, pass, rept, email;

  // login
  $('#login-btn').click(function () {
    name = $('#username').val();
    pass = $("#password").val();
    user.set(name, pass);
    user.login();
  });

  // registration
  $('#sign-up-btn').click(function () {
    name = $('#username').val();
    pass = $('#password').val();
    // rept = $('#repeatpwd').val();
    email = $('#useremail').val();
    if (user.valid()) {
      user.set(name, pass, email);
      user.register();
    }
  });

  // keyboard binding
  $('input').keypress(function (e) {
    var key = e.which;
    if (key === 13) {
      $('button').trigger('click');
    }
  });
});


