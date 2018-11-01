$('#form-submit').click(function(){
    var name = $('#form-name').val();
    var email = $('#form-email').val();
    var title = $('#form-subject').val();
    var message = $('#form-message').val();

    $.post("/emailform", { name: name, email: email, title: title, message: message }, function(res){
        if (res.success) {
            alert('Your email has been sent! Expect a response within a week.')
        } else {
            alert(res.error)
        }
    });

    return false;

});