$(document).ready(function () {
    const error = Cookies.get("error");
    console.log(error);
    const jsonError = JSON.parse(error);
    $("#message").text(jsonError.message);
    $("#error").text(jsonError.stack);
});