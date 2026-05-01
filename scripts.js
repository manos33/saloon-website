document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navigation
    const header = document.getElementById('navbar');
    const hero = document.querySelector('.hero');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        header.classList.toggle('menu-open');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            header.classList.remove('menu-open');
            document.body.style.overflow = '';
        });
    });

    // Scroll effect for header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Parallax Hero Effect
    const heroBg = document.querySelector('.hero-bg');
    window.addEventListener('scroll', () => {
        const scroll = window.scrollY;
        if (scroll < window.innerHeight) {
            heroBg.style.transform = `translateY(${scroll * 0.4}px)`;
        }
    });

    // 3. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // After the one-time underline intro animation finishes,
                // add .done so the signature switches to hover-only mode.
                const sig = entry.target.querySelector('.signature');
                if (sig) {
                    // 0.5s delay + 1.6s animation = 2.1s total
                    setTimeout(() => sig.classList.add('done'), 2200);
                }

                revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 4. Set Minimum Date on Form
    const dateInput = document.getElementById('date');
    if(dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // 5. Advanced Form Submission Handler
    const form = document.getElementById('reservationForm');
    const submitBtn = document.querySelector('.submit-btn');
    
    if(form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'SENDING REQUEST...';
            
            const formData = new FormData(this);
            
            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.success) {
                    submitBtn.textContent = 'RESERVATION RECEIVED ✓';
                    submitBtn.style.backgroundColor = 'var(--accent)';
                    form.reset();
                    
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.style.backgroundColor = '';
                        submitBtn.disabled = false;
                    }, 5000);
                } else {
                    alert('Error: ' + data.message);
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                alert('We are experiencing issues. Please try calling us directly.');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // 6. Testimonial Slider
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        if (index >= slides.length) currentSlide = 0;
        if (index < 0) currentSlide = slides.length - 1;
        
        if (slides[currentSlide]) {
            slides[currentSlide].classList.add('active');
        }
    }

    if (nextBtn && prevBtn && slides.length > 0) {
        nextBtn.addEventListener('click', () => {
            currentSlide++;
            showSlide(currentSlide);
        });

        prevBtn.addEventListener('click', () => {
            currentSlide--;
            showSlide(currentSlide);
        });

        // Auto slide every 6 seconds
        setInterval(() => {
            currentSlide++;
            showSlide(currentSlide);
        }, 6000);
    }

    // 7. FAQs Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question');
        if(btn) {
            btn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                // Close all others
                faqItems.forEach(other => other.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // 8. Menu Carousel Navigation
    const menuCarousel = document.querySelector('.menu-carousel');
    const menuPrev = document.querySelector('.menu-prev');
    const menuNext = document.querySelector('.menu-next');

    if (menuCarousel && menuPrev && menuNext) {
        menuNext.addEventListener('click', () => {
            const cardWidth = menuCarousel.querySelector('.menu-card').offsetWidth + 32; // width + gap
            menuCarousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
        });

        menuPrev.addEventListener('click', () => {
            const cardWidth = menuCarousel.querySelector('.menu-card').offsetWidth + 32; // width + gap
            menuCarousel.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        });
    }

    // 9. Language Switcher
    const i18n = [
        // Navbar (Uppercase - No accents)
        { sel: '[data-i18n="nav-story"]', en: 'The Story', el: 'Η ΙΣΤΟΡΙΑ' },
        { sel: '[data-i18n="nav-experience"]', en: 'Experience', el: 'ΕΜΠΕΙΡΙΑ' },
        { sel: '[data-i18n="nav-gallery"]', en: 'Gallery', el: 'ΓΚΑΛΕΡΙ' },
        { sel: '[data-i18n="nav-reservations"]', en: 'Reservations', el: 'ΚΡΑΤΗΣΕΙΣ' },
        
        // Hero & About
        { sel: '.hero-subtitle', en: 'Mastichari, Kos', el: 'Μαστιχάρι, Κως' },
        { sel: '.hero-description', en: 'An oasis of bohemian luxury, harmoniously blended with the timeless soul of the Aegean. <br>Your sanctuary of stillness, calm, and sunset serenity.', el: 'Μια όαση bohemian πολυτέλειας, αρμονικά συνδεδεμένη με τη διαχρονική ψυχή του Αιγαίου. <br>Το καταφύγιό σας για γαλήνη, ηρεμία και μοναδικά ηλιοβασιλέματα.' },
        { sel: '#about .section-subtitle', en: 'Our Philosophy', el: 'Η ΦΙΛΟΣΟΦΙΑ ΜΑΣ' },
        { sel: '#about .section-title', en: 'Reality pauses here.', el: 'Ο χρόνος σταματά εδώ.' },
        { sel: '.about-text p:nth-of-type(2)', en: 'Situated right on the beautiful coastline of Mastichari, offering breathtaking sunset views. As the most unique and modern beach bar in the area, we set the standard for a vibrant and welcoming beachfront environment.', el: 'Βρίσκεται ακριβώς στην πανέμορφη ακτογραμμή στο Μαστιχάρι, προσφέροντας εκπληκτική θέα στο ηλιοβασίλεμα. Ως το πιο μοναδικό και μοντέρνο beach bar της περιοχής, δημιουργούμε ένα ζωντανό και φιλόξενο παραλιακό περιβάλλον.' },
        { sel: '.about-text p:nth-of-type(3)', en: 'Our ambiance sparks deep conversations and invites the worry-free vibe of a secluded island escape. At Saloon Beach Bar, everyone is treated like a friend. Premium comfort food, signature cocktails, and a soulful all-day cuisine await you.', el: 'Η ατμόσφαιρά μας πυροδοτεί βαθιές συζητήσεις και προσκαλεί την ξέγνοιαστη αίσθηση μιας νησιωτικής απόδρασης. Στο Saloon Beach Bar, όλοι αντιμετωπίζονται σαν φίλοι. Premium comfort food, signature cocktails και μια all-day κουζίνα σας περιμένουν.' },
        { sel: '.hero .btn', en: 'Book Now', el: 'ΚΡΑΤΗΣΗ ΤΩΡΑ' },
        { sel: '.about-text .signature', en: 'See you at Saloon', el: 'Ραντεβού στο Saloon' },
        
        // Experience
        { sel: '#experience .section-subtitle', en: 'Curated Offerings', el: 'ΕΠΙΛΕΓΜΕΝΕΣ ΠΑΡΟΧΕΣ' },
        { sel: '#experience .section-title', en: 'The Experience', el: 'Η Εμπειρία' },
        { sel: '#experience .exp-card:nth-child(1) h3', en: 'Craft Cocktails', el: 'Craft Κοκτέιλ' },
        { sel: '#experience .exp-card:nth-child(1) p', en: 'From classic mojitos to our own signature beachside mixes, we shake up drinks designed for those long, slow summer afternoons. Cold, refreshing, and made with care.', el: 'Από κλασικά mojitos μέχρι τα δικά μας signature καλοκαιρινά μείγματα, ετοιμάζουμε ποτά σχεδιασμένα για εκείνα τα μεγάλα, αργά καλοκαιρινά απογεύματα. Κρύα, δροσιστικά και φτιαγμένα με μεράκι.' },
        { sel: '#experience .exp-card:nth-child(2) h3', en: 'Beachside Bites', el: 'Beachside Bites' },
        { sel: '#experience .exp-card:nth-child(2) p', en: 'Delightful beachside bites, fresh morning pastries, and wholesome bowls prepared with love. Perfect for a light, refreshing pause between swims, or sharing with friends by the waves.', el: 'Ελαφριά σνακ, φρέσκα πρωινά αρτοσκευάσματα και υγιεινά μπολ φτιαγμένα με αγάπη. Ιδανικά για ένα δροσιστικό διάλειμμα ανάμεσα στις βουτιές ή για να τα μοιραστείτε με φίλους.' },
        { sel: '#experience .exp-card:nth-child(3) h3', en: 'All-Day Café', el: 'All-Day Café' },
        { sel: '#experience .exp-card:nth-child(3) p', en: 'Start your morning right with an iced espresso, fresh juices, or a hearty breakfast by the waves. Our coffee machine is on from 8 AM.', el: 'Ξεκινήστε σωστά το πρωινό σας με έναν παγωμένο espresso, φρέσκους χυμούς ή ένα χορταστικό πρωινό δίπλα στο κύμα. Η μηχανή του καφέ μας ανοίγει στις 8 π.μ.' },
        { sel: '#experience .exp-card:nth-child(4) h3', en: 'Beach Luxury', el: 'Πολυτέλεια στην Παραλία' },
        { sel: '#experience .exp-card:nth-child(4) p', en: 'Thick, comfortable sunbeds and big umbrellas right on the sand. Just relax, swim, and let our team bring the chilled drinks straight to you.', el: 'Παχιές, άνετες ξαπλώστρες και μεγάλες ομπρέλες ακριβώς πάνω στην άμμο. Απλά χαλαρώστε, κολυμπήστε και αφήστε την ομάδα μας να φέρει τα παγωμένα ποτά κατευθείαν σε εσάς.' },
        
        // Menu Overview
        { sel: '#menu-highlights .section-subtitle', en: 'A Taste of Saloon', el: 'ΜΙΑ ΓΕΥΣΗ ΑΠΟ ΤΟ SALOON' },
        { sel: '#menu-highlights .section-title', en: 'Signature Flavors', el: 'Επιλεγμένα Πιάτα' },
        { sel: '.menu-swipe-indicator span', en: 'Swipe to explore <span>→</span>', el: 'Σύρετε για εξερεύνηση <span>→</span>' },

        // Menu Cards Translations
        // Dish 1
        { sel: '.menu-card:nth-child(1) h4', en: 'Mediterranean Pizza', el: 'Μεσογειακή Πίτσα' },
        { sel: '.menu-card:nth-child(1) p', en: 'Authentic thin crust, San Marzano tomato sauce, fresh mozzarella, and local herbs.', el: 'Αυθεντική λεπτή ζύμη, σάλτσα ντομάτας San Marzano, φρέσκια μοτσαρέλα και τοπικά βότανα.' },
        // Dish 2
        { sel: '.menu-card:nth-child(2) h4', en: 'Saloon Signature Burger', el: 'Saloon Signature Burger' },
        { sel: '.menu-card:nth-child(2) p', en: 'Premium beef patty, caramelized onions, cheddar, and our secret house sauce.', el: 'Premium μπιφτέκι, καραμελωμένα κρεμμύδια, τσένταρ και η μυστική μας σως.' },
        // Dish 3
        { sel: '.menu-card:nth-child(3) h4', en: 'Aegean Quinoa Salad', el: 'Σαλάτα Κινόα Αιγαίου' },
        { sel: '.menu-card:nth-child(3) p', en: 'Organic quinoa, cherry tomatoes, cucumber, feta cheese, and a citrus vinaigrette.', el: 'Βιολογική κινόα, ντοματίνια, αγγούρι, τυρί φέτα και βινεγκρέτ εσπεριδοειδών.' },
        // Cocktail 1
        { sel: '.menu-card:nth-child(4) h4', en: 'Aegean Spritz', el: 'Aegean Spritz' },
        { sel: '.menu-card:nth-child(4) p', en: 'A refreshing blend of local liqueur, prosecco, and soda. The perfect summer cooler.', el: 'Ένα δροσιστικό μείγμα από τοπικό λικέρ, prosecco και σόδα. Το τέλειο καλοκαιρινό ποτό.' },
        // Cocktail 2
        { sel: '.menu-card:nth-child(5) h4', en: 'Spicy Mango Margarita', el: 'Spicy Mango Margarita' },
        { sel: '.menu-card:nth-child(5) p', en: 'Tequila infused with jalapeño, fresh mango puree, and a tajin rim.', el: 'Τεκίλα αρωματισμένη με jalapeño, πουρέ από φρέσκο μάνγκο και χείλος από tajin.' },
        // Dish 4
        { sel: '.menu-card:nth-child(6) h4', en: 'Fresh Sea Bream', el: 'Φρέσκια Τσιπούρα' },
        { sel: '.menu-card:nth-child(6) p', en: 'Grilled locally-caught fish served with seasonal greens and lemon-olive oil sauce.', el: 'Φρέσκο ψάρι σχάρας σερβιρισμένο με σαλάτα εποχής και λαδολέμονο.' },
        
        // Testimonials & Gallery
        { sel: '#testimonials .section-subtitle', en: 'Guest Diaries', el: 'ΗΜΕΡΟΛΟΓΙΑ ΕΠΙΣΚΕΠΤΩΝ' },
        { sel: '#testimonials .section-title', en: 'Words From Our Friends', el: 'Λόγια Από Τους Φίλους Μας' },
        { sel: '.testimonial-slide:nth-child(1) .quote', en: '"So beautiful, cosy and relaxing place right by the beach. The food was incredible and everything tasted fresh. We would definitely come back again!"', el: '"Τόσο όμορφο, φιλόξενο και χαλαρωτικό μέρος ακριβώς δίπλα στην παραλία. Το φαγητό ήταν απίστευτο και τα πάντα είχαν φρέσκια γεύση. Σίγουρα θα ξανάρθουμε!"' },
        { sel: '.testimonial-slide:nth-child(2) .quote', en: '"Unbeatable vibe by the beach. The BBQ chicken pinsa was absolutely delicious and the cocktails were top quality. Staff super friendly and attentive."', el: '"Ασυναγώνιστη ατμόσφαιρα δίπλα στην παραλία. Η pinsa με κοτόπουλο BBQ ήταν πεντανόστιμη και τα κοκτέιλ κορυφαίας ποιότητας. Το προσωπικό εξαιρετικά φιλικό και εξυπηρετικό."' },
        { sel: '.testimonial-slide:nth-child(3) .quote', en: '"Amazing food at great prices. Service from staff was fantastic and extremely friendly... went above and beyond to make sure everything was perfect."', el: '"Καταπληκτικό φαγητό σε εξαιρετικές τιμές. Η εξυπηρέτηση από το προσωπικό ήταν φανταστική και εξαιρετικά φιλική... έκαναν τα πάντα για να βεβαιωθούν ότι όλα ήταν τέλεια."' },
        { sel: '.testimonial-slide:nth-child(4) .quote', en: '"Perfect spot for relaxing by the sea with great music and amazing cocktails. Staff always smiling and welcoming. One of the best places in the area."', el: '"Τέλειο σημείο για χαλάρωση δίπλα στη θάλασσα με υπέροχη μουσική και εκπληκτικά κοκτέιλ. Το προσωπικό είναι πάντα χαμογελαστό και φιλόξενο. Ένα από τα καλύτερα μέρη της περιοχής."' },

        { sel: '#gallery .section-subtitle', en: 'Aesthetic', el: 'ΑΙΣΘΗΤΙΚΗ' },
        { sel: '#gallery .section-title', en: 'Moments at Saloon', el: 'Στιγμές στο Saloon' },
        { sel: '.ig-marquee .section-subtitle', en: 'Live From Mastichari', el: 'ΖΩΝΤΑΝΑ ΑΠΟ ΤΟ ΜΑΣΤΙΧΑΡΙ' },
        
        // Reservations Form
        { sel: '#reservations .section-subtitle', en: 'Join Us', el: 'ΕΛΑΤΕ ΚΟΝΤΑ ΜΑΣ' },
        { sel: '#reservations .section-title', en: 'Secure Your Sanctuary', el: 'Κάντε Κράτηση' },
        { sel: '.form-container > p', en: 'Reserve your sunbeds or a dining table in advance to guarantee the best spot by the Aegean.', el: 'Κλείστε νωρίτερα τις ξαπλώστρες ή το τραπέζι σας για να εξασφαλίσετε την καλύτερη θέση δίπλα στο Αιγαίο.' },
        { sel: 'label[for="firstName"]', en: 'First Name', el: 'Όνομα' },
        { sel: 'label[for="lastName"]', en: 'Last Name', el: 'Επίθετο' },
        { sel: 'label[for="email"]', en: 'Email Address', el: 'Διεύθυνση Email' },
        { sel: 'label[for="phone"]', en: 'Phone/WhatsApp', el: 'Τηλέφωνο/WhatsApp' },
        { sel: 'label[for="date"]', en: 'Date', el: 'Ημερομηνία' },
        { sel: 'label[for="time"]', en: 'Preferred Time', el: 'Επιθυμητή Ώρα' },
        { sel: 'label[for="guests"]', en: 'Number of Guests', el: 'Αριθμός Ατόμων' },
        { sel: 'label[for="message"]', en: 'Special requests or occasion', el: 'Ειδικές απαιτήσεις ή γιορτή' },
        { sel: 'label[for="consent"]', en: 'I consent for the processing of my personal data provided above by Saloon Beach Bar', el: 'Συναινώ στην επεξεργασία των προσωπικών μου δεδομένων από το Saloon Beach Bar' },
        { sel: '#reservations button[type="submit"]', en: 'CONFIRM RESERVATION', el: 'ΟΛΟΚΛΗΡΩΣΗ ΚΡΑΤΗΣΗΣ' },
        
        // FAQ
        { sel: '#faq .section-subtitle', en: 'Good To Know', el: 'ΧΡΗΣΙΜΕΣ ΠΛΗΡΟΦΟΡΙΕΣ' },
        { sel: '#faq .section-title', en: 'Frequently Asked Questions', el: 'Συχνές Ερωτήσεις' },
        { sel: '.faq-item:nth-child(1) .faq-question', en: 'Do I need to book? <span class="faq-icon">+</span>', el: 'Πρέπει να κάνω κράτηση; <span class="faq-icon">+</span>' },
        { sel: '.faq-item:nth-child(1) .faq-answer p', en: 'It\'s entirely up to you! Reservations are always welcome if you prefer to secure your favorite spot, but walk-ins are embraced with open arms. Join us whenever the sea calls.', el: 'Εξαρτάται αποκλειστικά από εσάς! Οι κρατήσεις είναι πάντα ευπρόσδεκτες αν προτιμάτε να εξασφαλίσετε το αγαπημένο σας σημείο, αλλά και οι επισκέπτες χωρίς κράτηση είναι ευπρόσδεκτοι. Ελάτε όποτε σας καλεί η θάλασσα.' },
        { sel: '.faq-item:nth-child(2) .faq-question', en: 'Is parking available nearby? <span class="faq-icon">+</span>', el: 'Υπάρχει πάρκινγκ κοντά; <span class="faq-icon">+</span>' },
        { sel: '.faq-item:nth-child(2) .faq-answer p', en: 'Yes! There is free public parking available just a few minutes\' walk from the beach bar.', el: 'Ναι! Υπάρχει δωρεάν δημόσιος χώρος στάθμευσης διαθέσιμος μόλις λίγα λεπτά με τα πόδια από το beach bar.' },
        { sel: '.faq-item:nth-child(3) .faq-question', en: 'Are you pet-friendly? <span class="faq-icon">+</span>', el: 'Δέχεστε κατοικίδια; <span class="faq-icon">+</span>' },
        { sel: '.faq-item:nth-child(3) .faq-answer p', en: 'We absolutely love pets! Well-behaved dogs are more than welcome to join you at the bar or at your sunbed.', el: 'Λατρεύουμε τα κατοικίδια! Τα καλά εκπαιδευμένα σκυλιά είναι παραπάνω από ευπρόσδεκτα να σας συνοδεύσουν στο μπαρ ή στην ξαπλώστρα σας.' },
        { sel: '.faq-item:nth-child(4) .faq-question', en: 'Do you host private events or celebrations? <span class="faq-icon">+</span>', el: 'Διοργανώνετε ιδιωτικές εκδηλώσεις; <span class="faq-icon">+</span>' },
        { sel: '.faq-item:nth-child(4) .faq-answer p', en: 'Yes, we can host birthday parties, romantic sunset dinners, and other celebrations. Please contact us via email or phone to discuss your specific needs.', el: 'Ναι, μπορούμε να φιλοξενήσουμε πάρτι γενεθλίων, ρομαντικά δείπνα στο ηλιοβασίλεμα και άλλες γιορτές. Επικοινωνήστε μαζί μας μέσω email ή τηλεφώνου.' },
        
        // Footer
        { sel: '.footer-col:nth-child(2) h4', en: 'Contact', el: 'Επικοινωνία' },
        { sel: '.footer-col:nth-child(2) p:nth-of-type(1)', en: 'Daily: 08:00 AM - 02:00 AM', el: 'Καθημερινά: 08:00 ΠΜ - 02:00 ΠΜ' },
        { sel: '.footer-col:nth-child(2) p:nth-of-type(2)', en: 'Season: April - October', el: 'Σεζόν: Απρίλιος - Οκτώβριος' },
        { sel: '.footer-col:nth-child(1) a', en: 'View Map', el: 'Προβολή Χάρτη' },
        { sel: '.footer-col:nth-child(3) h4', en: 'Connect', el: 'Συνδεθείτε' }
    ];

    const langEn = document.getElementById('lang-en');
    const langEl = document.getElementById('lang-el');

    function applyLang(lang) {
        if (!langEn || !langEl) return;
        
        document.documentElement.lang = lang; // Helps browser with uppercase logic

        i18n.forEach(item => {
            const el = document.querySelector(item.sel);
            if (el) el.innerHTML = item[lang];
        });

        if (lang === 'el') {
            langEn.classList.remove('active');
            langEl.classList.add('active');
        } else {
            langEl.classList.remove('active');
            langEn.classList.add('active');
        }
        localStorage.setItem('saloon_lang', lang);
    }

    if (langEn && langEl) {
        langEn.addEventListener('click', () => applyLang('en'));
        langEl.addEventListener('click', () => applyLang('el'));
        
        // Load saved language or default to EN
        const savedLang = localStorage.getItem('saloon_lang') || 'en';
        applyLang(savedLang);
    }

    // 10. Magnetic Button Effect (Premium Interaction)
    const magneticBtns = document.querySelectorAll('.btn');
    
    if (window.innerWidth > 1024) { // Only for desktop
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Pull effect (moves 15px max)
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    // 11. Dark Mode Toggle (Midnight Mode)
    const modeToggle = document.getElementById('mode-toggle');
    if (modeToggle) {
        const moonIcon = modeToggle.querySelector('.moon-icon');
        const sunIcon = modeToggle.querySelector('.sun-icon');
        
        function updateIcons(isDark) {
            if (isDark) {
                if (moonIcon) moonIcon.style.display = 'none';
                if (sunIcon) sunIcon.style.display = 'block';
            } else {
                if (moonIcon) moonIcon.style.display = 'block';
                if (sunIcon) sunIcon.style.display = 'none';
            }
        }

        // Load saved theme
        if (localStorage.getItem('saloon_theme') === 'dark') {
            document.body.classList.add('dark-mode');
            updateIcons(true);
        }

        modeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            
            updateIcons(isDark);
            localStorage.setItem('saloon_theme', isDark ? 'dark' : 'light');
        });
    }

    // 12. Splash Screen Logic
    const splash = document.getElementById('splash-screen');
    if (splash) {
        if (sessionStorage.getItem('saloon_splash_seen')) {
            splash.style.display = 'none';
        } else {
            // Wait for 3.5 seconds before fading out
            setTimeout(() => {
                splash.style.opacity = '0';
                setTimeout(() => {
                    splash.style.display = 'none';
                    sessionStorage.setItem('saloon_splash_seen', 'true');
                }, 600);
            }, 3500);
        }
    }

    // 13. Custom Luxury Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    const hoverTargets = document.querySelectorAll('a, button, .gallery-item, .exp-card, input, select, textarea');

    if (cursorDot && cursorRing && window.innerWidth > 1024) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;
        
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Dot moves instantly
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        // Ring follows with easing
        function animateCursor() {
            let distX = mouseX - ringX;
            let distY = mouseY - ringY;
            
            ringX = ringX + (distX * 0.15);
            ringY = ringY + (distY * 0.15);
            
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
            
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                document.body.classList.add('hovering');
            });
            target.addEventListener('mouseleave', () => {
                document.body.classList.remove('hovering');
            });
        });
    }

    // 14. Mouse-Reactive Palm Leaves (3D Parallax)
    const palmLeaves = document.querySelectorAll('.palm-leaf');
    if (palmLeaves.length > 0 && window.innerWidth > 1024) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 40; // max 20px movement
            const y = (e.clientY / window.innerHeight - 0.5) * 40;
            
            palmLeaves.forEach(leaf => {
                const baseRot = leaf.style.getPropertyValue('--base-rot') || '0deg';
                leaf.style.transform = `translate(${x}px, ${y}px) rotate(${baseRot})`;
            });
        });
    }

    // 15. Magnetic Gallery Effect
    const magneticGallery = document.querySelectorAll('.gallery-item');
    if (window.innerWidth > 1024) { 
        magneticGallery.forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Very subtle pull effect
                item.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.02)`;
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translate(0, 0) scale(1)';
            });
        });
    }

});
