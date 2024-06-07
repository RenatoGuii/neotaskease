import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  StyleSheet,
  BackHandler,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { db, auth } from "../src/services/firebaseConnection";
import { collection, query, getDocs, where } from "firebase/firestore";
import estiloHome from "../styles/HomeStyle";
import estiloForm from "../styles/AuthenticatonStyleForms";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ navigation }) {
  const [status, setStatus] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;
  const [isLoading, setIsLoading] = useState(false); // Novo estado para carregamento

  const getFirstName = (displayName) => {
    if (!displayName) return "";
    return displayName.split(" ")[0];
  };

  const carregarCategorias = async () => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
      setLoading(false);
    }
  };

  const carregarTarefas = async () => {
    setIsLoading(true);
    setLoading(true);
    try {
      if (!user) {
        Alert.alert("Usuário não autenticado!");
        return;
      }

      let tarefasRef = collection(db, "tarefas");
      const filtros = [];
      if (categoriaSelecionada)
        filtros.push(where("categoria", "==", categoriaSelecionada));
      if (status) filtros.push(where("status", "==", status));
      filtros.push(where("userId", "==", user.uid)); // Adiciona filtro pelo ID do usuário

      const tarefasQuery =
        filtros.length > 0 ? query(tarefasRef, ...filtros) : tarefasRef;
      const tarefasSnapshot = await getDocs(tarefasQuery);
      const tarefasList = tarefasSnapshot.docs.map((doc) => ({
        id: doc.id,
        nome: doc.data().nome,
        categoria: doc.data().categoria,
        status: doc.data().status,
        userId: doc.data().userId,
      }));
      setTarefas(tarefasList);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarCategorias();
    carregarTarefas();
  }, [status, categoriaSelecionada]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      carregarCategorias();
      carregarTarefas();
    });

    return unsubscribe;
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      setCategoriaSelecionada("");
      setStatus("");
      carregarCategorias();
      carregarTarefas();
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          "Confirmar saída",
          "Você realmente deseja sair do aplicativo?",
          [
            {
              text: "Cancelar",
              style: "cancel",
            },
            {
              text: "Sair",
              onPress: () => BackHandler.exitApp(),
            },
          ],
          { cancelable: false }
        );
        return true; // Impede o comportamento padrão de voltar
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  const handleLogout = async () => {
    await signOut(auth);
    await AsyncStorage.removeItem("userId");
    navigation.navigate("Login");
  };

  const renderizarCardTarefa = ({ item }) => {
    let statusColor = "black"; // Cor padrão

    // Verifica o status da tarefa e define a cor correspondente
    switch (item.status) {
      case "CRIADO":
        statusColor = "green";
        break;
      case "INICIADO":
        statusColor = "orange";
        break;
      case "CONCLUIDO":
        statusColor = "red";
        break;
      default:
        break;
    }

    const categoria = categorias.find((cat) => cat.id === item.categoria);
    const nomeCategoria = categoria
      ? categoria.nome
      : "Categoria não encontrada";

    const navegarDetalhesTarefa = (tarefa) => {
      navigation.navigate("Tarefa", { tarefa: tarefa });
    };

    return (
      <TouchableOpacity
        style={estiloHome.cardTarefa}
        onPress={() => navegarDetalhesTarefa(item)}
      >
        <Text style={estiloHome.cardNome}>{item.nome}</Text>
        <Text style={estiloHome.cardCategoria}>{nomeCategoria}</Text>
        <Text style={[estiloHome.cardStatus, { backgroundColor: statusColor }]}>
          {item.status}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[estiloHome.mainContainer]}>
      <View style={estiloHome.header}>
        <Text>
          <Text style={estiloForm.tituloLogo1}>Neo</Text>
          <Text style={estiloForm.tituloLogo2}>TaskEase</Text>
        </Text>
        <TouchableOpacity
          onPress={() => {
            Alert.alert("Confirmar Saída", "Tem certeza de que deseja sair?", [
              {
                text: "Cancelar",
                style: "cancel",
              },
              {
                text: "Confirmar",
                onPress: handleLogout,
              },
            ]);
          }}
        >
          <Ionicons name="log-out-outline" size={30} color="white" />
        </TouchableOpacity>
      </View>

      <View style={estiloHome.content}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        )}
        <View style={estiloHome.filterContainer}>
          <Text style={estiloHome.sectionTitle}>
            Lista de Tarefas de{" "}
            <Text
              style={{
                color: "yellow",
              }}
            >
              {getFirstName(user.displayName)}
            </Text>
          </Text>
          <View style={estiloHome.filtersGroup}>
            <View style={estiloHome.filterGroup}>
              <Text style={estiloHome.filterItem}>Categoria:</Text>
              <Picker
                selectedValue={categoriaSelecionada}
                style={estiloHome.picker}
                onValueChange={(itemValue, itemIndex) =>
                  setCategoriaSelecionada(itemValue)
                }
              >
                <Picker.Item label="Todos" value="" />
                {categorias.map((categoria) => (
                  <Picker.Item
                    key={categoria.id}
                    label={categoria.nome}
                    value={categoria.id}
                  />
                ))}
              </Picker>
            </View>

            <View style={estiloHome.filterGroup}>
              <Text style={estiloHome.filterItem}>Status:</Text>
              <Picker
                selectedValue={status}
                style={estiloHome.picker}
                onValueChange={(itemValue, itemIndex) => setStatus(itemValue)}
              >
                <Picker.Item label="Todos" value="" />
                <Picker.Item label="Criado" value="CRIADO" />
                <Picker.Item label="Iniciado" value="INICIADO" />
                <Picker.Item label="Concluido" value="CONCLUIDO" />
              </Picker>
            </View>
          </View>
        </View>

        {tarefas.length === 0 ? (
          <View style={estiloHome.noTasksContainer}>
            <Ionicons name="sad-outline" size={80} color="white" />
            <Text style={estiloHome.noTasksText}>
              Nenhuma tarefa encontrada
            </Text>
          </View>
        ) : (
          <FlatList
            data={tarefas}
            renderItem={renderizarCardTarefa}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 10,
            }}
            columnWrapperStyle={{
              justifyContent: "center",
            }}
          />
        )}
      </View>

      <View style={estiloHome.footer}>
        <TouchableOpacity
          style={[
            estiloHome.footerButton,
            { borderRightWidth: 1, borderRightColor: "white" },
          ]}
          onPress={() => navigation.navigate("CriarTarefa")}
        >
          <Text style={estiloHome.footerButtonText}>Criar Tarefa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            estiloHome.footerButton,
            { borderLeftWidth: 1, borderLeftColor: "white" },
          ]}
          onPress={() => navigation.navigate("ListaCat")}
        >
          <Text style={estiloHome.footerButtonText}>Categorias</Text>
        </TouchableOpacity>
      </View>
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
