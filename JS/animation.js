$(document).ready(function () {
    var $inpts = $('.inpt-el');

    $inpts.on('focus', function (e) {
        var $input = $(this);
        var $value = $input.val();
        var $sibling = $input.siblings();
        if ($sibling.hasClass('label')) {
            var label = $sibling;
            label.addClass('active');
        }
    });

    $inpts.on('blur', function (e) {
        var $input = $(this);
        var $value = $input.val();
        var $sibling = $input.siblings();
        if ($sibling.hasClass('label')) {
            var label = $sibling;
            if ($value != '' || $value) {
                console.log('ispali Blur Value !=')
                label.addClass('active');

            } else {
                console.log('ispali Blur Value ELSE')
                label.removeClass('active');
            }
        }
    });

    var btnForRipple = document.querySelectorAll('.btn-form-submit');
    btnForRipple.forEach(btn => {
        btn.addEventListener('click', function (e) {
            btn = e.target;

            var x = e.clientX - btn.offsetLeft;
            var y = e.clientY - btn.offsetTop;
            console.log('Client x', e.clientX, 'offsetLeft', e.target.offsetLeft)
            var ripple = document.createElement('div');
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            btn.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 500)
        })
    })

})