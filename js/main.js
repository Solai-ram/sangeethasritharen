// ============================================
// LOADER FUNCTIONALITY & MUSIC CONTROL
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const loader = document.getElementById('loader');
    const playButton = document.getElementById('playButton');
    const vinylRecord = document.getElementById('vinylRecord');
    const loadingBar = document.getElementById('loadingBar');
    const soundWaves = document.getElementById('soundWaves');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const mainContent = document.querySelector('.main-content');
    const musicControl = document.getElementById('musicControl');
    
    let musicPlaying = false;
    let userInteracted = false;

    // Preload audio immediately
    backgroundMusic.load();
    backgroundMusic.volume = 0.7; // Set volume to 70%

    console.log('Audio element:', backgroundMusic);
    console.log('Audio source:', backgroundMusic.src);

    const svgVolumeUp = '<svg class="svg-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
    const svgVolumeMute = '<svg class="svg-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';

    // Function to attempt playing music
    function attemptPlayMusic() {
        console.log('Attempting to play music...');
        
        // Set the current time to start
        backgroundMusic.currentTime = 0;
        
        // Attempt to play
        const playPromise = backgroundMusic.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    // Music started successfully
                    console.log('✅ Music playing successfully!');
                    musicPlaying = true;
                    
                    if (musicControl) {
                        musicControl.innerHTML = svgVolumeUp;
                        musicControl.style.display = 'flex';
                        musicControl.title = 'Pause Music';
                    }
                })
                .catch(error => {
                    // Auto-play was prevented
                    console.error('❌ Music playback failed:', error.message);
                    musicPlaying = false;
                    
                    // Show music control button for manual play
                    if (musicControl) {
                        musicControl.innerHTML = svgVolumeMute;
                        musicControl.style.display = 'flex';
                        musicControl.title = 'Play Music';
                    }
                    
                    // Show alert if this is the first attempt
                    if (userInteracted) {
                        alert('Please click the music button (bottom-right corner) to play the wedding music! 🎵');
                    }
                });
        }
    }

    // Function to toggle music on/off
    function toggleMusic(event) {
        console.log('Toggle music clicked. Current state:', musicPlaying);
        
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        if (musicPlaying) {
            // Pause the music
            backgroundMusic.pause();
            musicPlaying = false;
            musicControl.innerHTML = svgVolumeMute;
            musicControl.title = 'Play Music';
            console.log('🔇 Music paused');
        } else {
            // Play the music
            attemptPlayMusic();
        }
    }

    // Music control button click handler
    if (musicControl) {
        musicControl.addEventListener('click', toggleMusic);
    }

    // Main play button click handler
    playButton.addEventListener('click', function(e) {
        console.log('Play button clicked!');
        userInteracted = true;
        
        // Hide play button
        playButton.style.display = 'none';

        // Show loading bar and activate sound waves
        loadingBar.style.display = 'block';
        soundWaves.classList.add('active');

        // Spin vinyl
        vinylRecord.classList.add('spinning');

        // IMMEDIATELY try to play music on user click
        attemptPlayMusic();

        // Wait 2 seconds for animation, then fade out
        setTimeout(() => {
            loader.classList.add('fade-out');

            // Show main content after fade transition
            setTimeout(() => {
                loader.style.display = 'none';
                mainContent.classList.add('show');

                // Initialize AOS animations
                AOS.init({
                    duration: 1000,
                    once: true,
                    offset: 100
                });

                // Try playing again after content loads (backup attempt)
                if (!musicPlaying) {
                    console.log('Backup play attempt...');
                    setTimeout(() => attemptPlayMusic(), 500);
                }
            }, 500);
        }, 2000);
    });

    // Handle visibility change (pause/resume music when tab changes)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            if (musicPlaying) {
                backgroundMusic.pause();
                console.log('Tab hidden - music paused');
            }
        } else {
            if (musicPlaying) {
                backgroundMusic.play()
                    .then(() => console.log('Tab visible - music resumed'))
                    .catch(e => console.log('Resume failed:', e));
            }
        }
    });

    // Listen for audio events for debugging
    backgroundMusic.addEventListener('loadeddata', function() {
        console.log('✅ Audio loaded successfully');
    });

    backgroundMusic.addEventListener('error', function(e) {
        console.error('❌ Audio loading error:', e);
        console.error('Error details:', backgroundMusic.error);
    });

    backgroundMusic.addEventListener('play', function() {
        console.log('🎵 Audio play event fired');
        musicPlaying = true;
    });

    backgroundMusic.addEventListener('pause', function() {
        console.log('⏸️ Audio pause event fired');
        musicPlaying = false;
    });

    // Add click anywhere to try playing music (for mobile browsers)
    let firstClickHandled = false;
    document.addEventListener('click', function enableAudioOnFirstClick() {
        if (!firstClickHandled && !musicPlaying && userInteracted) {
            firstClickHandled = true;
            console.log('Document click - attempting music play');
            attemptPlayMusic();
        }
    }, { once: false });
});

