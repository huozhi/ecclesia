$(document).ready(function() {
  

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
          window.location.href = "/login";
        }
    });
  });
});