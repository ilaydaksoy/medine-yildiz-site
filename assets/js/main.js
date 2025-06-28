/**
* Template Name: Medilab
* Updated: Mar 10 2023 with Bootstrap v5.2.3
* Template URL: https://bootstrapmade.com/medilab-free-medical-bootstrap-theme/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Sticky header on scroll
   */
  const selectHeader = document.querySelector('#header');
  if (selectHeader) {
    document.addEventListener('scroll', () => {
      window.scrollY > 100 ? selectHeader.classList.add('header-scrolled') : selectHeader.classList.remove('header-scrolled');
    });
  }

  /**
   * Back to top button
   */
  const backtotop = document.querySelector('.back-to-top');
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active');
      } else {
        backtotop.classList.remove('active');
      }
    }
    window.addEventListener('load', toggleBacktotop);
    document.addEventListener('scroll', toggleBacktotop);
  }

  /**
   * Mobile nav toggle
   */
  const mobileNavShow = document.querySelector('.mobile-nav-show');
  const mobileNavHide = document.querySelector('.mobile-nav-hide');

  document.querySelectorAll('.mobile-nav-toggle').forEach(el => {
    el.addEventListener('click', function(event) {
      event.preventDefault();
      mobileNavToogle();
    })
  });

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavShow.classList.toggle('d-none');
    mobileNavHide.classList.toggle('d-none');
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  const navDropdowns = document.querySelectorAll('.navbar .dropdown > a');

  navDropdowns.forEach(el => {
    el.addEventListener('click', function(event) {
      if (document.querySelector('.mobile-nav-active')) {
        event.preventDefault();
        this.classList.toggle('active');
        this.nextElementSibling.classList.toggle('dropdown-active');

        let dropDownIndicator = this.querySelector('.dropdown-indicator');
        dropDownIndicator.classList.toggle('bi-chevron-up');
        dropDownIndicator.classList.toggle('bi-chevron-down');
      }
    })
  });

  /**
   * Scroll top button
   */
  const scrollTop = document.querySelector('.scroll-top');
  if (scrollTop) {
    const togglescrollTop = function() {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
    window.addEventListener('load', togglescrollTop);
    document.addEventListener('scroll', togglescrollTop);
    scrollTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /**
   * Initiate glightbox
   */
  if (typeof GLightbox !== 'undefined') {
    GLightbox({ selector: '.glightbox' });
  }

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Testimonials slider
   */
  window.addEventListener('load', function() {
    const swiperElement = document.querySelector('.testimonials .swiper');
    if (swiperElement && typeof Swiper !== 'undefined') {
      new Swiper('.testimonials .swiper', {
        speed: 600,
        loop: true,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false
        },
        slidesPerView: 1,
        pagination: {
          el: '.testimonials .swiper-pagination',
          type: 'bullets',
          clickable: true
        },
        navigation: {
          nextEl: '.testimonials .swiper-button-next',
          prevEl: '.testimonials .swiper-button-prev'
        }
      });
    }
  });

  /**
   * Animation on scroll function and init
   */
  function aos_init() {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', () => {
    aos_init();
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * BMI Calculator
   */
  const bmiForm = document.getElementById('bmiForm');
  const bmiResult = document.getElementById('bmiResult');
  const bmiValue = document.getElementById('bmiValue');
  const bmiCategory = document.getElementById('bmiCategory');

  if (bmiForm) {
    bmiForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const weight = parseFloat(document.getElementById('bmiWeight').value);
      const height = parseFloat(document.getElementById('bmiHeight').value) / 100; // Convert cm to m
      
      if (weight && height) {
        const bmi = weight / (height * height);
        bmiValue.textContent = bmi.toFixed(1);
        
        let category = '';
        let categoryClass = '';
        
        if (bmi < 18.5) {
          category = 'Zayıf';
          categoryClass = 'text-warning';
        } else if (bmi < 25) {
          category = 'Normal';
          categoryClass = 'text-success';
        } else if (bmi < 30) {
          category = 'Fazla Kilolu';
          categoryClass = 'text-warning';
        } else {
          category = 'Obez';
          categoryClass = 'text-danger';
        }
        
        bmiCategory.textContent = category;
        bmiCategory.className = categoryClass;
        
        // Show result with animation
        bmiResult.style.display = 'block';
        bmiResult.classList.add('bounce-stats');
        
        // Scroll to result
        bmiResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  /**
   * Calorie Calculator
   */
  const calorieForm = document.getElementById('calorieForm');
  const calorieResult = document.getElementById('calorieResult');
  const calorieValue = document.getElementById('calorieValue');
  const proteinValue = document.getElementById('proteinValue');
  const carbValue = document.getElementById('carbValue');
  const fatValue = document.getElementById('fatValue');

  if (calorieForm) {
    calorieForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const age = parseInt(document.getElementById('calorieAge').value);
      const gender = document.getElementById('calorieGender').value;
      const weight = parseFloat(document.getElementById('calorieWeight').value);
      const height = parseFloat(document.getElementById('calorieHeight').value);
      const activity = parseFloat(document.getElementById('calorieActivity').value);
      
      if (age && gender && weight && height && activity) {
        let bmr;
        
        // Calculate BMR using Mifflin-St Jeor Equation
        if (gender === 'male') {
          bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else {
          bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }
        
        const tdee = bmr * activity;
        calorieValue.textContent = Math.round(tdee);
        
        // Calculate macronutrients (40% carbs, 30% protein, 30% fat)
        const protein = Math.round((tdee * 0.3) / 4); // 4 calories per gram
        const carbs = Math.round((tdee * 0.4) / 4); // 4 calories per gram
        const fat = Math.round((tdee * 0.3) / 9); // 9 calories per gram
        
        proteinValue.textContent = protein + 'g';
        carbValue.textContent = carbs + 'g';
        fatValue.textContent = fat + 'g';
        
        // Show result with animation
        calorieResult.style.display = 'block';
        calorieResult.classList.add('bounce-stats');
        
        // Scroll to result
        calorieResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  /**
   * Enhanced animations for elements
   */
  function addScrollAnimations() {
    const elements = document.querySelectorAll('.floating-icon, .bounce-stats, .slide-left, .slide-right');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });
    
    elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'all 0.6s ease';
      observer.observe(el);
    });
  }

  // Initialize enhanced animations
  window.addEventListener('load', addScrollAnimations);

  /**
   * Add pulse effect to CTA buttons
   */
  function addPulseEffect() {
    const ctaButtons = document.querySelectorAll('.cta-btn, .btn-primary');
    ctaButtons.forEach(btn => {
      btn.addEventListener('mouseenter', function() {
        this.classList.add('pulse-button');
      });
      
      btn.addEventListener('mouseleave', function() {
        this.classList.remove('pulse-button');
      });
    });
  }

  // Initialize pulse effects
  window.addEventListener('load', addPulseEffect);

  /**
   * FAQ functionality
   */
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-list .question');
    
    faqItems.forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all items
        faqItems.forEach(otherItem => {
          otherItem.classList.add('collapsed');
        });
        
        // Toggle current item
        this.classList.toggle('collapsed');
        
        // Add glow animation to the clicked item
        this.parentElement.classList.add('glow-animation');
        setTimeout(() => {
          this.parentElement.classList.remove('glow-animation');
        }, 1000);
      });
    });
  }

  // Initialize FAQ
  window.addEventListener('load', initFAQ);

  /**
   * Enhanced scroll animations with intersection observer
   */
  function enhancedScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('slide-up');
          
          // Add staggered animations for lists
          if (entry.target.classList.contains('faq-list')) {
            const listItems = entry.target.querySelectorAll('li');
            listItems.forEach((item, index) => {
              setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
              }, index * 100);
            });
          }
        }
      });
    }, observerOptions);

    // Observe elements - exclude faq-list to prevent hiding
    const animatedElements = document.querySelectorAll('.floating-icon, .bounce-stats, .slide-left, .slide-right');
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.6s ease';
      observer.observe(el);
    });
  }

  // Initialize enhanced scroll animations
  window.addEventListener('load', enhancedScrollAnimations);

  /**
   * Add hover effects to service items
   */
  function addServiceHoverEffects() {
    const serviceItems = document.querySelectorAll('.service-item');
    
    serviceItems.forEach(item => {
      item.addEventListener('mouseenter', function() {
        this.classList.add('glow-animation');
      });
      
      item.addEventListener('mouseleave', function() {
        this.classList.remove('glow-animation');
      });
    });
  }

  // Initialize service hover effects
  window.addEventListener('load', addServiceHoverEffects);

  /**
   * Add click effects to CTA buttons
   */
  function addCTAEffects() {
    const ctaButtons = document.querySelectorAll('.cta-btn, .btn-primary');
    
    ctaButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        this.classList.add('shake-animation');
        setTimeout(() => {
          this.classList.remove('shake-animation');
        }, 500);
      });
    });
  }

  // Initialize CTA effects
  window.addEventListener('load', addCTAEffects);

  /**
   * Add parallax effect to hero section
   */
  function addParallaxEffect() {
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        heroSection.style.transform = `translateY(${rate}px)`;
      });
    }
  }

  // Initialize parallax effect
  window.addEventListener('load', addParallaxEffect);

  /**
   * Programs section functionality
   */
  function initPrograms() {
    const programLinks = document.querySelectorAll('.dropdown ul a[href^="#weight"], .dropdown ul a[href="#sports"], .dropdown ul a[href="#pregnancy"], .dropdown ul a[href="#diabetes"]');
    programLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = this.getAttribute('href');
        const programsSection = document.getElementById('programs');
        if (programsSection) {
          programsSection.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => {
            document.querySelectorAll('.departments .tab-pane').forEach(tab => tab.classList.remove('active', 'show'));
            const tabContent = document.querySelector(target);
            if (tabContent) tabContent.classList.add('active', 'show');
            document.querySelectorAll('.departments .nav-link').forEach(nav => nav.classList.remove('active', 'show'));
            const navLink = document.querySelector('.departments .nav-link[href="'+target+'"]');
            if (navLink) navLink.classList.add('active', 'show');
          }, 400);
        }
      });
    });
  }

  // Tüm fonksiyonları başlat
  initPreloader();
  initNavbar();
  initHero();
  initServices();
  initStats();
  initTestimonials();
  initGallery();
  initContact();
  initFAQ();
  initPrograms();
  initScrollAnimations();
  enhancedScrollAnimations();

  // --- İletişim Formu Gönderimi ---
  console.log('Form script yüklendi');
  
  // Form elementini bul
  const contactForm = document.getElementById('contactForm');
  console.log('Form elementi:', contactForm);
  
  if (contactForm) {
    console.log('Form bulundu, event listener ekleniyor');
    
    contactForm.addEventListener('submit', function(e) {
      console.log('Form submit edildi!');
      e.preventDefault();
      
      // Form verilerini al
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject').value;
      const message = document.querySelector('textarea[name="message"]').value;
      
      console.log('Form verileri:', { name, email, subject, message });
      
      // Loading göster
      const loading = document.getElementById('loading');
      const sentMessage = document.getElementById('sent-message');
      const submitButton = this.querySelector('button[type="submit"]');
      
      if (loading) loading.style.display = 'block';
      if (sentMessage) sentMessage.style.display = 'none';
      if (submitButton) submitButton.disabled = true;
      
      // Demo mesajı göster
      setTimeout(() => {
        if (loading) loading.style.display = 'none';
        if (sentMessage) sentMessage.style.display = 'block';
        if (submitButton) submitButton.disabled = false;
        
        // Formu temizle
        this.reset();
        
        console.log('Form başarıyla gönderildi!');
        
        // 3 saniye sonra mesajı gizle
        setTimeout(() => {
          if (sentMessage) sentMessage.style.display = 'none';
        }, 3000);
        
      }, 1500);
    });
  } else {
    console.log('Form elementi bulunamadı!');
  }

  // Event delegation ile programlar menüsüne tıklama garantisi
  document.addEventListener('click', function(e) {
    const link = e.target.closest('.dropdown ul a[href^="#weight"], .dropdown ul a[href="#sports"], .dropdown ul a[href="#pregnancy"], .dropdown ul a[href="#diabetes"]');
    if (link) {
      e.preventDefault();
      const target = link.getAttribute('href');
      const programsSection = document.getElementById('programs');
      if (programsSection) {
        programsSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          document.querySelectorAll('.departments .tab-pane').forEach(tab => tab.classList.remove('active', 'show'));
          const tabContent = document.querySelector(target);
          if (tabContent) tabContent.classList.add('active', 'show');
          document.querySelectorAll('.departments .nav-link').forEach(nav => nav.classList.remove('active', 'show'));
          const navLink = document.querySelector('.departments .nav-link[href="'+target+'"]');
          if (navLink) navLink.classList.add('active', 'show');
        }, 400);
      }
    }
  });

  // Programlar menüsü (dropdown) açılır-kapanır işlevi
  const programDropdown = document.querySelector('.navmenu .dropdown');
  const programToggle = document.querySelector('.navmenu .dropdown > a');
  const programMenu = document.querySelector('.navmenu .dropdown ul');

  if (programDropdown && programToggle && programMenu) {
    programToggle.addEventListener('click', function(e) {
      e.preventDefault();
      programDropdown.classList.toggle('show-dropdown');
    });
    // Başka yere tıklanınca menüyü kapat
    document.addEventListener('click', function(e) {
      if (!programDropdown.contains(e.target)) {
        programDropdown.classList.remove('show-dropdown');
      }
    });
  }

  // Menüde tıklanan linke active ekle, diğerlerinden kaldır
  const navLinks = document.querySelectorAll('.navmenu a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // --- Mobilde Programlar Dropdown Açılır Menü (Sadece ok ikonuna tıklanınca) ---
  document.querySelectorAll('.toggle-dropdown').forEach(function(icon) {
    icon.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const parentLi = this.closest('.dropdown');
      document.querySelectorAll('.navmenu .dropdown.show-dropdown').forEach(function(openLi) {
        if (openLi !== parentLi) openLi.classList.remove('show-dropdown');
      });
      parentLi.classList.toggle('show-dropdown');
    });
  });
  document.addEventListener('click', function(e) {
    document.querySelectorAll('.navmenu .dropdown.show-dropdown').forEach(function(openLi) {
      if (!openLi.contains(e.target)) openLi.classList.remove('show-dropdown');
    });
  });

  // --- Randevu Formu WhatsApp Yönlendirme ---
  const appointmentBtn = document.getElementById('whatsapp-appointment-btn');
  if (appointmentBtn) {
    appointmentBtn.addEventListener('click', function() {
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const date = document.getElementById('date').value;
      const service = document.getElementById('service').options[document.getElementById('service').selectedIndex].text;
      const consultation = document.getElementById('consultation').options[document.getElementById('consultation').selectedIndex].text;
      const message = document.querySelector('textarea[name="message"]').value;
      
      let wpMessage = `*Randevu Talebi*%0A`;
      wpMessage += `Ad Soyad: ${name}%0A`;
      wpMessage += `E-posta: ${email}%0A`;
      wpMessage += `Telefon: ${phone}%0A`;
      wpMessage += `Tarih: ${date}%0A`;
      wpMessage += `Hizmet: ${service}%0A`;
      wpMessage += `Görüşme Türü: ${consultation}%0A`;
      if (message) wpMessage += `Ek Bilgi: ${message}%0A`;
      
      const wpNumber = '905343494734'; // Kendi WhatsApp numaranı buraya yaz
      const wpUrl = `https://wa.me/${wpNumber}?text=${wpMessage}`;
      window.open(wpUrl, '_blank');
    });
  }

})();