// ============================================
// NAVIGATION FUNCTIONALITY
// ============================================
const nav = document.getElementById('navigation');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const navProgressFill = document.getElementById('navProgressFill');

// Scroll detection for navigation + progress bar
window.addEventListener('scroll', function() {
    const scrollY = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    if (scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    // Update progress bar
    if (navProgressFill) {
        navProgressFill.style.width = Math.min(scrollPercent, 100) + '%';
    }
}, { passive: true });

// Active section highlighting using IntersectionObserver
const sections = document.querySelectorAll('section[id]');
const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => {
    sectionObserver.observe(section);
});

// Mobile menu toggle
if (navToggle) {
    navToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    if (navMenu && navMenu.classList.contains('active')) {
        if (!navMenu.contains(e.target) && (!navToggle || !navToggle.contains(e.target))) {
            navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
        }
    }
});

// Close mobile menu on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (navToggle) navToggle.classList.remove('active');
    }
});

// Smooth scroll on nav click
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        // Close mobile menu
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');

        // Smooth scroll to section
        targetSection.scrollIntoView({ behavior: 'smooth' });
    });
});

// ============================================
// COUNTDOWN TIMER FUNCTIONALITY
// ============================================
function updateCountdown() {
    const weddingDate = new Date('2025-12-13T23:11:00').getTime();
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (distance < 0) {
        clearInterval(countdownInterval);
        const countdownElement = document.querySelector('.countdown');
        if (countdownElement) {
            countdownElement.innerHTML = `
                <div class="wedding-day-message">
                    <div class="music-emoji">🎵</div>
                    <h2 class="day-arrived-title">The Music Plays Today!</h2>
                    <div class="ornament-small"></div>
                    <p class="day-arrived-subtitle">Our Love Symphony Begins</p>
                    <p class="day-arrived-gratitude">Thank you for being part of our special day 💜</p>
                    <div class="music-bars-celebration">
                        <span></span><span></span><span></span><span></span><span></span>
                        <span></span><span></span><span></span><span></span><span></span>
                    </div>
                </div>
            `;
        }
    } else {
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        if (daysElement) daysElement.innerText = days;
        if (hoursElement) hoursElement.innerText = hours;
        if (minutesElement) minutesElement.innerText = minutes;
        if (secondsElement) secondsElement.innerText = seconds;
    }
}

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();

