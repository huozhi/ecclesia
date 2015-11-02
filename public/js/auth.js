'use strict'

var user = {
  name: null,
  pass: null,
  email: null,
}

user.login = function () {
  var userInfo = { 
    name: this.name,
    password: this.password
  }

  $.post('/login', userInfo)
  .done(function(response) {
    // console.log(response)
    location.href = '/home'
  })
  .fail(function(err) {
    console.log(err.responseJSON)
  })

}

user.register = function () {
  $.post('/register', {
      name: this.name,
      password: this.password,
      passrept: $('#repeatpwd').val(),
      email: this.email   
    },
    function (response) {
      if (response.status === "success") {
        window.location.href = '/home'
      }
      else {
        console.log(response.message)
        // window.location.href = '/'
      }
    })
}

user.set = function (name, pass, email) {
  this.name = name
  this.password = pass
  this.email = email
}

user.valid = function () {
  var passrept = $('#repeatpwd').val()
  return this.password === passrept
}


$(document).ready(function () {
  var name, pass, rept, email

  // login
  $('#login').click(function () {
    name = $('#username').val()
    pass = $("#password").val()
    user.set(name, pass)
    user.login()
  })

  // registration
  $('#signup').click(function() {
    console.log('registing...')
    name = $('#username').val()
    pass = $('#password').val()
    email = $('#useremail').val()
    user.set(name, pass, email)
    if (user.valid()) {
      user.register()
      console.log('posting data...', user.name, user.password)
    }
    else {
      console.log('reg error')
    }
  })

  // keyboard binding
  $('input').keypress(function (e) {
    var key = e.which
    if (key === 13) {
      $('button').trigger('click')
    }
  })
})


