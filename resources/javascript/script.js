// state

const state = { activeTrack: 0, initPlay: false };

//selectors

const audio = document.querySelector("#audio-player");

const ui = {
    // slider
    seekBar: document.querySelector(".seek-slider input"),

    // buttons
    prevBtn: document.querySelector(".prev"),
    playPauseBtn: document.querySelector(".play-pause"),
    nextBtn: document.querySelector(".next"),

    // track info
    artwork: document.querySelector(".artwork"),
    name: document.querySelector(".name"),
    artist: document.querySelector(".artist"),

    // time
    currentTime: document.querySelector(".current-time"),
    duration: document.querySelector(".duration"),
}


// event listeners

const setupEventListeners = () => {
    document.addEventListener("DOMContentLoaded", loadTrack);
    
    // player events
    ui.playPauseBtn.addEventListener("click", playPauseTrack);
    ui.prevBtn.addEventListener("click", prevTrack);
    ui.nextBtn.addEventListener("click", nextTrack);
    ui.seekBar.addEventListener("change", updateSeekBar);

    // audio events
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateTrackInfo);
    audio.addEventListener("durationchange", updateDuration);

}

// event handlers

const updateSeekBar = () => {
    audio.currentTime = (ui.seekBar.value / 100) * audio.duration;
}

const nextTrack = () => {
    state.activeTrack = (state.activeTrack + 1) % tracks.length;
    loadTrack();
}

const prevTrack = () => {
    state.activeTrack = (state.activeTrack - 1 + tracks.length) % tracks.length;
    loadTrack();
}

const playPauseTrack = () => {
    if (audio.paused) {
        audio.play();
        ui.playPauseBtn.innerHTML = '<svg width="32" height="32" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g><path fill="#E5E7EB" d="M13.3,23.7c-0.6,0-1-0.4-1-1V9.3c0-0.6,0.4-1,1-1s1,0.4,1,1v13.3C14.3,23.2,13.9,23.7,13.3,23.7z"/><path fill="#E5E7EB" d="M18.7,23.7c-0.6,0-1-0.4-1-1V9.3c0-0.6,0.4-1,1-1s1,0.4,1,1v13.3C19.7,23.2,19.2,23.7,18.7,23.7z"/></g></svg>';

    } else {
        audio.pause();
        ui.playPauseBtn.innerHTML = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.941 14.244L14.119 10.236C12.686 9.50176 11 10.5696 11 12.2115V19.7885C11 21.4304 12.686 22.4982 14.119 21.764L21.941 17.756C23.353 17.0325 23.353 14.9675 21.941 14.244Z" fill="#E5E7EB"/></svg>';
    }

    if(!state.initPlay) state.initPlay = true;
}

const updateTime = () => {
    ui.seekBar.value = (audio.currentTime / audio.duration) * 100;
    ui.currentTime.textContent = formatTime(audio.currentTime);
}

const updateDuration = () => {
    ui.seekBar.value = 0;
    ui.duration.textContent = formatTime(audio.duration);
}

const updateTrackInfo = () => {
    ui.artwork.src = tracks[state.activeTrack].artwork;
    ui.name.textContent = tracks[state.activeTrack].name;
    ui.artist.textContent = tracks[state.activeTrack].artist;
}

const loadTrack = () => {
    audio.src = tracks[state.activeTrack].path;
    state.initPlay && playPauseTrack();
}

const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

setupEventListeners();