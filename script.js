document.addEventListener('DOMContentLoaded', function() {
    // Page Loader
    const pageLoader = document.querySelector('.page-loader');
    
    setTimeout(() => {
        pageLoader.classList.add('fade-out');
        setTimeout(() => {
            pageLoader.style.display = 'none';
        }, 500);
    }, 1000);
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    mobileMenuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
        mobileMenuBtn.innerHTML = nav.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
    
    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isOpen = question.classList.contains('active');
            
            // Close all other items
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.classList.remove('show');
            });
            
            // Toggle current item if it wasn't open
            if (!isOpen) {
                question.classList.add('active');
                answer.classList.add('show');
            }
        });
    });
    
    // Handle form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                course: document.getElementById('course').value,
                goal: document.getElementById('goal').value
            };
            
            // Send data to Telegram bot
            sendToTelegram(formData);
        });
    }
    
    // Function to send data to Telegram
    function sendToTelegram(data) {
        const botToken = '6366108438:AAES7MRRZwJCMiHSat7TZA4u1OOb_R1aVH8';
        const chatId = '5572925321';
        const text = `📩 طلب جديد:\nالاسم: ${data.name}\nالكورس المختار: ${data.course}\nالهدف: ${data.goal}`;
        
        const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(text)}`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                // Show success message
                contactForm.style.display = 'none';
                document.getElementById('formSuccess').style.display = 'block';
                
                // Reset form
                contactForm.reset();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
            });
    }
    
    // Handle page routing
    const mainContent = document.getElementById('main-content');
    const pagesContent = document.getElementById('pages-content');
    const allPages = pagesContent.children;
    
    function loadPage(pageId) {
        // Hide all pages
        Array.from(allPages).forEach(page => {
            page.style.display = 'none';
        });
        
        // Show the requested page
        const requestedPage = document.getElementById(pageId);
        if (requestedPage) {
            requestedPage.style.display = 'block';
            mainContent.innerHTML = '';
            mainContent.appendChild(requestedPage.cloneNode(true));
            
            // Scroll to top
            window.scrollTo(0, 0);
        } else {
            // Default to home page if page not found
            loadPage('home-page');
        }
    }
    
    // Initial page load based on URL hash
    function handleHashChange() {
        const hash = window.location.hash.substring(1);
        const pageMap = {
            '': 'home-page',
            'courses': 'courses-page',
            'summary': 'summary-page',
            'contact': 'contact-page',
            'about': 'about-page',
            'faq': 'faq-page',
            'privacy': 'privacy-page',
            'terms': 'terms-page',
            'testimonials': 'testimonials-page'
        };
        
        const pageId = pageMap[hash] || 'home-page';
        loadPage(pageId);
    }
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Initial load
    handleHashChange();
    
    // Handle internal navigation
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const hash = e.target.getAttribute('href');
            window.location.hash = hash;
        }
    });
});
