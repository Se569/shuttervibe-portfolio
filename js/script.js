const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.gallery-card');

filters.forEach(btn => btn.addEventListener('click', () => {

    filters.forEach(b => b.classList.remove('active'));

    btn.classList.add('active');

    const filter = btn.dataset.filter;

    cards.forEach(card => {

        const visible =
            filter === 'all' ||
            card.dataset.category === filter;

        card.style.display = visible ? '' : 'none';

    });

}));


// =========================================
// IMAGE LIGHTBOX
// =========================================

const lightbox =
    document.getElementById('lightbox');

const lightboxImage =
    document.getElementById('lightboxImage');

const lightboxCloseBtn =
    document.getElementById('lightboxClose');


const closeLightbox = () => {

    if (!lightbox) return;

    lightbox.classList.remove('open');

    lightbox.setAttribute(
        'aria-hidden',
        'true'
    );

    document.body.style.overflow = '';

};


if (lightbox && lightboxImage) {

    cards.forEach(card => {

        card.addEventListener('click', (e) => {

            const link =
                e.target.closest('a');

            if (link) return;


            const img =
                card.querySelector('img');

            if (!img) return;


            lightboxImage.src =
                img.src;

            lightboxImage.alt =
                img.alt;


            lightbox.classList.add('open');

            lightbox.setAttribute(
                'aria-hidden',
                'false'
            );


            document.body.style.overflow =
                'hidden';

        });

    });

}


if (lightboxCloseBtn) {

    lightboxCloseBtn.addEventListener(
        'click',
        closeLightbox
    );

}


if (lightbox) {

    lightbox.addEventListener(
        'click',
        e => {

            if (e.target === lightbox) {
                closeLightbox();
            }

        }
    );

}


document.addEventListener(
    'keydown',
    e => {

        if (e.key === 'Escape') {
            closeLightbox();
        }

    }
);



// =========================================
// CONTACT FORM
// =========================================

const form =
    document.getElementById('contactForm');

const status =
    document.getElementById('formStatus');


if (form && status) {

    form.addEventListener(
        'submit',
        e => {

            e.preventDefault();


            const data =
                Object.fromEntries(
                    new FormData(form).entries()
                );


            const subject =
                encodeURIComponent(
                    `Photography enquiry — ${data.name}`
                );


            const body =
                encodeURIComponent(
                    `Name: ${data.name}\n` +
                    `Email: ${data.email}\n` +
                    `Service: ${data.service}\n\n` +
                    `${data.message}`
                );


            window.location.href =
                `mailto:hello@shuttervibe.com?subject=${subject}&body=${body}`;


            status.textContent =
                'Opening your email app…';

        }
    );

}



// =========================================
// YEAR
// =========================================

const yearElement =
    document.getElementById('year');


if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}




// =========================================
// YOUTUBE + VIMEO + CLOUDINARY VIDEO LIGHTBOX
// WORKS ON INDEX + FILMS PAGE
// =========================================

const videoCards =
    document.querySelectorAll('.video-card');

const videoLightbox =
    document.getElementById('videoLightbox');

const youtubeFrame =
    document.getElementById('youtubeFrame');

const cloudinaryPlayer =
    document.getElementById('cloudinaryPlayer');

const videoLightboxClose =
    document.getElementById('videoLightboxClose');


// -----------------------------------------
// Detect video provider / source
//
// Supported:
// data-youtube-id="VIDEO_ID"
// data-vimeo-id="VIDEO_ID"
// data-cloudinary-url="FULL_VIDEO_URL"
// data-video-provider="youtube|vimeo|cloudinary"
// -----------------------------------------
function getVideoData(card) {

    if (!card) return null;

    const provider =
        (card.dataset.videoProvider || '').toLowerCase();

    const youtubeId =
        (card.dataset.youtubeId || '').trim();

    const vimeoId =
        (card.dataset.vimeoId || '').trim();

    const cloudinaryUrl =
        (card.dataset.cloudinaryUrl || '').trim();


    if (provider === 'cloudinary' && cloudinaryUrl) {
        return {
            provider: 'cloudinary',
            url: cloudinaryUrl
        };
    }


    if (provider === 'vimeo' && vimeoId) {
        return {
            provider: 'vimeo',
            id: vimeoId
        };
    }


    if (provider === 'youtube' && youtubeId) {
        return {
            provider: 'youtube',
            id: youtubeId
        };
    }


    // Automatic fallback
    if (cloudinaryUrl) {
        return {
            provider: 'cloudinary',
            url: cloudinaryUrl
        };
    }

    if (youtubeId) {
        return {
            provider: 'youtube',
            id: youtubeId
        };
    }

    if (vimeoId) {
        return {
            provider: 'vimeo',
            id: vimeoId
        };
    }

    return null;
}


