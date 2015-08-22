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
  $.postJSON('/login',
    userInfo,
    function(data, textStatus, jqXHR) {
      if (data.status === "ok") {
        sessionStorage.setItem('username', data.username)
        window.location.href = "/home"
      }
      else {
        alert(data.message)
      }
    }, 'json')
}

user.register = function () {
  $.postJSON('/register', {
      username: this.username,
      password: this.password,
      passrept: $('#repeatpwd').val(),
      email: this.email   
    },
    function (data) {
      if (data.status === "ok") {
        window.location.href = '/home'
      }
      else {
        alert(data.message)
        // window.location.href = '/'
      }
    }, 'json')
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


