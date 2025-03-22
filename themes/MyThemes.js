import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import { Colors } from "../constants/colors";

const darkTheme = { ...MD3DarkTheme, ...Colors.dark };
const lightTheme = { ...MD3LightTheme, ...Colors.light };

export { darkTheme, lightTheme };