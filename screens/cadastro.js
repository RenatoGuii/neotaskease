import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import estiloForm from "../styles/AuthenticatonStyleForms";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../src/services/firebaseConnection";
import { Ionicons } from "@expo/vector-icons";

export default function CadastroScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  async function handleCadastro() {
    if (!username.trim()) {
      Alert.alert("Nome de usuário é obrigatório");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Senha é obrigatória");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Atualizar o perfil do usuário com o username
      await updateUsername(user, username);

      console.log("Cadastro feito: ", user.uid);
      console.log("Nome de usuário:", user.displayName);

      setEmail("");
      setPassword("");
      setUsername("");

      Alert.alert("✅ Sucesso", "Sua conta foi criada!");

      navigation.navigate("Home");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("E-mail já está em uso, por favor, escolha outro e-mail.");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("E-mail inválido, por favor, insira um e-mail válido.");
      } else {
        console.error(error);
      }
    }
  }

  async function updateUsername(user, username) {
    await updateProfile(user, { displayName: username });
  }

  const handleLoginNavigate = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={estiloForm.container}>
      <Text style={estiloForm.tituloLogo}>
        <Text style={estiloForm.tituloLogo1}>Neo</Text>
        <Text style={estiloForm.tituloLogo2}>TaskEase</Text>
      </Text>
      <Text style={estiloForm.p1}>Insira seus dados para cadastro!</Text>
      <TextInput
        style={estiloForm.input}
        placeholder="Nome de Usuário"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
      />
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
      <TouchableOpacity
        style={estiloForm.botaoCadastro}
        onPress={handleCadastro}
      >
        <Text style={estiloForm.botaoText}>Cadastrar</Text>
      </TouchableOpacity>

      <View style={estiloForm.linha} />

      <TouchableOpacity onPress={handleLoginNavigate}>
        <Text style={estiloForm.p2}>Já tem uma conta? Entre aqui</Text>
      </TouchableOpacity>
    </View>
  );
}