// =========================================
// RESET / STOP ALL PLAYERS
// =========================================
function resetVideoPlayers() {

    if (youtubeFrame) {
        youtubeFrame.src = '';
        youtubeFrame.style.display = 'none';
    }

    if (cloudinaryPlayer) {
        cloudinaryPlayer.pause();
        cloudinaryPlayer.removeAttribute('src');
        cloudinaryPlayer.load();
        cloudinaryPlayer.style.display = 'none';
    }
}


// =========================================
// OPEN VIDEO
// =========================================
function openVideo(videoData) {

    if (!videoData || !videoLightbox) {
        return;
    }

    resetVideoPlayers();


    // =====================================
    // YOUTUBE
    // =====================================
    if (videoData.provider === 'youtube') {

        if (!youtubeFrame) return;

        const origin =
            encodeURIComponent(
                window.location.origin
            );

        youtubeFrame.src =
            `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoData.id)}` +
            `?autoplay=1` +
            `&rel=0` +
            `&playsinline=1` +
            `&origin=${origin}`;

        youtubeFrame.style.display = 'block';
    }


    // =====================================
    // VIMEO
    // =====================================
    else if (videoData.provider === 'vimeo') {

        if (!youtubeFrame) return;

        youtubeFrame.src =
            `https://player.vimeo.com/video/${encodeURIComponent(videoData.id)}` +
            `?autoplay=1` +
            `&title=0` +
            `&byline=0` +
            `&portrait=0` +
            `&playsinline=1`;

        youtubeFrame.style.display = 'block';
    }


    // =====================================
    // CLOUDINARY / DIRECT MP4
    // =====================================
    else if (videoData.provider === 'cloudinary') {

        if (!cloudinaryPlayer) return;

        cloudinaryPlayer.src =
            videoData.url;

        cloudinaryPlayer.style.display =
            'block';

        cloudinaryPlayer.currentTime = 0;

        const playPromise =
            cloudinaryPlayer.play();

        if (
            playPromise &&
            typeof playPromise.catch === 'function'
        ) {
            playPromise.catch(() => {});
        }
    }


    else {
        console.warn(
            'Unsupported video provider:',
            videoData.provider
        );
        return;
    }


    videoLightbox.classList.add('open');

    videoLightbox.setAttribute(
        'aria-hidden',
        'false'
    );

    document.body.style.overflow =
        'hidden';
}


// =========================================
// CLOSE VIDEO
// =========================================
function closeVideo() {

    if (!videoLightbox) {
        return;
    }

    resetVideoPlayers();

    videoLightbox.classList.remove('open');

    videoLightbox.setAttribute(
        'aria-hidden',
        'true'
    );

    document.body.style.overflow = '';
}


// =========================================
// VIDEO CARD CLICK
// =========================================
videoCards.forEach(card => {

    const button =
        card.querySelector('.video-thumb');

    if (!button) return;

    button.addEventListener(
        'click',
        () => {

            const videoData =
                getVideoData(card);

            if (!videoData) {
                console.warn(
                    'No YouTube, Vimeo or Cloudinary video found for this card.'
                );
                return;
            }

            openVideo(videoData);
        }
    );
});


// =========================================
// CLOUDINARY CARD PREVIEWS
// Silent autoplay previews
// =========================================
document
    .querySelectorAll('.video-thumb video')
    .forEach(video => {

        video.muted = true;
        video.autoplay = true;
        video.loop = true;
        video.playsInline = true;

        const startPreview = () => {
            const promise = video.play();

            if (
                promise &&
                typeof promise.catch === 'function'
            ) {
                promise.catch(() => {});
            }
        };

        if (video.readyState >= 2) {
            startPreview();
        } else {
            video.addEventListener(
                'loadeddata',
                startPreview,
                { once: true }
            );
        }
    });


// =========================================
// CLOSE VIDEO BUTTON
// =========================================
if (videoLightboxClose) {

    videoLightboxClose.addEventListener(
        'click',
        closeVideo
    );
}


// =========================================
// CLOSE VIDEO BY BACKDROP
// =========================================
if (videoLightbox) {

    videoLightbox.addEventListener(
        'click',
        e => {

            if (e.target === videoLightbox) {
                closeVideo();
            }

        }
    );
}


// =========================================
// ESCAPE KEY
// =========================================
document.addEventListener(
    'keydown',
    e => {

        if (e.key === 'Escape') {
            closeVideo();
        }

    }
);


