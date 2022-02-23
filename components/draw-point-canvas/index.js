import React from "react"
import { View, StyleSheet } from "react-native"
import WebView from "react-native-webview"
import useDrawPointCanvasViewModel from "./DrawPointCanvas.viewmodel"

const DrawPointCanvas = (props) => {
  const { handleWebViewRef, webViewHtml, handleMessageFromWebView } =
    useDrawPointCanvasViewModel()
  return (
    <View style={[styles.container, props.style]}>
      <WebView
        source={{ html: webViewHtml }}
        onMessage={handleMessageFromWebView}
        ref={handleWebViewRef}
        style={{ flex: 1 }}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
export default DrawPointCanvas
