'use strict'

// Usage:
// <div class="ecc-slide">
//   <div data-slide> raw markdown here </div>
// </div>

+function ($) {
  $(document).on('load', '.ecc-slide [data-slide]', function() {
    const $elem = $(this)
    var text = marked($elem.text()).trim()
    $elem.html(text)
  })
}(jQuery);