// =========================================
// MOBILE MENU
// =========================================

const menuToggle =
    document.querySelector('.menu-toggle');


const mobileMenu =
    document.querySelector('.mobile-menu');


if (
    menuToggle &&
    mobileMenu
) {

    menuToggle.addEventListener(
        'click',
        () => {

            mobileMenu.classList.toggle(
                'active'
            );


            const isOpen =
                mobileMenu.classList.contains(
                    'active'
                );


            menuToggle.setAttribute(
                'aria-expanded',
                isOpen
            );


            if (isOpen) {

                menuToggle.setAttribute(
                    'aria-label',
                    'Close menu'
                );

            } else {

                menuToggle.setAttribute(
                    'aria-label',
                    'Open menu'
                );

            }

        }
    );


    /*
       Close menu after
       clicking a link
    */

    document
        .querySelectorAll(
            '.mobile-menu a'
        )
        .forEach(link => {

            link.addEventListener(
                'click',
                () => {

                    mobileMenu.classList.remove(
                        'active'
                    );


                    menuToggle.setAttribute(
                        'aria-expanded',
                        'false'
                    );


                    menuToggle.setAttribute(
                        'aria-label',
                        'Open menu'
                    );

                }
            );

        });

}



// =========================================
// SCROLL ANIMATIONS
// BOKEH + PARALLAX
// =========================================

const bokeh1 =
    document.querySelector('.bokeh-1');


const bokeh2 =
    document.querySelector('.bokeh-2');


const heroBg =
    document.querySelector('.hero-bg');


/*
   HERO VIDEO
   The video sits behind all hero content.
   It receives the same parallax movement
   as the previous hero background.
*/
const heroVideo =
    document.querySelector('.hero-video');


window.addEventListener(
    'scroll',
    () => {

        const scrolled =
            window.scrollY;


        if (bokeh1) {

            bokeh1.style.transform =
                `translateY(${scrolled * -0.25}px) ` +
                `rotate(${scrolled * 0.05}deg)`;

        }


        if (bokeh2) {

            bokeh2.style.transform =
                `translateY(${scrolled * 0.18}px) ` +
                `rotate(${scrolled * -0.05}deg)`;

        }


        /*
           Keep old background working
           as fallback.
        */
        if (heroBg) {

            heroBg.style.transform =
                `translateY(${scrolled * 0.35}px)`;

        }


        /*
           Apply the same parallax effect
           to the hero video.
        */
        if (heroVideo) {

            heroVideo.style.transform =
                `translateY(${scrolled * 0.35}px)`;

        }

    }
);



// =========================================
// AUTOMATIC SCROLL REVEAL
// =========================================

const observerOptions = {

    threshold: 0.15,

    rootMargin:
        "0px 0px -50px 0px"

};


const scrollObserver =
    new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

                if (
                    entry.isIntersecting
                ) {

                    entry.target.classList.add(
                        'is-visible'
                    );


                    observer.unobserve(
                        entry.target
                    );

                }

            });

        },
        observerOptions
    );



// =========================================
// SELECT ELEMENTS TO ANIMATE
// =========================================

document.addEventListener(
    'DOMContentLoaded',
    () => {

        const animatableElements =
            document.querySelectorAll(

                '.gallery-card,' +
                '.service-card,' +
                '.about-image,' +
                '.about-copy,' +
                '.section-head,' +
                '.contact-grid > div,' +
                '.contact-form'

            );


        animatableElements.forEach(
            (el, index) => {

                el.classList.add(
                    'reveal-on-scroll'
                );


                /*
                   Gallery & services
                   stagger animation
                */

                if (
                    el.classList.contains(
                        'gallery-card'
                    ) ||
                    el.classList.contains(
                        'service-card'
                    )
                ) {

                    el.style.transitionDelay =
                        `${(index % 3) * 0.12}s`;

                }


                scrollObserver.observe(
                    el
                );

            }
        );

    }
);



// =========================================
// 3D GALLERY TILT & ZOOM
// =========================================

const tiltCards =
    document.querySelectorAll(
        '.gallery-card'
    );


