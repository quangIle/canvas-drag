import React, { forwardRef } from "react"
import { View, StyleSheet } from "react-native"
import WebView from "react-native-webview"
import useDrawPointCanvasViewModel from "./DrawPointCanvas.viewmodel"

const DrawPointCanvas = forwardRef((props, ref) => {
  const { handleWebViewRef, webViewSource, handleMessageFromWebView } =
    useDrawPointCanvasViewModel(props, ref)

  return (
    <View style={[styles.container, props.style]}>
      <WebView
        source={webViewSource}
        onMessage={handleMessageFromWebView}
        ref={handleWebViewRef}
        style={{ flex: 1 }}
      />
    </View>
  )
})
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
export default DrawPointCanvas
