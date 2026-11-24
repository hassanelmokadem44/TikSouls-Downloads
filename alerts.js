const alerts = {
  rose: { title: 'Rose received', detail: '@skye sent a Rose' },
  coins: { title: 'Coin threshold reached', detail: '@rex sent 1,000 coins' },
  entry: { title: 'Welcome, @luna!', detail: 'Specific viewer joined' },
};

const video = document.querySelector('#alert-video');
const caption = document.querySelector('#alert-caption');
const idle = document.querySelector('#alert-idle');
const status = document.querySelector('#alert-status');
const sound = document.querySelector('#alert-sound');
let playback = 0;

function hideClip() {
  video.hidden = true;
  caption.hidden = true;
  idle.hidden = false;
}

sound.addEventListener('change', () => {
  video.muted = !sound.checked;
});

document.querySelector('#alerts').addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-alert]');
  if (!button) return;

  const { title, detail } = alerts[button.dataset.alert];
  const attempt = ++playback;
  document.querySelector('#alert-title').textContent = title;
  document.querySelector('#alert-detail').textContent = detail;
  idle.hidden = true;
  video.hidden = false;
  caption.hidden = false;
  video.muted = !sound.checked;
  video.currentTime = 0;
  status.textContent = detail;

  try {
    await video.play();
  } catch {
    if (attempt !== playback) return;
    hideClip();
    status.textContent = 'The clip could not play. Try again or reload the page.';
  }
});

video.addEventListener('ended', () => {
  if (!video.ended) return;
  hideClip();
  status.textContent = 'Clip finished. Choose an event to play it again.';
});