tiltCards.forEach(
    card => {

        const img =
            card.querySelector('img');


        if (!img) return;


        card.addEventListener(
            'mousemove',
            e => {

                const rect =
                    card.getBoundingClientRect();


                const x =
                    e.clientX -
                    rect.left;


                const y =
                    e.clientY -
                    rect.top;


                const centerX =
                    rect.width / 2;


                const centerY =
                    rect.height / 2;


                /*
                   Calculate rotation
                */

                const rotateX =
                    ((y - centerY) /
                        centerY) * -8;


                const rotateY =
                    ((x - centerX) /
                        centerX) * 8;


                img.style.transition =
                    'transform 0.1s ease-out';


                img.style.transform =
                    `scale(1.08) ` +
                    `rotateX(${rotateX}deg) ` +
                    `rotateY(${rotateY}deg)`;

            }
        );


        card.addEventListener(
            'mouseleave',
            () => {

                img.style.transition =
                    'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';


                img.style.transform =
                    'scale(1) rotateX(0deg) rotateY(0deg)';

            }
        );

    }
);



// =========================================
// CINEMATIC LIGHT DUST + BOKEH
// =========================================

const canvas =
    document.getElementById(
        'bg-canvas'
    );


if (canvas) {

    const ctx =
        canvas.getContext('2d');


    let particles = [];


    let width =
        canvas.width =
            window.innerWidth;


    let height =
        canvas.height =
            window.innerHeight;


    let lastScrollY =
        window.scrollY;


    let scrollVelocity = 0;



    // -------------------------------------
    // Resize
    // -------------------------------------

    window.addEventListener(
        'resize',
        () => {

            width =
                canvas.width =
                    window.innerWidth;


            height =
                canvas.height =
                    window.innerHeight;

        }
    );



    // -------------------------------------
    // Particle colors
    // -------------------------------------

    const particleColors = [

        'rgba(255, 215, 170, ',

        'rgba(255, 255, 255, ',

        'rgba(240, 190, 130, ',

        'rgba(200, 220, 255, '

    ];



    // -------------------------------------
    // Particle class
    // -------------------------------------

    class Particle {

        constructor() {

            this.reset();

        }


        reset() {

            this.x =
                Math.random() *
                width;


            this.y =
                Math.random() *
                height;


            this.radius =
                Math.random() *
                2.5 +
                0.8;


            this.baseSpeedY =
                (Math.random() - 0.5) *
                0.4;


            this.baseSpeedX =
                (Math.random() - 0.5) *
                0.3;


            this.color =
                particleColors[
                    Math.floor(
                        Math.random() *
                        particleColors.length
                    )
                ];


            this.alpha =
                Math.random() *
                0.5 +
                0.15;


            this.pulseSpeed =
                Math.random() *
                0.01 +
                0.005;

        }



        update() {

            /*
               React to scroll velocity
            */

            this.y -=
                this.baseSpeedY +
                scrollVelocity * 0.12;


            this.x +=
                this.baseSpeedX;


            /*
               Pulse opacity
            */

            this.alpha +=
                Math.sin(
                    Date.now() *
                    this.pulseSpeed
                ) * 0.003;


            /*
               Wrap around screen
            */

            if (this.y < -10) {

                this.y =
                    height + 10;

            }


            if (this.y > height + 10) {

                this.y = -10;

            }


            if (this.x < -10) {

                this.x =
                    width + 10;

            }


            if (this.x > width + 10) {

                this.x = -10;

            }

        }



        draw() {

            ctx.beginPath();


            ctx.arc(
                this.x,
                this.y,
                this.radius,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                `${this.color}${
                    Math.max(
                        0,
                        Math.min(
                            1,
                            this.alpha
                        )
                    )
                })`;


            ctx.shadowBlur =
                12;


            ctx.shadowColor =
                'rgba(255, 200, 150, 0.5)';


            ctx.fill();

        }

    }



    // -------------------------------------
    // Generate particles
    // -------------------------------------

    const particleCount =
        Math.min(
            60,
            Math.floor(
                width / 22
            )
        );


    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        particles.push(
            new Particle()
        );

    }



    // -------------------------------------
    // Scroll velocity
    // -------------------------------------

    window.addEventListener(
        'scroll',
        () => {

            const currentScrollY =
                window.scrollY;


            scrollVelocity =
                currentScrollY -
                lastScrollY;


            lastScrollY =
                currentScrollY;

        }
    );



    // -------------------------------------
    // Animation loop
    // -------------------------------------

    function animate() {

        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        /*
           Decay scroll inertia
        */

        scrollVelocity *=
            0.92;


        particles.forEach(
            p => {

                p.update();
                p.draw();

            }
        );


        requestAnimationFrame(
            animate
        );

    }


    animate();

}



// =========================================
// MACOS ARROW CURSOR
// =========================================

const macosCursor =
    document.querySelector(
        '[data-macos-cursor]'
    );


const cursorLabel =
    document.querySelector(
        '[data-cursor-label]'
    );


