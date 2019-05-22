$(document).ready(function () {
  const token = Cookies.get("token");
  if(token){
    $(".login-show").each(function () {
      $(this).show();
    });
    $(".login-hide").each(function () {
      $(this).hide();
    });
  }else{
    $(".login-show").each(function () {
      $(this).hide();
    });
    $(".login-hide").each(function () {
      $(this).show();
    });
  }

  $("#signoutButton").click(function(e){
    e.preventDefault();
    Cookies.remove("token");
    window.location.href = "/";
  })
});