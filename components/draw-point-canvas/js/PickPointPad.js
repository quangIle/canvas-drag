export default //PickPointPad
`
const PickPointPad = (canvas, options) => {
  const { backgroundCanvas, bufferCanvas } = canvas
  const ctxBackground = backgroundCanvas.getContext("2d")
  const ctxBuffer = bufferCanvas.getContext("2d")
  const dotSize = 10
  const lineWidth = 2
  const color = "black"
  const data = []

  let startX, startY, endX, endY
  let mouseButtonDown = false
  let hasArrow = false

  const handleMouseDown = (event) => {
    if (event.which === 1 && !mouseButtonDown) {
      mouseButtonDown = true
      strokeBegin(event)
    }
  }
  const handleMouseMove = (event) => {
    if (mouseButtonDown) {
      strokeMoveUpdate(event)
    }
  }
  const handleMouseUp = (event) => {
    if (event.which === 1 && mouseButtonDown) {
      mouseButtonDown = false
      strokeEnd(event)
    }
  }
  const handleTouchStart = function (event) {
    event.preventDefault()
    if (event.targetTouches.length === 1) {
      const touch = event.changedTouches[0]
      strokeBegin(touch)
    }
  }
  const handleTouchMove = function (event) {
    event.preventDefault()
    const touch = event.targetTouches[0]
    strokeMoveUpdate(touch)
  }
  const handleTouchEnd = function (event) {
    const wasCanvasTouched = event.target === bufferCanvas
    if (wasCanvasTouched) {
      event.preventDefault()
      const touch = event.changedTouches[0]
      strokeEnd(touch)
    }
  }
  const undo = () => {
    if (data.length === 0) return
    data.pop()
    drawFromData(data)
  }
  const resetAction = () => {
    hasArrow = false
  }  
  const endAction = () => {}
  const isOnInvalidPixel = (x, y) => {
    return false
  }  
  const clearCanvas = (canvas) => {
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }  
  const drawFromData = (data) => {
    clearCanvas(backgroundCanvas)
    data.map((item) => drawArrow(ctxBackground, item.startX, item.startY, item.endX, item.endY))
  }
  const drawDot = (ctx, x, y) => {
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.arc(x, y, dotSize, 0, 2 * Math.PI, false)
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
  }
  const drawArrow = (ctx, x0, y0, x1, y1) => {        
    drawDot(ctx, x0, y0)     

    const radius = 20
    const angle = 50
    const anglerad = (Math.PI * angle) / 180.0
    const lineangle = Math.atan2(y1 - y0, x1 - x0)
    
    x1 = x0 + 30 * Math.cos(lineangle)
    y1 = y0 + 30 * Math.sin(lineangle)

    ctx.beginPath()
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = color
    
    //line
    ctx.moveTo(x0, y0)    
    ctx.lineTo(x0 + 28 * Math.cos(lineangle), y0 + 28 * Math.sin(lineangle))    
    ctx.stroke()

    //arrow
    ctx.moveTo(x1, y1)
    ctx.lineTo(
      x1 - radius * Math.cos(lineangle - anglerad / 2.0),
      y1 - radius * Math.sin(lineangle - anglerad / 2.0)
    )    
    ctx.lineTo(
      x1 - radius * Math.cos(lineangle + anglerad / 2.0),
      y1 - radius * Math.sin(lineangle + anglerad / 2.0)
    )
    ctx.fill()  
    ctx.closePath()
    endX = x1
    endY = y1
  }
  const strokeBegin = (event) => {    
    startX = event.clientX
    startY = event.clientY

    if (isOnInvalidPixel(startX, startY)) return
    drawDot(ctxBuffer, startX, startY)
    resetAction()
  }
  const strokeMoveUpdate = (event) => {
    hasArrow = true    
    clearCanvas(bufferCanvas)
    drawArrow(ctxBuffer, startX, startY, event.clientX, event.clientY)
  }
  const strokeEnd = (event) => {        
    if (hasArrow) savePointToBackground()    
    clearCanvas(bufferCanvas)
  }
  const savePointToBackground = () => {
    drawArrow(ctxBackground, startX, startY, endX, endY)
    data.push({startX, startY, endX, endY})
    window.ReactNativeWebView.postMessage(data.length)    
  } 
  const handlePointerEvents = () => {
    mouseButtonDown = false
    bufferCanvas.addEventListener("pointerdown", handleMouseDown)
    bufferCanvas.addEventListener("pointermove", handleMouseMove)
    document.addEventListener("pointerup", handleMouseUp)
  }
  const handleMouseEvents = () => {
    mouseButtonDown = false
    bufferCanvas.addEventListener("mousedown", handleMouseDown)
    bufferCanvas.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }
  const handleTouchEvents = () => {
    bufferCanvas.addEventListener("touchstart", handleTouchStart)
    bufferCanvas.addEventListener("touchmove", handleTouchMove)
    bufferCanvas.addEventListener("touchend", handleTouchEnd)
  }
  const handleEvent = () => {    
    bufferCanvas.style.touchAction = "none"
    bufferCanvas.style.msTouchAction = "none"
    if (window.PointerEvent) {
      handlePointerEvents()
    } else {
      handleMouseEvents()
      if ("ontouchstart" in window) {
        handleTouchEvents()
      }
    }
  }
  const resize = () => {    
    const ratio = Math.max(window.devicePixelRatio || 1, 1)
    backgroundCanvas.width = backgroundCanvas.offsetWidth * ratio
    backgroundCanvas.height = backgroundCanvas.offsetHeight * ratio
    ctxBackground.scale(ratio, ratio)

    bufferCanvas.width = backgroundCanvas.width
    bufferCanvas.height = backgroundCanvas.height
    ctxBuffer.scale(ratio, ratio)
  }
  const getPointsData = () => {

  }
  const init = () => {
    window.ReactNativeWebView.postMessage("init")
    handleEvent()
    resize()
  }
  //***************************************
  init()
  return {
    undo, 
    getPointsData
  }
}
const backgroundCanvas = document.getElementById("background")
const bufferCanvas = document.getElementById("buffer")

const pickPointPad = PickPointPad({ backgroundCanvas, bufferCanvas })
`
