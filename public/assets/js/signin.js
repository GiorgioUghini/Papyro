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