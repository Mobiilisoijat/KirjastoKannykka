import { View, Text, StyleSheet, Button } from 'react-native'
import React from 'react'
import TopAppSearchBar from './components/TopAppSearchBar'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function App() {
    
    return (
    <SafeAreaView>
      <View>
        <TopAppSearchBar />
        <Text style={{color:"tomato"}}>BookSearchPage</Text>
        
        <Button title="juu"></Button>

      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
})