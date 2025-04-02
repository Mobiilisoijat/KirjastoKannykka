import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BookSearchPage from "../screens/BookSearchPage";
import Testi from "../screens/Testi";
import AntDesign from '@expo/vector-icons/AntDesign';
import BooklistScreen from "../screens/BooklistScreen";
import StatisticsScreen from "../screens/StatisticsScreen";

const Tab = createBottomTabNavigator()

function BottomBar() {
  return(
    <Tab.Navigator
    screenOptions={{
      tabBarStyle: {position: "absolute"},
    }}
    >
      <Tab.Screen
        name="BookSearchPage"
        component={BookSearchPage}
        options={{
          title: "Koti",
          headerShown: false,
          tabBarIcon: ({color, size}) => <AntDesign name="home" color={color} size={size}/>
        }}
      />
      <Tab.Screen
        name="BooklistScreen"
        component={BooklistScreen}
        options={{
          title: "Lukulista",
          headerShown: false,
          tabBarIcon: ({color, size}) => <AntDesign name="book" color={color} size={size}/>
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Testi}
        options={{
          title: "Profiili",
          tabBarIcon: ({color, size}) => <AntDesign name="user" color={color} size={size}/>
        }}
      />
      <Tab.Screen
        name="Aktiviteetti"
        component={StatisticsScreen}
        options={{
          title: "Aktiviteetti",
          tabBarIcon: ({color, size}) => <AntDesign name="bells" color={color} size={size}/>
        }}
      />
    </Tab.Navigator>
  )
}

export default BottomBar
