import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FIREBASE_AUTH } from './firebase/Config';
import { onAuthStateChanged, User } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import LoginScreen from './screens/LoginScreen';
import Testi from './screens/Testi';
import BookSearchPage from './screens/BookSearchPage';
import BooklistScreen from './screens/BooklistScreen';
import BookInfo from './screens/BookInfo';
import BottomTab from './components/BottomBar';

const Stack = createNativeStackNavigator();

const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      {/* Bottom navigator bar*/}
      <InsideStack.Screen name="Tabs" component={BottomTab} options={{ headerShown: false }} />
      {/* Other navigation paths*/}
      <InsideStack.Screen name="BookSearchPage" component={BookSearchPage} options={{ headerShown: false }} />
      <InsideStack.Screen name="BooklistScreen" component={BooklistScreen} options={{ headerShown: false }} />
      <InsideStack.Screen name="Testi" component={Testi} />
      <InsideStack.Screen name="BookInfo" component={BookInfo} initialParams={{bookId: "anders.1970703"}}/>
    </InsideStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    })
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        { user ? (
          <Stack.Screen name="Inside" component={InsideLayout} options={{ headerShown: false }} />

        ) : (


            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />

        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export {InsideStack}
