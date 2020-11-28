function makeUi(animation) {

  const btnPlayPause = document.querySelector('#btn-play-pause')
  const btnFrame = document.querySelector('#btn-frame')
  const rngSpeed = document.querySelector('#rng-speed')
  const rngSpeedLabel = document.querySelector('#rng-speed-label')

  btnPlayPause.addEventListener('click', () => {
    if (animation.isPlaying()) {
      btnPlayPause.textContent = 'Play'
      btnFrame.removeAttribute('disabled')
      animation.pause()
    } else {
      btnPlayPause.textContent = 'Pause'
      btnFrame.setAttribute('disabled', true)
      animation.play()
    }
  })

  btnFrame.addEventListener('click', animation.frame)
  
  function syncRngSpeed() {
    const value = Number(rngSpeed.value)
    rngSpeedLabel.textContent = 'Speed: ' + value
    animation.throttle(value)
  }

  rngSpeed.addEventListener('input', syncRngSpeed)

  syncRngSpeed()
}