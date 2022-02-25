export default //PickPointPad
`
const PickPointPad = (canvas, options) => {
  const { backgroundCanvas, bufferCanvas } = canvas
  const ctxBackground = backgroundCanvas.getContext("2d")
  const ctxBuffer = bufferCanvas.getContext("2d")
  
  const dotSize = <%dotSize%>
  const lineWidth = <%lineWidth%>
  const dotColor = <%dotColor%>
  const arrowColor = <%arrowColor%>
  const invalidColors = <%invalidColors%>
  const arrowHeadLength = <%arrowHeadLength%>
  const arrowAngle = <%arrowAngle%>
  const lineLength = <%lineLength%>
  const lineMargin = <%lineMargin%> // to avoid weird shape arrow
  
  const _ratio = Math.max(window.devicePixelRatio || 1, 1)
  const _angleRadian = (Math.PI * arrowAngle) / 180.0
  const _data = []
  
  let _startX, _startY, _endX, _endY
  let _mouseButtonDown = false
  let _isOnInvalidPixel = false
  let _hasArrow = false

  const handleMouseDown = (event) => {
    if (event.which === 1 && !_mouseButtonDown) {
      _mouseButtonDown = true
      strokeBegin(event)
    }
  }
  const handleMouseMove = (event) => {
    if (_mouseButtonDown) {
      strokeMoveUpdate(event)
    }
  }
  const handleMouseUp = (event) => {
    if (event.which === 1 && _mouseButtonDown) {
      _mouseButtonDown = false
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
    if (_data.length === 0) return
    _data.pop()
    drawFromData(_data)
  }
  const resetAction = () => {
    _hasArrow = false
    _isOnInvalidPixel = false
  }  
  const endAction = () => {}
  const getPixelColor = (x, y) => {
    x = x*_ratio
    y = y*_ratio
    const pixel = ctxBackground.getImageData(x, y, 1, 1)._data  

    const {0: r, 1: g, 2: b} = pixel
    // window.ReactNativeWebView.postMessage("#"+("000000" +((r << 16) | (g << 8) | b).toString(16)).slice(-6))  
    return "#"+("000000" +((r << 16) | (g << 8) | b).toString(16)).slice(-6)    
  }  
  const clearCanvas = (canvas) => {
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }  
  const drawFromData = (_data) => {
    clearCanvas(backgroundCanvas)
    _data.map((item) => drawArrow(ctxBackground, item._startX, item._startY, item._endX, item._endY))
  }
  const drawDot = (ctx, x, y) => {
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.arc(x, y, dotSize, 0, 2 * Math.PI, false)
    ctx.closePath()
    ctx.fillStyle = dotColor
    ctx.fill()
  }
  const drawArrow = (ctx, x0, y0, x1, y1) => {                
    const lineAngle = Math.atan2(y1 - y0, x1 - x0)
    
    x1 = x0 + lineLength * Math.cos(lineAngle)
    y1 = y0 + lineLength * Math.sin(lineAngle)

    ctx.beginPath()
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = arrowColor
    
    //line
    ctx.moveTo(x0, y0)    
    ctx.lineTo(x0 + (lineLength - lineMargin) * Math.cos(lineAngle), y0 + (lineLength - lineMargin) * Math.sin(lineAngle))    
    ctx.stroke()

    //arrow
    ctx.moveTo(x1, y1)
    ctx.lineTo(
      x1 - arrowHeadLength * Math.cos(lineAngle - _angleRadian / 2.0),
      y1 - arrowHeadLength * Math.sin(lineAngle - _angleRadian / 2.0)
    )    
    ctx.lineTo(
      x1 - arrowHeadLength * Math.cos(lineAngle + _angleRadian / 2.0),
      y1 - arrowHeadLength * Math.sin(lineAngle + _angleRadian / 2.0)
    )
    ctx.fillStyle = arrowColor
    ctx.fill()  
    ctx.closePath()

    drawDot(ctx, x0, y0)     

    _endX = x1
    _endY = y1
  }
  const strokeBegin = (event) => {    
    resetAction()

    _startX = event.clientX
    _startY = event.clientY
    const pixelColor = getPixelColor(_startX, _startY)
    if (invalidColors.includes(pixelColor))
    {
      _isOnInvalidPixel = true
      return
    }
    drawDot(ctxBuffer, _startX, _startY)
  }
  const strokeMoveUpdate = (event) => {
    if (_isOnInvalidPixel) return
    _hasArrow = true    
    clearCanvas(bufferCanvas)
    drawArrow(ctxBuffer, _startX, _startY, event.clientX, event.clientY)
  }
  const strokeEnd = (event) => {        
    if (_hasArrow) savePointToBackground()    
    clearCanvas(bufferCanvas)
  }
  const savePointToBackground = () => {
    drawArrow(ctxBackground, _startX, _startY, _endX, _endY)
    _data.push({_startX, _startY, _endX, _endY})       
  } 
  const handlePointerEvents = () => {
    _mouseButtonDown = false
    bufferCanvas.addEventListener("pointerdown", handleMouseDown)
    bufferCanvas.addEventListener("pointermove", handleMouseMove)
    document.addEventListener("pointerup", handleMouseUp)
  }
  const handleMouseEvents = () => {
    _mouseButtonDown = false
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
    backgroundCanvas.width = backgroundCanvas.offsetWidth * _ratio
    backgroundCanvas.height = backgroundCanvas.offsetHeight * _ratio
    ctxBackground.scale(_ratio, _ratio)

    bufferCanvas.width = backgroundCanvas.width
    bufferCanvas.height = backgroundCanvas.height
    ctxBuffer.scale(_ratio, _ratio)    
  }
  const getPointsData = () => {
    window.ReactNativeWebView.postMessage(JSON.stringify(_data)) 
  }
  const init = () => {
    window.ReactNativeWebView.postMessage("CREATE")
    handleEvent()
    resize()
    ctxBackground.beginPath()
    ctxBackground.rect(50, 50, 300, 700)
    ctxBackground.closePath()
    ctxBackground.fillStyle = "#123456"
    ctxBackground.fill()
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
