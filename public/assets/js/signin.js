$(document).ready(function () {
  $('#signin-form').submit(async function (e) {
    e.preventDefault();
    const result = await fetch("/api/users/login", {
      method: "post",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        email: $("#inputEmail").val(),
        password: $("#inputPassword").val()
      })
    });
    if(result.ok){
      const {jwt} = await result.json();
      Cookies.set("token", jwt, {
        expires: new Date("2099-12-12")
      });
      window.location.replace('/');
    }else{
      const {message} = await result.json();
      alert("Error: " + message);
    }
  });
});