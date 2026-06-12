let currentSongIndex = 0;
let isPlaying = false;

const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const volumeSlider = document.getElementById('volumeSlider');
const progressBar = document.querySelector('.progress-bar');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const nowPlayingTitle = document.getElementById('nowPlayingTitle');
const nowPlayingArtist = document.getElementById('nowPlayingArtist');
const nowPlayingImg = document.getElementById('nowPlayingImg');
const playlistContainer = document.getElementById('playlistContainer');

// Initialize player
function init() {
    loadPlaylist();
    loadSong(currentSongIndex);
    audioPlayer.volume = volumeSlider.value / 100;
}

// Load song
function loadSong(index) {
    const song = All_song[index];
    audioPlayer.src = song.path;
    nowPlayingTitle.textContent = song.name;
    nowPlayingArtist.textContent = song.singer;
    nowPlayingImg.src = song.img;
    updatePlaylistUI();
}

// Load playlist UI
function loadPlaylist() {
    playlistContainer.innerHTML = '';
    All_song.forEach((song, index) => {
        const songEl = document.createElement('div');
        songEl.classList.add('playlist-item');
        if (index === currentSongIndex) {
            songEl.classList.add('active');
        }
        songEl.innerHTML = `
            <p class="playlist-item-title">${song.name}</p>
            <p class="playlist-item-artist">${song.singer}</p>
        `;
        songEl.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(index);
            play();
        });
        playlistContainer.appendChild(songEl);
    });
}

// Play song
function play() {
    audioPlayer.play();
    isPlaying = true;
    playBtn.textContent = '⏸ Pause';
}

// Pause song
function pause() {
    audioPlayer.pause();
    isPlaying = false;
    playBtn.textContent = '▶ Play';
}

// Toggle play/pause
playBtn.addEventListener('click', () => {
    if (isPlaying) {
        pause();
    } else {
        play();
    }
});

// Previous song
prevBtn.addEventListener('click', () => {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = All_song.length - 1;
    }
    loadSong(currentSongIndex);
    play();
});

// Next song
nextBtn.addEventListener('click', () => {
    currentSongIndex++;
    if (currentSongIndex >= All_song.length) {
        currentSongIndex = 0;
    }
    loadSong(currentSongIndex);
    play();
});

// Auto next when song ends
audioPlayer.addEventListener('ended', () => {
    currentSongIndex++;
    if (currentSongIndex >= All_song.length) {
        currentSongIndex = 0;
    }
    loadSong(currentSongIndex);
    play();
});

// Update time
audioPlayer.addEventListener('timeupdate', () => {
    const { currentTime, duration } = audioPlayer;
    
    // Update progress bar
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    
    // Update time displays
    currentTimeEl.textContent = formatTime(currentTime);
    durationEl.textContent = formatTime(duration);
});

// Progress bar click
progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioPlayer.currentTime = percent * audioPlayer.duration;
});

// Volume control
volumeSlider.addEventListener('input', (e) => {
    audioPlayer.volume = e.target.value / 100;
});

// Format time helper
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Update playlist UI highlighting
function updatePlaylistUI() {
    const items = playlistContainer.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
        if (index === currentSongIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Initialize on load
window.addEventListener('DOMContentLoaded', init);
