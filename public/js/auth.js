'use strict'

var user = function(name, pass, email) {
  this.username = name
  this.password = pass
  this.email = email
}

user.login = function () {
  var userInfo = { 
    username: this.username,
    password: this.password
  }
  $.post('/login',
    userInfo,
    function(response) {
      if (response.status === "success") {
        // sessionStorage.setItem('username', response.username)
        window.location.href = "/home"
      }
      else {
        console.log(response.message)
      }
    })
}

user.register = function () {
  $.post('/register', {
      username: this.username,
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
  this.username = name
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


