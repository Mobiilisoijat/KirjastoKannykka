import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import BooklistScreen from './screens/BooklistScreen';

export default function App() {
  return (
    <SafeAreaView>
      <BooklistScreen />
      <StatusBar style="auto" translucent={false} />
    </SafeAreaView>
  ) 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
