$(document).ready(function () {
    const message = Cookies.get("message");
    const error = Cookies.get("error");

    $("#message").text(message);
    if(error){
        try{
            const jsonErr = JSON.parse(error);
            $("#error").text(jsonErr.stack);
        }catch (e) {}
        jsonErr.text(error);
    }
});