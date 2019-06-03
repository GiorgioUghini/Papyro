$(document).ready(function () {
  const token = Cookies.get("token");
  if(token) {
    $(".login-show").each(function () {
      $(this).show();
    });
  } else {
    $(".login-hide").each(function () {
      $(this).show();
    });
  }

  $("#signoutButton").click(function(e) {
    e.preventDefault();
    Cookies.remove("token");
    window.location.href = "/";
  });
});

const handleError = function(response){
  if(response.ok) return;
  response.json().then(obj => {
    alert(obj.message);
    window.location.href = "/";
  });
};