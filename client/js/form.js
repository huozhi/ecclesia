// Usage:
// <form class="ecc-form">

const $ = require('jquery')

function form() {
  const dangerColor = '#f2dede'
  const warningColor = '#fcf8e3'

  $(document).on('submit', '.ecc-form', function(e) {
    e.preventDefault()
    const $form = $(this)
    const $inputs = $('input', $form)
    $.ajax({
      type: $form.attr('method'),
      url: $form.attr('action'),
      data: $form.serialize(),
    })
    .done(data => {
      window.location.href = (data && data.next) || '/'
    })
    .fail(res => {
      const err = res.responseJSON || res.responseText
      window.alert(err && err.message)
      $inputs.css('background-color', warningColor)
    })
  })

  $(document).on('focus', '.ecc-form input', function() {
    $(this).css('background-color', '')
  })
}

module.exports = form
