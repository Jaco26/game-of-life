

const universe = makeUniverse({
  width: 600,
  height: 600,
  cols: 30,
  rows: 30,
})

const animation = makeAnimation(universe.tick)

makeUi(animation)