if (
    macosCursor &&
    window.matchMedia(
        '(hover: hover) and (pointer: fine)'
    ).matches
) {

    let mouseX = -100;
    let mouseY = -100;

    let cursorX = -100;
    let cursorY = -100;



    // -------------------------------------
    // Track mouse
    // -------------------------------------

    window.addEventListener(
        'mousemove',
        e => {

            mouseX =
                e.clientX;


            mouseY =
                e.clientY;

        }
    );



    // -------------------------------------
    // Smooth cursor animation
    // -------------------------------------

    function renderCursor() {

        cursorX +=
            (mouseX - cursorX) *
            0.22;


        cursorY +=
            (mouseY - cursorY) *
            0.22;


        macosCursor.style.left =
            `${cursorX}px`;


        macosCursor.style.top =
            `${cursorY}px`;


        requestAnimationFrame(
            renderCursor
        );

    }


    renderCursor();



    // -------------------------------------
    // Gallery hover
    // -------------------------------------

    document
        .querySelectorAll(
            '.gallery-card'
        )
        .forEach(
            card => {

                card.addEventListener(
                    'mouseenter',
                    () => {

                        document.body.classList.add(
                            'cursor-hover-gallery'
                        );


                        if (cursorLabel) {

                            cursorLabel.textContent =
                                'EXPLORE';

                        }

                    }
                );


                card.addEventListener(
                    'mouseleave',
                    () => {

                        document.body.classList.remove(
                            'cursor-hover-gallery'
                        );

                    }
                );

            }
        );



    // -------------------------------------
    // Clickable elements
    // -------------------------------------

    document
        .querySelectorAll(
            'a, button, input, textarea, select, .service-card'
        )
        .forEach(
            el => {

                el.addEventListener(
                    'mouseenter',
                    () => {

                        document.body.classList.add(
                            'cursor-hover-link'
                        );

                    }
                );


                el.addEventListener(
                    'mouseleave',
                    () => {

                        document.body.classList.remove(
                            'cursor-hover-link'
                        );

                    }
                );

            }
        );

}



// =========================================
// BUTTON MAGNETIC EFFECT
// =========================================

const magneticBtn =
    document.querySelector(
        '.btn-work'
    );


if (
    magneticBtn &&
    window.matchMedia(
        '(hover: hover) and (pointer: fine)'
    ).matches
) {

    magneticBtn.addEventListener(
        'mousemove',
        e => {

            const rect =
                magneticBtn.getBoundingClientRect();


            const x =
                e.clientX -
                rect.left -
                rect.width / 2;


            const y =
                e.clientY -
                rect.top -
                rect.height / 2;


            magneticBtn.style.transform =
                `translate(${x * 0.25}px, ${y * 0.25 - 3}px) scale(1.02)`;

        }
    );


    magneticBtn.addEventListener(
        'mouseleave',
        () => {

            magneticBtn.style.transform =
                'translate(0px, 0px) scale(1)';

        }
    );

}



// =========================================
// SMART GLASS NAVBAR
// =========================================

let lastScrollY = window.scrollY;

const header =
    document.querySelector('.site-header');


if (header) {

    window.addEventListener('scroll', () => {

        const currentScrollY =
            window.scrollY;


        /* =========================
           VERY TOP
        ========================= */

        if (currentScrollY <= 20) {

            header.classList.remove(
                'header-hidden'
            );

            header.classList.remove(
                'header-glass'
            );

        }


        /* =========================
           SCROLLING DOWN
           Hide navbar
        ========================= */

        else if (
            currentScrollY > lastScrollY
        ) {

            header.classList.add(
                'header-hidden'
            );

        }


        /* =========================
           SCROLLING UP
           Show + glass
        ========================= */

        else {

            header.classList.remove(
                'header-hidden'
            );

            header.classList.add(
                'header-glass'
            );

        }


        lastScrollY =
            currentScrollY;

    });

}





// ============================================================
// SHUTTERVIBE PREMIUM MODERN INTRO LOADER
// ============================================================
(function () {
    const loader = document.getElementById('sv-loader');
    if (!loader) return;

    const minimumTime = 3900;
    const startedAt = performance.now();
    let finished = false;

    function finish() {
        if (finished) return;
        finished = true;

        const elapsed = performance.now() - startedAt;
        const delay = Math.max(0, minimumTime - elapsed);

        setTimeout(() => {
            loader.classList.add('sv-loader-ready');
            setTimeout(() => {
                loader.remove();
            }, 1150);
        }, delay);
    }

    if (document.readyState === 'complete') {
        finish();
    } else {
        window.addEventListener('load', finish, { once: true });
    }
})();
