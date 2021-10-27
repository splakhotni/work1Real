$(document).ready(function(){
    $(".reviews__slider").owlCarousel({
        nav: true,
        dots: false,
        margin: 20,
        responsive : {
            0 : {
                items: 1,
            },
            570 : {
                items: 2,
            },
            999 : {
                items: 3,
            },
            1099 : {
                items: 4,
            }
        }
    });
});



