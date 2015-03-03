$(document).ready(function() {
    $('#login-form').submit(function( e ) {
        e.preventDefault();
        var user = $('#username').val();
        var sex = $('input[name=sex]:checked', '#login-form').val();
        localStorage['username'] = user;
        localStorage['sex'] = sex;
        alert('Benvenuto ' + user + '!');
        window.location = 'play.html';
    });
});