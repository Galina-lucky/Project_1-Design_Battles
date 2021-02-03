;(function() {

  "usestrict";

  let nav = $('.js-nav');
  let menu = $('.js-menu');
  let menuLink = $('.js-menu__link');
  let menuBtn = $('.js-btn-toggle-menu');

  $(document).ready(function() {

    getNavTopSize();
    smoothScroll();
    setMenuStiky();
    checksInputEmptiness()
    hideMobileMenu();
    
    menuBtn.on('click', function() {
      menu.toggleClass('menu--show');
    });

    menuLink.on('click', function() {
      menu.removeClass('menu--show');
    });
  })

  $(window).on('scroll', function() {
    showActiveMenuItem();
    setMenuStiky()
  });

  $(window).on('resize', function(){
    getNavTopSize();

    if ( $(window).width() > 767 ) {
      menu.removeClass('menu--show');
    }
  });

  function getNavTopSize() {
      navTop = ($(window).width() < 768) ? 15 : 30;
    }

  // Make the main menu sticky
  function setMenuStiky() {
    ($(this).scrollTop() > navTop)
      ? nav.addClass('nav--stiky')
      : nav.removeClass('nav--stiky');
  }

  // Show active menu item when scrolling
  function showActiveMenuItem() {
    let scrollTop = $(window).scrollTop();
    
    menuLink.each( function() {
      let link = $(this).attr("href");
      let target = $(link);

      if ( ((target.offset().top <= scrollTop)
        && (target.offset().top + target.outerHeight() > scrollTop))
        /*|| (scrollTop == $(document).height() - $(window).height())*/ ) {
        menuLink.removeClass("menu__link--active");
        $(this).addClass("menu__link--active");
      } else {
        $(this).removeClass("menu__link--active");
      }
/*      if (scrollTop == $(document).height() - $(window).height()) {
        menuLink.last().addClass("menu__link--active")
      }*/
    });
  }

  // Hide menu in mobile version
  function hideMobileMenu() {
    let el = $('.js-btn-toggle-menu__item');    

    $(document).click(function (e) {
      if ( !menuBtn.is(e.target)  && !el.is(e.target)  && !menu.is(e.target) && menu.hasClass('menu--show') ) {
        menu.removeClass('menu--show');
      };
    });
  }  

  // Smooth scrolling
  function smoothScroll() {
    menuLink.on('click', function (event) {
      event.preventDefault();
      elementClick = $(this).attr("href")
      destination = $(elementClick).offset().top+1;
      
      $('html, body').animate({
        scrollTop: destination
      }, 600);
    });
  }

  // Checks the input for emptiness and places the label
  function checksInputEmptiness() {
    let input = $('.js-form-contact__input');

    input.on('blur', function() {
      let idInput = $(this).attr("id");
      let label = $('.js-form-contact__caption[for="' + idInput +'"]');
      let val = $(this).val();

      (val.length >= 1)
      ? label.addClass('form-contact__caption--bottom')
      : label.removeClass('form-contact__caption--bottom');
    });
  }
})();