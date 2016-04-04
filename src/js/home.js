const $room = $('input[name="room"]'),
      $host = $('input[name="host"]');

$(document).ready(function () {
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
    .done(function(data) {
      console.debug(data)
      if (data.fail) {
        $inputs.css('background-color', dangerColor)
      } else {
        window.location.href = data.next
      }
    })
    .fail(function(err) {
      $inputs.css('background-color', warningColor)
    })
  })
  $inputs.on('focus', function() {
    $(this).css('background-color', '')
  })
})
