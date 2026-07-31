const entryScreen = document.getElementById('entryScreen');
const siteContent = document.getElementById('siteContent');
const voiceNote = document.getElementById('voiceNote');
const envelopes = document.querySelectorAll('.envelope');
const messageBox = document.getElementById('messageBox');
const musicToggle = document.getElementById('musicToggle');
const musicStatus = document.getElementById('musicStatus');
const bgAudio = document.getElementById('bgAudio');

envelopes.forEach((envelope) => {
    envelope.addEventListener('click', () => {
        const message = envelope.dataset.message || 'You are so loved.';
        messageBox.hidden = false;
        messageBox.textContent = message;
    });
});

const startBackgroundMusic = async () => {
    if (!bgAudio) return;

    bgAudio.volume = 0.12;
    bgAudio.muted = false;

    try {
        await bgAudio.play();
        if (musicToggle) {
            musicToggle.textContent = 'Pause music';
        }
        if (musicStatus) {
            musicStatus.textContent = 'Playing softly';
        }
    } catch (error) {
        if (musicStatus) {
            musicStatus.textContent = 'Tap play to start';
        }
    }
};

window.addEventListener('load', () => {
    startBackgroundMusic();

    const videoObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const video = entry.target;
                if (video.dataset.loaded === 'true') return;

                const hasSources = video.dataset.hasSources === 'true';
                if (!hasSources && !video.dataset.src) return;

                if (hasSources) {
                    // Restore each <source> src from data-src then load the video
                    video.querySelectorAll('source').forEach((s) => {
                        if (s.dataset.src) s.src = s.dataset.src;
                    });
                } else {
                    video.src = video.dataset.src;
                }
                video.setAttribute('playsinline', '');
                video.setAttribute('webkit-playsinline', '');
                video.setAttribute('preload', 'metadata');
                video.setAttribute('controls', '');
                video.setAttribute('muted', '');

                try {
                    video.load();
                } catch (error) {
                    // Ignore load errors for unsupported clients.
                }

                video.dataset.loaded = 'true';
                videoObserver.unobserve(video);
            });
        },
        { rootMargin: '220px 0px 220px 0px', threshold: 0.01 }
    );

    document.querySelectorAll('video').forEach((video) => {
        const sourceEls = Array.from(video.querySelectorAll('source'));

        if (sourceEls.length) {
            // Preserve <source> elements but move their src into data-src to lazy-load later.
            sourceEls.forEach((s) => {
                const src = s.getAttribute('src');
                if (src) {
                    s.dataset.src = src;
                    s.removeAttribute('src');
                }
            });
            video.dataset.hasSources = 'true';
        } else {
            const sourceUrl = video.getAttribute('src');
            if (sourceUrl) {
                video.dataset.src = sourceUrl;
                video.removeAttribute('src');
            }
        }

        video.setAttribute('preload', 'none');
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('controls', '');
        video.setAttribute('muted', '');
        videoObserver.observe(video);

        // Surface load errors for debugging (won't break runtime)
        const getVideoUrl = (v) => {
            const hasSources = v.dataset.hasSources === 'true';
            if (hasSources) {
                const src = v.querySelector('source')?.dataset?.src || v.querySelector('source')?.src;
                return src || v.dataset.src;
            }
            return v.dataset.src || v.src;
        };

        video.addEventListener('loadedmetadata', () => {
            console.info('Video metadata loaded:', getVideoUrl(video));
        });

        video.addEventListener('canplay', () => {
            console.info('Video can play:', getVideoUrl(video));
        });

        video.addEventListener('error', (e) => {
            const url = getVideoUrl(video);
            console.warn('Video load error:', e, url);

            // Show a simple fallback link to download the file so users can view it natively
            const container = video.closest('.media-card') || video.parentElement;
            if (container && !container.querySelector('.video-fallback')) {
                const a = document.createElement('a');
                a.className = 'video-fallback';
                a.href = url || '#';
                a.textContent = url ? 'Download / Open video' : 'Video unavailable';
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.style.display = 'inline-block';
                a.style.marginTop = '0.6rem';
                a.style.color = 'var(--accent-2)';
                a.style.textDecoration = 'underline';
                container.appendChild(a);
            }
        });
    });

    setTimeout(() => {
        entryScreen?.classList.add('hidden');
        siteContent?.classList.add('ready');
    }, 7000);
});

musicToggle?.addEventListener('click', async () => {
    if (!bgAudio) return;

    if (bgAudio.paused) {
        try {
            await bgAudio.play();
            if (musicToggle) {
                musicToggle.textContent = 'Pause music';
            }
            if (musicStatus) {
                musicStatus.textContent = 'Playing softly';
            }
        } catch (error) {
            if (musicStatus) {
                musicStatus.textContent = 'Tap play to start';
            }
        }
    } else {
        bgAudio.pause();
        if (musicToggle) {
            musicToggle.textContent = 'Play music';
        }
        if (musicStatus) {
            musicStatus.textContent = 'Paused';
        }
    }
});

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    },
    { threshold: 0.2 }
);

document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));
