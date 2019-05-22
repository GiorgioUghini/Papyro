$(document).ready(function() {

    $('#signin-form').submit(function() {

        $.ajax({
            type: "POST",
            url: 'api/users/login',
            data: {
                email: $("#inputEmail").val(),
                password: $("#inputPassword").val()
            },
            success: function(res)
            {
                if (res.jwt != null) {
                    Cookies.set("token", res.jwt, {
                      expires: new Date("2099-12-12")
                    });
                    window.location.replace('/');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("Error " + textStatus + " " + errorThrown);
            }
        });
        return false;

    });
});