/**
 * Navbar functionality
 */
function initNavbar() {
  const selectHeader = document.querySelector('#header');
  const selectTopbar = document.querySelector('#topbar');
  const mobileNavShow = document.querySelector('.mobile-nav-show');
  const mobileNavHide = document.querySelector('.mobile-nav-hide');
  const mobileNavItems = document.querySelectorAll('.navmenu a');
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');

  document.addEventListener('click', mobileNavToogle);

  mobileNavItems.forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 1199) {
        mobileNavToogle();
      }
    });
  });

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavShow.classList.toggle('d-none');
    mobileNavHide.classList.toggle('d-none');
  }

  // Handle dropdown toggles
  const dropdownToggles = document.querySelectorAll('.toggle-dropdown');
  
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const dropdown = this.closest('.dropdown');
      const dropdownMenu = dropdown.querySelector('ul');
      
      // Close other dropdowns
      document.querySelectorAll('.dropdown ul').forEach(menu => {
        if (menu !== dropdownMenu) {
          menu.style.display = 'none';
        }
      });
      
      // Toggle current dropdown
      if (dropdownMenu.style.display === 'block') {
        dropdownMenu.style.display = 'none';
      } else {
        dropdownMenu.style.display = 'block';
      }
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown ul').forEach(menu => {
        menu.style.display = 'none';
      });
    }
  });

  // Handle scroll effects
  let headerOffset = selectHeader.offsetTop;
  let nextElement = selectHeader.nextElementSibling;

  const headerFixed = () => {
    if ((headerOffset - window.scrollY) <= 0) {
      selectHeader.classList.add('scrolled');
      if (nextElement) nextElement.classList.add('scrolled-offset');
    } else {
      selectHeader.classList.remove('scrolled');
      if (nextElement) nextElement.classList.remove('scrolled-offset');
    }
  }

  window.addEventListener('load', headerFixed);
  document.addEventListener('scroll', headerFixed);
}