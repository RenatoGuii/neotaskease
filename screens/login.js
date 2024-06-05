import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import estiloForm from "../styles/AuthenticatonStyleForms";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../src/services/firebaseConnection";
import { Ionicons } from "@expo/vector-icons";
import estiloCadastro from "../styles/AuthenticatonStyleForms";

export default function CadastroScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  async function handleLogin() {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login realizado com sucesso");

      setEmail("");
      setPassword("");

      navigation.navigate("Home");
    } catch (error) {
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/invalid-email"
      ) {
        Alert.alert(
          "Usuário não encontrado, e-mail ou senha estão incorretos."
        );
      } else {
        console.error(error);
      }
    }
  }

  async function handlePasswordReset() {
    if (!email.trim()) {
      Alert.alert("Por favor, insira o seu e-mail para recuperar a senha.");
      return;
    }

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
        style={estiloCadastro.botaoEsqueceuSenha}
        onPress={handlePasswordReset}
      >
        <Text style={estiloForm.esqueceuSenha}>Esqueceu sua senha?</Text>
      </TouchableOpacity>

      <View style={estiloForm.linha} />

      <TouchableOpacity onPress={handleLoginNavigate}>
        <Text style={estiloForm.p2}>Não tem uma conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}
