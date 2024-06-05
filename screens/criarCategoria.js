import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../src/services/firebaseConnection";
import estiloForm from "../styles/AuthenticatonStyleForms";

export default function CriarCategoriaScreen({ navigation }) {
  const [nomeCategoria, setNomeCategoria] = useState("");

  const handleCriarCategoria = async () => {
    if (nomeCategoria === "") {
      Alert.alert("É necessário preencher o campo para criar uma categoria!");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Usuário não autenticado!");
        return;
      }

      const docRef = await addDoc(collection(db, "categorias"), {
        nome: nomeCategoria,
        userId: user.uid, // Adiciona o ID do usuário à categoria
      });

      console.log("Categoria criada com ID:", docRef.id);

      setNomeCategoria("");

      Alert.alert("✅ Sucesso", "Categoria criada com sucesso!");

      navigation.navigate("Home");
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      Alert.alert(
        "❌ Erro",
        "Houve um erro ao criar a categoria. Tente novamente mais tarde."
      );
    }
  };

  return (
    <View style={estiloForm.container}>
      <View style={estiloForm.header}>
        <Text style={estiloForm.tituloLogo}>
          <Text style={estiloForm.tituloLogo1}>Neo</Text>
          <Text style={estiloForm.tituloLogo2}>TaskEase</Text>
        </Text>
      </View>
      <Text style={[estiloForm.p1, { marginBottom: 20 }]}>
        Digite o nome da categoria:
      </Text>
      <TextInput
        style={estiloForm.input}
        placeholder="Nome da Categoria"
        placeholderTextColor="#888"
        value={nomeCategoria}
        onChangeText={setNomeCategoria}
      />
      <TouchableOpacity
        style={[estiloForm.botaoCadastro, { marginTop: 20 }]}
        onPress={handleCriarCategoria}
      >
        <Text style={estiloForm.botaoText}>Criar Categoria</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={estiloForm.botaoRetornar}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={estiloForm.botaoText}>Retornar</Text>
      </TouchableOpacity>
    </View>
  );
}