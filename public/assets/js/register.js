$(document).ready(function () {
  const $inputEmail = $("#inputEmail");
  const $inputPassword = $('#inputPassword');
  const $confirmPassword = $('#confirmPassword');
  $('#register-form').submit(async function (e) {
    e.preventDefault();
    if ($inputPassword.val() !== $confirmPassword.val()) {
      $('#confirm-psw-label').show();
      return false;
    }

    const response = await fetch("/api/users/register", {
      method: "post",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        email: $inputEmail.val(),
        password: $inputPassword.val()
      })
    });
    if(response.ok){
      window.location.href = "/";
    }else{
      const {message} = await response.json();
      alert("Error: " + message);
    }
  });

  $('#inputPassword, #confirmPassword').on('keyup', function () {
    let toggle = $inputPassword.val() !== $confirmPassword.val();
    $confirmPassword.toggleClass('is-invalid', toggle);
    $confirmPassword.toggleClass('is-valid', !toggle);
    if (!toggle) {
      $('#confirm-psw-label').hide();
    } else {
      $('#confirm-psw-label').show();
    }
  });

});