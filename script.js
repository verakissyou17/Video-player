const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const fullScreeen = document.querySelector('.full-screen');
const volume = document.querySelector('.volume-btn');
const playbackSpeed = document.querySelector('.play-speed');
const selectorSpeed = document.getElementById('rate');
let volumeRange = document.querySelector('input[name="volume"]');
let playBackRate = document.querySelector('input[name="playbackRate"]');
const duration = document.querySelector('.duration');
let time = 0;
let interval;

function togglePlay() {
  time = video.duration - video.currentTime;
  const method = video.paused ? 'play' : 'pause';
  video[method]();
  if(method === 'play') {
    renderDuration(time);
    document.body.style.background = 'radial-gradient(ellipse at  center, hsla(171, 87%, 67%, 1) 10%, hsl(186, 11%, 18%) 45%, hsla(236, 100%, 72%, 1),  hsl(186, 11%, 18%) 65%)';
  } else {
    clearInterval(interval);
    document.body.style.background = 'radial-gradient(ellipse at  center, hsla(236, 100%, 72%, 1) 10%, hsla(186, 11%, 18%) 45%, hsla(171, 87%, 67%, 1),  hsla(186, 11%, 18%) 65%)';
  }
};

function renderDuration (time) {
  let hours  = Math.floor(time / 3600);
  let minutes = Math.floor((time % 3600) / 60);
  let seconds = Math.floor(time % 60);
  interval = setInterval(() => {
    seconds--;
    if(seconds < 0) {
      seconds = 59;
      minutes--;
    }
    if(minutes < 0) {
      minutes = 59;
      hours--;
    }
    duration.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, 1000);
}

function updateButton() {
  const icon = this.paused ? '►' : '❚ ❚'; 
  toggle.textContent = icon;
}

function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
  time = video.duration - video.currentTime;
  clearInterval(interval);
  renderDuration(time);
}

function handleRangeUpdate() {
  video[this.name] = this.value;
    volumeRange.value = this.value; 
    video.volume = volumeRange.value;
    volume.textContent = '🔊';
}

function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
  clearInterval(interval);
  time = video.duration - video.currentTime;
  renderDuration(time);
}

function fullScreeenClick() {
  video.requestFullscreen();
};

function volumeClick() {
  if(volumeRange.value > '0') {
    volumeRange.value = '0';
    video.volume = volumeRange.value;
    volume.textContent = '🔇';
  } else {
    handleRangeUpdate();
  }
};

function renderSpeedSelector() {
  selectorSpeed.classList.add('visible');
};

function selectorSpeedClick() {
  playBackRate.value = selectorSpeed.value;
  video.playbackRate = playBackRate.value;
  selectorSpeed.classList.remove('visible');
};

/* Hook up the event listeners */
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);
fullScreeen.addEventListener('click', fullScreeenClick);
volume.addEventListener('click', volumeClick);
playbackSpeed.addEventListener('click', renderSpeedSelector);
selectorSpeed.addEventListener('change', selectorSpeedClick);

function endVideo() {
 document.body.innerHTML = `<h1>Thanks for watching this video</h1>`;
}

video.addEventListener('ended', endVideo);