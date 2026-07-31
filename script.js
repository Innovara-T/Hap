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

    // Ensure local video/source URLs are properly encoded (handles spaces/parentheses)
    document.querySelectorAll('video').forEach((v) => {
        const src = v.getAttribute('src');
        if (src) {
            const enc = encodeURI(src);
            if (enc !== src) {
                v.setAttribute('src', enc);
                try { v.load(); } catch (e) { }
            }
        }
        v.querySelectorAll('source').forEach((s) => {
            const ssrc = s.getAttribute('src');
            if (ssrc) {
                const enc2 = encodeURI(ssrc);
                if (enc2 !== ssrc) {
                    s.setAttribute('src', enc2);
                    try { v.load(); } catch (e) { }
                }
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
