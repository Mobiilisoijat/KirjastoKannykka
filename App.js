/*      

Routing needs to be done...
book search page (which will be the main page anyway) shall be copy pasted here for now

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
*/

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