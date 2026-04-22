const channelTitleEl = document.getElementById("channel-title");
const channelAvatarEl = document.getElementById("channel-avatar");
const subsCountEl = document.getElementById("subs-count");
const viewsCountEl = document.getElementById("views-count");
const latestVideoLinkEl = document.getElementById("latest-video-link");
const latestVideoThumbEl = document.getElementById("latest-video-thumb");
const latestVideoTitleEl = document.getElementById("latest-video-title");
const latestVideoDateEl = document.getElementById("latest-video-date");
const leftMarqueeTrack = document.getElementById("left-marquee-track");
const rightMarqueeTrack = document.getElementById("right-marquee-track");

function formatNumber(value) {
    return Number(value || 0).toLocaleString("ru-RU");
}

function formatDate(value) {
    try {
        return new Date(value).toLocaleDateString("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    } catch (error) {
        return "Дата недоступна";
    }
}

function shuffleArray(items) {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function buildMarquee(trackEl, thumbs) {
    if (!trackEl || !thumbs.length) return;

    const randomized = shuffleArray(thumbs);
    const duplicated = [...randomized, ...randomized];

    const html = duplicated.map((url) => (
        `<div class="marquee-thumb-wrap"><img class="marquee-thumb" src="${url}" alt=""></div>`
    )).join("");

    trackEl.innerHTML = html;
}

async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error.message || "YouTube API error");
    }
    return data;
}

async function loadChannelSummary() {
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?key=${API_KEY}&id=${CHANNEL_ID}&part=snippet,statistics`;
    const latestVideoUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=1&type=video`;
    const videosForMarqueeUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=30&type=video`;

    try {
        const [channelData, latestVideoData, marqueeVideoData] = await Promise.all([
            fetchJson(channelUrl),
            fetchJson(latestVideoUrl),
            fetchJson(videosForMarqueeUrl)
        ]);

        const channel = channelData.items?.[0];
        const latestVideo = latestVideoData.items?.[0];
        const marqueeVideos = marqueeVideoData.items || [];

        if (!channel) {
            throw new Error("Канал не найден");
        }

        const channelTitle = channel.snippet?.title || "PolimerS";
        const channelAvatar = channel.snippet?.thumbnails?.high?.url ||
            channel.snippet?.thumbnails?.medium?.url ||
            channel.snippet?.thumbnails?.default?.url;

        channelTitleEl.textContent = channelTitle;
        if (channelAvatar) {
            channelAvatarEl.src = channelAvatar;
        }

        subsCountEl.textContent = formatNumber(channel.statistics?.subscriberCount);
        viewsCountEl.textContent = formatNumber(channel.statistics?.viewCount);

        if (latestVideo) {
            const videoId = latestVideo.id?.videoId;
            const videoTitle = latestVideo.snippet?.title || "Без названия";
            const videoDate = latestVideo.snippet?.publishedAt;
            const videoThumb = latestVideo.snippet?.thumbnails?.high?.url ||
                latestVideo.snippet?.thumbnails?.medium?.url ||
                latestVideo.snippet?.thumbnails?.default?.url;

            latestVideoTitleEl.textContent = videoTitle;
            latestVideoDateEl.textContent = `Опубликовано: ${formatDate(videoDate)}`;
            if (videoThumb) latestVideoThumbEl.src = videoThumb;
            if (videoId) latestVideoLinkEl.href = `https://www.youtube.com/watch?v=${videoId}`;
        } else {
            latestVideoTitleEl.textContent = "Не удалось получить последнее видео";
            latestVideoDateEl.textContent = "Попробуйте обновить страницу позже";
        }

        const thumbs = marqueeVideos
            .map((video) => (
                video.snippet?.thumbnails?.medium?.url ||
                video.snippet?.thumbnails?.default?.url
            ))
            .filter(Boolean);

        buildMarquee(leftMarqueeTrack, thumbs);
        buildMarquee(rightMarqueeTrack, thumbs);
    } catch (error) {
        console.error("Ошибка загрузки сводки канала:", error);
        channelTitleEl.textContent = "Сводка временно недоступна";
        subsCountEl.textContent = "N/A";
        viewsCountEl.textContent = "N/A";
        latestVideoTitleEl.textContent = "Не удалось загрузить данные";
        latestVideoDateEl.textContent = "Проверьте API-ключ или попробуйте позже";
    }
}

function createDynamicGradients() {
    const gradients = [
        document.getElementById("gradient1"),
        document.getElementById("gradient2"),
        document.getElementById("gradient3")
    ];

    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        gradients[1].style.display = "none";
        gradients[2].style.display = "none";
    }

    let time = 0;
    let lastTime = 0;
    const frameRate = isMobile ? 30 : 60;
    const frameInterval = 1000 / frameRate;

    function interpolateColor(color1, color2, factor) {
        return {
            r: Math.round(color1.r + (color2.r - color1.r) * factor),
            g: Math.round(color1.g + (color2.g - color1.g) * factor),
            b: Math.round(color1.b + (color2.b - color1.b) * factor)
        };
    }

    function updateGradients(currentTime) {
        if (isMobile && currentTime - lastTime < frameInterval) {
            requestAnimationFrame(updateGradients);
            return;
        }
        lastTime = currentTime;
        time += isMobile ? 0.002 : 0.005;

        gradients.forEach((gradient, index) => {
            if (isMobile && index > 0) return;
            const phase = time + (index * Math.PI) / 3;
            const orange = { r: 255, g: 165, b: 0 };
            const purple = { r: 147, g: 51, b: 234 };
            const transition = (Math.sin(phase * 0.5) + 1) / 2;
            const currentColor = interpolateColor(orange, purple, transition);
            const oppositeColor = interpolateColor(purple, orange, transition);
            const opacity1 = isMobile ? 0.6 : 0.7;
            const opacity2 = isMobile ? 0.4 : 0.5;
            const opacity3 = isMobile ? 0.5 : 0.6;
            const angle = (phase * (isMobile ? 5 : 10)) % 360;
            const pos1 = 35 + (isMobile ? 3 : 5) * Math.sin(phase * (isMobile ? 0.2 : 0.3));
            const pos2 = 65 + (isMobile ? 3 : 5) * Math.cos(phase * (isMobile ? 0.2 : 0.3));

            gradient.style.background = `
                radial-gradient(circle at ${pos1}% ${pos2}%,
                    rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, ${opacity1}) 0%,
                    rgba(${oppositeColor.r}, ${oppositeColor.g}, ${oppositeColor.b}, ${opacity2 * 0.2}) 50%,
                    transparent 70%),
                radial-gradient(circle at ${pos2}% ${pos1}%,
                    rgba(${oppositeColor.r}, ${oppositeColor.g}, ${oppositeColor.b}, ${opacity2}) 0%,
                    rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, ${opacity1 * 0.2}) 50%,
                    transparent 70%),
                conic-gradient(from ${angle}deg,
                    rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, ${opacity3}) 0deg,
                    rgba(${oppositeColor.r}, ${oppositeColor.g}, ${oppositeColor.b}, ${opacity3}) 180deg,
                    rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, ${opacity3}) 360deg)
            `;
        });

        requestAnimationFrame(updateGradients);
    }

    requestAnimationFrame(updateGradients);
}

window.addEventListener("load", () => {
    createDynamicGradients();
    loadChannelSummary();
});
