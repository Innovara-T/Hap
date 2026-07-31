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
                if (video.dataset.loaded === 'true' || !video.dataset.src) return;

                video.src = video.dataset.src;
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
        const sourceUrl = video.getAttribute('src') || video.querySelector('source')?.getAttribute('src');
        if (sourceUrl) {
            video.dataset.src = sourceUrl;
            video.removeAttribute('src');
            video.querySelectorAll('source').forEach((source) => source.remove());
        }

        video.setAttribute('preload', 'none');
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('controls', '');
        video.setAttribute('muted', '');
        videoObserver.observe(video);
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
