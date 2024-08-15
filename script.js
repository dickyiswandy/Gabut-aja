document.addEventListener('DOMContentLoaded', () => {
    feather.replace();

    const audio = document.getElementById('audio');
    const lyricsContainer = document.getElementById('lyrics-container');
    const playIcon = document.getElementById('play-icon');
    const rightPages = document.querySelectorAll('.right-page');
    let isPlaying = true;
    let lyricsInterval;
    let currentPage = 0;

    const lyrics = [
        { time: 1, text: "Katakan cinta, katakan cinta", page: 0 },
        { time: 6, text: "Hati ini meminta", page: 1 },
        { time: 10, text: "Kau lebih dari teman berbagi", page: 2 },
        { time: 15, text: "Jadi kekasihku saja", page: 3 },
        { time: 18, text: "Cinta katakan cinta", page: 4 },
        { time: 22, text: "Hati ini meminta", page: 5 },
        { time: 26, text: "Kau lebih dari teman berbagi", page: 6 },
    ];

    function syncLyricsAndPages() {
        lyricsInterval = setInterval(() => {
            const currentTime = audio.currentTime;
            const currentLyric = lyrics.find(lyric => Math.floor(lyric.time) === Math.floor(currentTime));

            if (currentLyric) {
                lyricsContainer.textContent = currentLyric.text;
                showPage(currentLyric.page);
            }
        }, 500);
    }

    function preloadImages(pages) {
        return new Promise((resolve) => {
            let loadedCount = 0;
            const totalImages = pages.length;

            pages.forEach(page => {
                const img = page.querySelector('img');
                if (img.complete) {
                    loadedCount++;
                } else {
                    img.onload = () => {
                        loadedCount++;
                        if (loadedCount === totalImages) {
                            resolve();
                        }
                    };
                }
            });

            if (loadedCount === totalImages) {
                resolve();
            }
        });
    }

    function showPage(pageIndex) {
        rightPages.forEach((page, index) => {
            page.classList.remove('active', 'previous', 'next');

            if (index === pageIndex) {
                page.classList.add('active');
            } else if (index < pageIndex) {
                page.classList.add('previous');
            } else {
                page.classList.add('next');
            }
        });
    }

    async function initializeBook() {
        await preloadImages(rightPages);
        showPage(currentPage);
        syncLyricsAndPages();
    }

    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.textContent = '❄';
        snowflake.style.left = Math.random() * window.innerWidth + 'px';
        snowflake.style.animationDuration = Math.random() * 3 + 7 + 's';
        snowflake.style.opacity = Math.random();
        snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';
        document.body.appendChild(snowflake);

        setTimeout(() => {
            snowflake.remove();
        }, 10000);
    }

    audio.addEventListener('loadedmetadata', initializeBook);
    audio.addEventListener('play', () => {
        playIcon.style.display = 'none';
        syncLyricsAndPages();
        isPlaying = true;
    });

    audio.addEventListener('pause', () => {
        playIcon.style.display = 'block';
        clearInterval(lyricsInterval);
        isPlaying = false;
    });

    document.querySelector('.music-player').addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
    });

    setInterval(createSnowflake, 300);
});