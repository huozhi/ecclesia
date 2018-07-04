'use strict'

// Usage:
// <div class="ecc-slide">
//   <div data-markdown-slide> raw markdown here </div>
// </div>

const marked = require('marked')

function markdown() {
  document.querySelectorAll('[data-markdown-slide]').forEach(function(ele) {
    ele.innerHTML = marked(ele.textContent.trim())
  })
}

module.exports = markdown
