/**
 * Created by atomic on 5/12/17.
 */


$(document).ready(function () {
    var modal = document.getElementById('id01');


// When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };


    $("#login-signup-form").submit(function (event) {
        event.preventDefault();
        var $form = $(this);

        $.post( $form.attr('action'), $form.serialize(),
            function (data, status) {
                // console.log(data);
                // console.log(status);
                // console.log(status.code);
                $(".omb_loginform").after('<h2 class="text-info text-success"> Signup Successful</h2>');
                document.getElementById('id01').style.display='none';
            }).fail(function (err) {
                alert(err.responseText);
        });
    });
});
