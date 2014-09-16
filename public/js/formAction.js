$(document).ready(function() {
  $("#sign-up-btn").click(function(){
    window.location.href = "/";
  });

  $('#cancel-btn').click(function() {
    window.location.href = "/";
  })

  $("#sign-in-btn").click(function(){
    var name = $("#inputUsername").val();
    var pwd = $("#inputPassword").val();
    $.post("/login/loginCheck", { username:name, userPwd:pwd }, function(result){
        //alert(message);
        if(result){
          $.cookie('username', name);
          sessionStorage.setItem('username', name);
          window.location.href = "/home";
        }else{
          alert('login failed');
        }
    });
  });
});