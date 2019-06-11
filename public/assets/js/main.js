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

  $("#signoutButton").click(async function(e) {
    e.preventDefault();
    const response = await fetch("/api/users/logout", {
      method: "post",
      headers: new Headers({
        "Content-Type": "application/json",
        authorization: "Bearer " + Cookies.get("token")
      })
    });
    if(!response.ok){
      const message = await response.json();
      alert("Error: " + message);
    }
    Cookies.remove("token");
    window.location.href = "/";
  });

  const path = window.location.pathname;
  if(path!=="/"){
    $("nav.navbar .nav-item.active").removeClass("active");
    $("nav.navbar .nav-item").each(function(){
      const href = $(this).children("a").attr("href");
      if(path.startsWith(href) && href!=="/"){
        $(this).addClass("active");
      }
    })
  }
});

const handleError = function(response){
  if(response.ok) return;
  response.json().then(obj => {
    alert(obj.message);
    window.location.href = "/";
  });
};