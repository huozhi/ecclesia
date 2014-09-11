$(document).ready(function(){
  $("#sign-up-button").click(function(){
    var name = $("#usernametext").val();
    var pwd = $("#passwordtext").val();
    var repwd = $("#repeattext").val();

    if( pwd === repwd ){
       $.post("/register", {username:name, userPwd:pwd}, function(result){
          if(result){
            alert("sign up success");
            window.location.href = "/login";
          }
       });      
    }else{
      alert("difference password");
    }
  });

  $("#sign-in-btn").click(function(){
    var name = $("#inputUsername").val();
    var pwd = $("#inputPassword").val();
    $.post("/login", {username:name, userPwd:pwd}, function(result){
        //alert(message);
        if(result){
          window.location.href = "/home";
        }else{
          alert('login failed');
        }
    });
  });
});