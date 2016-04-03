var $room = $('input[name="room"]'),
    $host = $('input[name="host"]'),
    $create = $('a[name="create"]'),
    $join = $('a[name="join"]'),
    $sure = $('#sure')

var HomeCtrl = {
  action: 'create'
}

HomeCtrl.init = function() {
  // dynamic form
  $host.parent().hide()
  $create.click(function() {
    $host.parent().hide()
    HomeCtrl.action = 'create'
  })
  $join.click(function() {
    $host.parent().show()
    HomeCtrl.action = 'join'
  })

  // post data
  $sure.click(function() {
    if (HomeCtrl.action === 'create') {
      HomeCtrl.create()
    }
    else if (HomeCtrl.action === 'join') {
      HomeCtrl.join()
    }
  })

}

HomeCtrl.create = function() {
  $.post('/home/create', {
    room: $room.val()
  }, function (response) {
    // console.log('create', response)
  })
}

HomeCtrl.join = function() {
  $.post('/home/join', {
    room: $room.val(),
    host: $host.val(),
  }, function (response) {
    // console.log('join', response)
  })
}

$(document).ready(function() {
  HomeCtrl.init()
})
