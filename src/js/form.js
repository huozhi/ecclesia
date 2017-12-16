function FormController() {
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
    .done(data => {
      window.location.href = (data && data.next) || '/'
    })
    .fail(err => {
      $inputs.css('background-color', warningColor)
    })
  })
  $inputs.on('focus', function() {
    $(this).css('background-color', '')
  })
}

module.exports = FormController
