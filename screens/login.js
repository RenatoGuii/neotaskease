import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import estiloForm from "../styles/AuthenticatonStyleForms";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../src/services/firebaseConnection";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("fhkmcr@gmail.com");
  const [password, setPassword] = useState("123456");
  const [hidePassword, setHidePassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        const user = auth.currentUser;
        if (user && user.uid === userId) {
          navigation.navigate("Home");
        }
      }
    };
    checkUser();
  }, []);

  async function handleLogin() {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await AsyncStorage.setItem("userId", userCredential.user.uid);
      console.log("Login realizado com sucesso");

      setEmail("");
      setPassword("");

      navigation.navigate("Home");
    } catch (error) {
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/invalid-email" ||
        !password
      ) {
        Alert.alert(
          "Usuário não encontrado, e-mail ou senha estão incorretos."
        );
      } else {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePasswordReset() {
    if (!email.trim()) {
      Alert.alert("Por favor, insira o seu e-mail para recuperar a senha.");
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Verifique seu e-mail para redefinir sua senha.");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        Alert.alert(
          "Este e-mail não está registrado. Por favor, insira um e-mail válido."
        );
      } else {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleLoginNavigate = () => {
    navigation.navigate("Cadastro");
  };

  return (
    <View style={estiloForm.container}>
      <Text style={estiloForm.tituloLogo}>
        <Text style={estiloForm.tituloLogo1}>Neo</Text>
        <Text style={estiloForm.tituloLogo2}>TaskEase</Text>
      </Text>
      <Text style={estiloForm.p1}>Insira seus dados para entrar!</Text>
      <TextInput
        style={estiloForm.input}
        placeholder="E-mail"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <View style={estiloForm.AreaInputSenha}>
        <TextInput
          style={estiloForm.inputSenha}
          placeholder="••••••••••••••"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={hidePassword}
        />
        <TouchableOpacity
          style={estiloForm.passwordInput}
          onPress={() => setHidePassword(!hidePassword)}
        >
          <Ionicons
            name={hidePassword ? "eye-off" : "eye"}
            size={24}
            color="#888"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={estiloForm.botaoCadastro} onPress={handleLogin}>
        <Text style={estiloForm.botaoText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={estiloForm.botaoEsqueceuSenha}
        onPress={handlePasswordReset}
      >
        <Text style={estiloForm.esqueceuSenha}>Esqueceu sua senha?</Text>
      </TouchableOpacity>

      <View style={estiloForm.linha} />

      <TouchableOpacity onPress={handleLoginNavigate}>
        <Text style={estiloForm.p2}>Não tem uma conta? Cadastre-se</Text>
      </TouchableOpacity>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 10,
  },
});
