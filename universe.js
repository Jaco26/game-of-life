
function makeUniverse({ width, height, cols, rows } = {}) {
  const canvas = document.querySelector('canvas')
  const ctx = canvas.getContext('2d')

  const cellWidth = Math.round(width / cols)
  const cellHeight = Math.round(height / rows)

  const bgFill = '#ace'
  const bgCellOn = '#333'
  const bgCellOff = '#ffe'

  const state = {
    cells: [],
    changedCellIndices: []
  }

  function setup() {
    canvas.width = width
    canvas.height = height
    canvas.addEventListener('click', onClick)
    ctx.fillStyle = bgFill
    ctx.fillRect(0, 0, width, height)
    for (let i = 0; i < rows * cols; i++) {
      state.cells.push(0)
      state.changedCellIndices.push(i)
    }
    drawChangedCells()
  }

  function onClick(e) {
    const cellIdx = toggleCell(e.offsetX, e.offsetY)
    state.changedCellIndices.push(cellIdx)
    drawChangedCells()
  }

  function toggleCell(x, y) {
    const row = Math.floor(y / cellHeight)
    const col = Math.floor(x / cellWidth)
    const cellIdx = row * cols + col
    state.cells[cellIdx] = state.cells[cellIdx] === 1 ? 0 : 1
    return cellIdx
  }

  function drawChangedCells() {
    for (let i = 0; i < state.changedCellIndices.length; i++) {
      const cellIdx = state.changedCellIndices[i]
      const cellValue = state.cells[cellIdx]
      const row = Math.floor(cellIdx / cols)
      const col = cellIdx % cols
      const x = col * cellWidth
      const y = row * cellHeight
      ctx.fillStyle = cellValue === 1 ? bgCellOn : bgCellOff
      ctx.fillRect(x, y, cellWidth - 1, cellHeight - 1)
    }
  }

  function getCellRowCol(cellIdx) {
    return {
      row: Math.floor(cellIdx / cols),
      col: cellIdx % cols
    }
  }

  function getCellIdx(row, col) {
    return row * cols + col
  }

  function getNeighborIndicesOfCell(cellIdx) {
    const cell = getCellRowCol(cellIdx)
    const rowsDelta = [-1, 0, 1]
    const colsDelta = [-1, 0, 1]
    const neighbors = []
    for (let rdi = 0; rdi < rowsDelta.length; rdi++) {
      const deltaRow = rowsDelta[rdi]
      const nbrRow = (cell.row + deltaRow) % height
      for (let cdi = 0; cdi < colsDelta.length; cdi++) {
        const deltaCol = colsDelta[cdi]
        if (deltaRow === 0 && deltaCol === 0) {
          continue
        }
        const nbrCol = (cell.col + deltaCol) % width
        const nbrIdx = getCellIdx(nbrRow, nbrCol)
        neighbors.push(nbrIdx)
      }
    }
    return neighbors
  }

  function checkNeighbors() {
    const changed = []
    for (let i = 0; i < state.cells.length; i++) {
      const nbrIndices = getNeighborIndicesOfCell(i)
      const liveNbrCount = nbrIndices.filter(nbrIdx => state.cells[nbrIdx]).length
      // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
      // Any live cell with two or three live neighbours lives on to the next generation.
      // Any live cell with more than three live neighbours dies, as if by overpopulation.
      // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
      if (state.cells[i] === 1) {
        if (liveNbrCount < 2 || liveNbrCount > 3) {
          changed.push({ cellIdx: i, value: 0 })
        }
      } else if (liveNbrCount === 3) {
        changed.push({ cellIdx: i, value: 1 })
      }
    }
    state.changedCellIndices = []
    for (let i = 0; i < changed.length; i++) {
      state.cells[changed[i].cellIdx] = changed[i].value
      state.changedCellIndices.push(changed[i].cellIdx)
    }
  }

  function tick() {
    checkNeighbors()
    drawChangedCells()
  }

  setup()

  return { tick }
}
