
document.addEventListener('DOMContentLoaded', function () {

    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.pillnav');

    if (!menuToggle || !menu) return;

    menuToggle.addEventListener('click', function () {
        menu.classList.toggle('open');
        menuToggle.classList.toggle('active');
    });

    menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            menu.classList.remove('open');
            menuToggle.classList.remove('active');
        });
    });

});
