// polyfill
window.marked = require('marked')
window.$ = window.jQuery = require('jquery')
require('bootstrap')

require('./form')
require('./slide-markdown')
