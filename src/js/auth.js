$(document).ready(() => {
  const $inputs = $('input')
  const dangerColor = '#f2dede'
  const warningColor = '#fcf8e3'
  $('form').submit(function(e) {
    e.preventDefault()
    var form = $(this)
    $.ajax({
      type: form.attr('method'),
      url: form.attr('action'),
      data: form.serialize(),
    })
    .done(response => {
      if (!response.ret) {
        $inputs.css('background-color', dangerColor)
      } else {
        window.location.reload()
      }
    })
    .fail(err => {
      $inputs.css('background-color', warningColor)
    })
  })
  $inputs.on('focus', function() {
    $(this).css('background-color', '')
  })
})
