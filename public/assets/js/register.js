$(document).ready(function() {

    $('#register-form').submit(function() {
        if ($('#inputPassword').val() != $('#confirmPassword').val()) {
            $('#confirm-psw-label').show();
            return false;
        }
        $.ajax({
            type: "POST",
            url: 'api/users/register',
            data: {
                email: $("#inputEmail").val(),
                password: $("#inputPassword").val()
            },
            success: function(res)
            {
                window.location.replace('/');
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("Error " + textStatus + " " + errorThrown);
            }
        });
        return false;

    });

    $('#inputPassword, #confirmPassword').on('keyup', function () {
        var form = document.getElementsByClassName('needs-validation');
        let toggle = $('#inputPassword').val() != $('#confirmPassword').val();
        $('#confirmPassword').toggleClass('is-invalid', toggle);
        $('#confirmPassword').toggleClass('is-valid', !toggle);
        if (!toggle) {
            $('#confirm-psw-label').hide();
        } else {
            $('#confirm-psw-label').show();
        }
    });

});