// ============================================
// THREE.JS BACKGROUND INITIALIZATION
// ============================================
window.addEventListener('load', function() {
    const container = document.getElementById('three-background');
    let scene, camera, renderer;
    let bigHeart1, bigHeart2;
    let mouseX = 0, mouseY = 0;

    // Scene setup
    scene = new THREE.Scene();

    // Camera setup
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100vw';
    renderer.domElement.style.height = '100vh';
    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.style.zIndex = '0';
    renderer.domElement.style.opacity = '0.35';
    container.appendChild(renderer.domElement);

    // Create heart shape
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, -0.3, -0.6, -0.3, -0.6, 0);
    heartShape.bezierCurveTo(-0.6, 0.3, 0, 0.6, 0, 1);
    heartShape.bezierCurveTo(0, 0.6, 0.6, 0.3, 0.6, 0);
    heartShape.bezierCurveTo(0.6, -0.3, 0, -0.3, 0, 0);

    const extrudeSettings = {
        depth: 0.8,
        bevelEnabled: true,
        bevelSegments: 8,
        steps: 5,
        bevelSize: 0.15,
        bevelThickness: 0.15
    };

    const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    heartGeometry.computeVertexNormals();

    // Create gradient texture
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 256, 256);
    gradient.addColorStop(0, '#9b7ec7');
    gradient.addColorStop(0.5, '#b89fdb');
    gradient.addColorStop(1, '#5c2a7a');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
    const gradientTexture = new THREE.CanvasTexture(canvas);

    const heartMaterial = new THREE.MeshStandardMaterial({
        map: gradientTexture,
        color: 0xffffff,
        transparent: true,
        opacity: 0.85,
        emissive: 0x9b7ec7,
        emissiveIntensity: 0.4,
        metalness: 0.8,
        roughness: 0.1,
        envMapIntensity: 2.0
    });

    // Create two subtle ambient hearts in the background wings
    bigHeart1 = new THREE.Mesh(heartGeometry, heartMaterial.clone());
    bigHeart1.scale.set(1.05, 1.05, 0.35);
    bigHeart1.position.set(-3.6, 0, -1);
    bigHeart1.rotation.x = Math.PI;
    scene.add(bigHeart1);

    bigHeart2 = new THREE.Mesh(heartGeometry, heartMaterial.clone());
    bigHeart2.scale.set(1.05, 1.05, 0.35);
    bigHeart2.position.set(3.6, 0, -1);
    bigHeart2.rotation.x = Math.PI;
    scene.add(bigHeart2);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xb89fdb, 2.5);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x9b7ec7, 2.0);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xede6f7, 1.8);
    pointLight3.position.set(0, 8, -5);
    scene.add(pointLight3);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    // Mouse movement
    document.addEventListener('mousemove', function(event) {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Scroll position for parallax
    let scrollY = 0;
    window.addEventListener('scroll', function() {
        scrollY = window.scrollY || window.pageYOffset;
    }, { passive: true });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        const t = Date.now() * 0.001;

        bigHeart1.rotation.y += 0.008;
        bigHeart1.position.y = Math.sin(t) * 0.5 + scrollY * 0.0003;
        bigHeart1.position.x = -3.6 + Math.cos(t * 0.7) * 0.3;

        bigHeart2.rotation.y -= 0.008;
        bigHeart2.position.y = Math.cos(t * 0.8) * 0.5 - scrollY * 0.0003;
        bigHeart2.position.x = 3.6 + Math.sin(t * 0.6) * 0.3;

        // Parallax camera movement based on scroll
        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
        // Add subtle vertical parallax from scroll
        camera.position.y += (scrollY * 0.0008 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});

// ============================================
// RSVP FORM FUNCTIONALITY
// ============================================
function updateGuestCount(change) {
    const input = document.getElementById('guestCount');
    let currentValue = parseInt(input.value) || 1;
    let newValue = currentValue + change;
    
    // Ensure value stays within bounds
    if (newValue < 1) newValue = 1;
    if (newValue > 10) newValue = 10;
    
    input.value = newValue;
}

// RSVP Form Submission
document.addEventListener('DOMContentLoaded', function() {
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpSuccess = document.getElementById('rsvpSuccess');
    
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('guestName').value,
                phone: document.getElementById('phoneNumber').value,
                guestCount: document.getElementById('guestCount').value,
                events: [],
                message: document.getElementById('message').value
            };
            
            // Get selected events
            const eventCheckboxes = document.querySelectorAll('input[name="events"]:checked');
            eventCheckboxes.forEach(checkbox => {
                formData.events.push(checkbox.value);
            });
            
            // Validate at least one event is selected
            if (formData.events.length === 0) {
                alert('Please select at least one event you will attend.');
                return;
            }
            
            // Log RSVP data
            console.log('RSVP Submitted:', formData);
            
            // Create email subject and body
            const emailTo = 'sangeethapandian6@gmail.com';
            const emailSubject = `Wedding RSVP from ${formData.name}`;
            const emailBody = `🎉 RSVP for Sangeetha & Sridharan's Wedding 🎉

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Name: ${formData.name}

📞 Phone: ${formData.phone}

👥 Number of Guests: ${formData.guestCount}

📅 Events Attending:
${formData.events.map(e => '   • ' + e).join('\n')}

${formData.message ? '💬 Message: ' + formData.message : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
            
            // Create mailto link
            const mailtoURL = `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
            
            // Show success message
            rsvpForm.style.display = 'none';
            rsvpSuccess.style.display = 'block';
            
            // Open email client
            window.location.href = mailtoURL;
            
            // Reset form after 5 seconds so they can submit again if needed
            setTimeout(() => {
                rsvpForm.reset();
                document.getElementById('guestCount').value = 1;
            }, 5000);
        });
    }
});
