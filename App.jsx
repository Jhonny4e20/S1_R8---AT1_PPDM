import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import SeriesScreen from "./screens/SeriesScreen";
import DetalhesScreen from "./screens/DetalhesScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#1c1c1c",
          },

          headerTintColor: "#ffffff",

          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "S1_R8-AT1",
          }}
        />

        <Stack.Screen
          name="Series"
          component={SeriesScreen}
          options={{
            title: "Séries",
          }}
        />

        <Stack.Screen
          name="Detalhes"
          component={DetalhesScreen}
          options={{
            title: "Detalhes",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}