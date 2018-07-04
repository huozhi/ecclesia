window.$ = window.jQuery = require('jquery')
require('bootstrap')
// require('./tab')()
// require('./modal')()
require('./form')()
require('./slide-markdown')()

const Navigo = require('navigo')
const initChatPage = require('./chat')

const router = new Navigo(location.origin)

router
  .on('chat', initChatPage)
  .resolve()
