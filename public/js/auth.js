$(document).ready(function () {
  $('form').submit(function(e) {
    e.preventDefault()
    var form = $(this)
    $.ajax({
      type: form.attr('method'),
      url: form.attr('action'),
      data: form.serialize(),
    })
    .done(function(response) {
      console.log('success', response)
      window.location.reload()
    })
    .fail(function(err) {
      console.error(err)
    })
  })
})
