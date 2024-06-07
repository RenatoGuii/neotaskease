import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { collection, addDoc, query, getDocs, where } from "firebase/firestore";
import { db, auth } from "../src/services/firebaseConnection";
import { Picker } from "@react-native-picker/picker";
import estiloForm from "../styles/AuthenticatonStyleForms";
import estiloHome from "../styles/HomeStyle";

export default function CriarTarefaScreen({ navigation }) {
  const [nomeTarefa, setNomeTarefa] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const carregarCategorias = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Usuário não autenticado!");
        return;
      }

      const categoriasSnapshot = await getDocs(
        query(collection(db, "categorias"), where("userId", "==", user.uid))
      );
      const categoriasList = categoriasSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategorias(categoriasList);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  const handleCriarTarefa = async () => {
    if (nomeTarefa === "" || categoriaSelecionada === "") {
      Alert.alert("Por favor, preencha todos os campos.");
      return;
    }

    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Usuário não autenticado!");
        return;
      }

      const docRef = await addDoc(collection(db, "tarefas"), {
        nome: nomeTarefa,
        categoria: categoriaSelecionada,
        status: "CRIADO",
        userId: user.uid,
      });

      console.log("Tarefa criada com ID:", docRef.id);

      setNomeTarefa("");
      setCategoriaSelecionada("");

      Alert.alert("✅ Sucesso", "Tarefa criada com sucesso!");

      navigation.navigate("Home");
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      Alert.alert(
        "❌ Erro",
        "Houve um erro ao criar a tarefa. Por favor, tente novamente mais tarde."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={estiloForm.container}>
      <Text style={estiloForm.tituloLogo}>
        <Text style={estiloForm.tituloLogo1}>Neo</Text>
        <Text style={estiloForm.tituloLogo2}>TaskEase</Text>
      </Text>
      <Text style={[estiloForm.p1, { marginBottom: 20 }]}>
        Digite o nome da tarefa:
      </Text>
      <TextInput
        style={estiloForm.input}
        placeholder="Nome da Tarefa"
        placeholderTextColor="#888"
        value={nomeTarefa}
        onChangeText={setNomeTarefa}
      />
      <Text style={[estiloForm.p1, { marginBottom: 20 }]}>
        Selecione a categoria:
      </Text>

      <Picker
        selectedValue={categoriaSelecionada}
        style={[estiloHome.picker, { width: "100%", marginBottom: 20 }]}
        onValueChange={(itemValue) => setCategoriaSelecionada(itemValue)}
        prompt="Selecione a categoria"
      >
        <Picker.Item label="Selecione uma categoria" value="" />
        {categorias.map((categoria) => (
          <Picker.Item
            key={categoria.id}
            label={categoria.nome}
            value={categoria.id}
          />
        ))}
      </Picker>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <TouchableOpacity
            style={[estiloForm.botaoCadastro, { marginTop: 20 }]}
            onPress={handleCriarTarefa}
          >
            <Text style={estiloForm.botaoText}>Criar Tarefa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={estiloForm.botaoRetornar}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={estiloForm.botaoText}>Retornar</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
