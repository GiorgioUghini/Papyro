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
});

const handleError = function(response){
  if(response.ok) return;
  response.json().then(obj => {
    alert(obj.message);
    window.location.href = "/";
  });
};