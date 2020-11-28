function makeAnimation(update) {

  let _throttle = 1
  let _callCount = 0
  let _isPlaying = false
  let _animationHandle = null

  function play() {
    _callCount += 1
    if (_callCount === _throttle) {
      _isPlaying = true
      _callCount = 0
      update()
    }
    _animationHandle = requestAnimationFrame(play)
  }

  function pause() {
    _isPlaying = false
    cancelAnimationFrame(_animationHandle)
  }

  function frame() {
    update()
  }

  function throttle(val) {
    if (val > 10) val = 10
    else if (val < 1) val = 1
    _callCount = 0
    _throttle = 11 - val
    return _throttle
  }

  function isPlaying() {
    return _isPlaying
  }


  return { play, pause, frame, throttle, isPlaying }
}