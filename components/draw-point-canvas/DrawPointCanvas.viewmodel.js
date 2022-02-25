import { useImperativeHandle, useMemo, useRef } from "react"
import PickPointPadHtml from "./js/PickPointPad"

const useDrawPointCanvasViewModel = (props, ref) => {
  const {
    dotSize = 5,
    lineWidth = 2,
    dotColor = "black",
    arrowColor = "black",
    invalidColors = [],
    arrowHeadLength = 15,
    arrowAngle = 30,
    lineLength = 25,
    lineMargin = 5,
    onGetPointsData = () => {},
  } = props
  const webViewRef = useRef()

  const handleWebViewRef = (ref) => {
    if (webViewRef.current) return
    webViewRef.current = ref
    // webViewRef.current.injectJavaScript(`
    // pickPointPad.undo()
    // `)
  }
  const handleMessageFromWebView = (e) => {
    const data = e.nativeEvent.data
    switch (data) {
      case "CREATE":
        console.log("Initialize Canvas")
        break

      default:
        onGetPointsData(JSON.parse(data))
        break
    }
  }
  const templateHtml = (script) => `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no">
      </head>
      <style>
        body {          
          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          margin: 0;
        }             
      </style>
      <body>        
        <canvas id="background" 
          style="position: absolute; left: 0; top: 0; z-index: 0; width: 100%; height: 100%"></canvas>        
        <canvas id="buffer" 
          style="position: absolute; left: 0; top: 0; z-index: 1; width: 100%; height: 100%"></canvas>
        <script>
          ${script}
        </script>
      </body>
    </html >
  `
  const replaceScriptVariable = (script) => {
    script = script.replace(/<%dotSize%>/, dotSize)
    script = script.replace(/<%lineWidth%>/, lineWidth)
    script = script.replace(/<%dotColor%>/, JSON.stringify(dotColor))
    script = script.replace(/<%arrowColor%>/, JSON.stringify(arrowColor))
    script = script.replace(/<%invalidColors%>/, JSON.stringify(invalidColors))
    script = script.replace(/<%arrowHeadLength%>/, arrowHeadLength)
    script = script.replace(/<%arrowAngle%>/, arrowAngle)
    script = script.replace(/<%lineLength%>/, lineLength)
    script = script.replace(/<%lineMargin%>/, lineMargin)
    return script
  }
  const webViewSource = useMemo(() => {
    const pickPointPad = replaceScriptVariable(PickPointPadHtml)
    const html = templateHtml(pickPointPad)
    return { html }
  }, [
    dotSize,
    lineWidth,
    dotColor,
    arrowColor,
    invalidColors,
    arrowHeadLength,
    arrowAngle,
  ])
  useImperativeHandle(
    ref,
    () => ({
      undo: () => {
        if (webViewRef.current)
          webViewRef.current.injectJavaScript("pickPointPad.undo()")
      },
      getPointsData: () => {
        if (webViewRef.current)
          webViewRef.current.injectJavaScript("pickPointPad.getPointsData()")
      },
    }),
    [webViewRef]
  )
  return {
    handleWebViewRef,
    handleMessageFromWebView,
    webViewSource,
  }
}
export default useDrawPointCanvasViewModel
