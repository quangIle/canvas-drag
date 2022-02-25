import { StatusBar } from "expo-status-bar"
import { useRef } from "react"
import { StyleSheet, Text, View } from "react-native"
import DrawPointCanvas from "./components/draw-point-canvas"

export default function App() {
  const ref = useRef()
  if (ref.current) {
    console.log(ref.current)
    ref.current.getPointsData()
  }
  const handlePointsData = (data) => {
    console.log(data.length)
  }
  return (
    <View style={styles.container}>
      <DrawPointCanvas ref={ref} onGetPointsData={handlePointsData} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
