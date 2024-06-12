import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useFonts, Kameron_400Regular } from "@expo-google-fonts/kameron";

// Telas
import CadastroScreen from "./screens/cadastro";
import LoginScreen from "./screens/login";
import HomeScreen from "./screens/home";
import CriarCategoriaScreen from "./screens/criarCategoria";
import CriarTarefaScreen from "./screens/criarTarefa";
import TarefaScreen from "./screens/tarefa";
import ListaCategoriasScreen from "./screens/categorias";

const Stack = createStackNavigator();

export default function App() {
  const user = false;

  const [fontLoaded] = useFonts({
    Kameron_400Regular,
  });

  if (!fontLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Cadastro"
          component={CadastroScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="CriarCategoria"
          component={CriarCategoriaScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="CriarTarefa"
          component={CriarTarefaScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Tarefa"
          component={TarefaScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="ListaCat"
          component={ListaCategoriasScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
