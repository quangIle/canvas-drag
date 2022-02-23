import { useRef } from "react"
import PickPointPadHtml from "./js/PickPointPad"

const useDrawPointCanvasViewModel = () => {
  const webViewRef = useRef()

  const handleWebViewRef = (ref) => {
    if (webViewRef.current) return
    webViewRef.current = ref
    // webViewRef.current.injectJavaScript(`

    // `)
  }
  const handleMessageFromWebView = (e) => {
    const message = e.nativeEvent.data
    console.log("message from webview:", message)
  }
  const initialHtmlScript = `
    window.onresize = (event) => {            
      window.ReactNativeWebView.postMessage(window.innerWidth)
      const backgroundCanvas = document.getElementById("background")    
      const bufferCanvas = document.getElementById("buffer")                  
      backgroundCanvas.width = window.innerWidth
      backgroundCanvas.height = window.innerHeight
      bufferCanvas.width = window.innerWidth
      bufferCanvas.height = window.innerHeight
    }
  `
  const webViewHtml = `
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
          ${PickPointPadHtml}
        </script>
      </body>
    </html >
  `
  return {
    handleWebViewRef,
    initialHtmlScript,
    webViewHtml,
    handleMessageFromWebView,
  }
}
export default useDrawPointCanvasViewModel
