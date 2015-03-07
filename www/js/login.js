$(document).ready(function() {
    //$("[name='sex']").bootstrapSwitch();
    
    $('#login-form').submit(function( e ) {
        e.preventDefault();
        var user = $('#username').val();
        if (!user) {
            alert('Per favore, digitare nome utente.');
            return;
        }
        var sex = $('input[name=sex]:checked', '#login-form').val();
        localStorage['username'] = user;
        localStorage['sex'] = sex;
        alert('Benvenuto ' + user + '!');
        window.location = 'play.html';
    });
});