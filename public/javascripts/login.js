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


/* CAPTCHA Script */

function checkform(theform){
var why = "";

if(theform.CaptchaInput.value == ""){
why += "- Please Enter CAPTCHA Code.\n";
}
if(theform.CaptchaInput.value != ""){
if(ValidCaptcha(theform.CaptchaInput.value) == false){
why += "- The CAPTCHA Code Does Not Match.\n";
}
}
if(why != ""){
alert(why);
return false;
}
}

var a = Math.ceil(Math.random() * 9)+ '';
var b = Math.ceil(Math.random() * 9)+ '';
var c = Math.ceil(Math.random() * 9)+ '';
var d = Math.ceil(Math.random() * 9)+ '';
var e = Math.ceil(Math.random() * 9)+ '';

var code = a + b + c + d + e;
document.getElementById("txtCaptcha").value = code;
document.getElementById("CaptchaDiv").innerHTML = code;

// Validate input against the generated number
function ValidCaptcha(){
var str1 = removeSpaces(document.getElementById('txtCaptcha').value);
var str2 = removeSpaces(document.getElementById('CaptchaInput').value);
if (str1 == str2){
return true;
}else{
return false;
}
}

// Remove the spaces from the entered and generated code
function removeSpaces(string){
return string.split(' ').join('');
}