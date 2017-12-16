// polyfill
window.marked = require('marked')
window.$ = window.jQuery = require('jquery')
require('bootstrap')

// app modules
const FormController = require('./form')

// execute
window.addEventListener('load', FormController)
