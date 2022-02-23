import { StatusBar } from "expo-status-bar"
import { StyleSheet, Text, View } from "react-native"
import DrawPointCanvas from "./components/draw-point-canvas"

export default function App() {
  return (
    <View style={styles.container}>
      <DrawPointCanvas />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
