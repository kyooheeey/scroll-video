const scrollVideo = document.getElementById('js-scrollVideo');
const documentHeight = document.documentElement.scrollHeight;
const windowHeight = document.documentElement.clientHeight;
const maxScrollY = documentHeight - windowHeight;
let videoDuration;

(function() {
  var requestAnimationFrame = window.requestAnimationFrame || 
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame || 
  window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

scrollVideo.addEventListener('loadedmetadata', () => {
  videoDuration = scrollVideo.duration;
  
  scrollVideo.addEventListener('play', () => {
    scrollVideo.pause();
  })
  
  const UPDATE_LOAD_COEFF = 0.5;
  const fps = 5;
  let targetInterval = 1000 / fps;
  let prevTime = Date.now() - targetInterval;
  function scrollPlay(){
    let current = Date.now();
    let updated = false;
    while (current - prevTime > targetInterval * 0.5) {
      const frameNumber  = window.pageYOffset / maxScrollY * videoDuration;
      scrollVideo.currentTime  = frameNumber;
      updated = true;
      prevTime += targetInterval;
      const now = Date.now();
      const updateTime = now - current;
      if (updateTime > targetInterval * UPDATE_LOAD_COEFF) {
        // overloaded
        if (prevTime < now - targetInterval) {
          // do not accumulate too much
          prevTime = now - targetInterval;
        }
        break;
      }
    }
    requestAnimationFrame(scrollPlay);
  }
  scrollPlay();
})
