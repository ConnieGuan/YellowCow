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

        var $form = $(this);

        $.post( $form.attr('action'), $form.serialize(),
            function (data) {
                $(".omb_loginform").after('<p class="text-info"> Signup Successful</p>');
                document.getElementById('id01').style.display='none';
            });
    });
});
