import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  collection,
  query,
  getDocs,
  doc,
  deleteDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db, auth } from "../src/services/firebaseConnection";
import { FontAwesome5 } from "@expo/vector-icons";
import estiloListaCategorias from "../styles/estiloListaCategorias";
import estiloForms from "../styles/AuthenticatonStyleForms";

export default function ListaCategoriasScreen({ navigation }) {
  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Usuário não autenticado!");
        return;
      }

      const categoriasQuery = query(
        collection(db, "categorias"),
        where("userId", "==", user.uid)
      );

      const categoriasSnapshot = await getDocs(categoriasQuery);
      const categoriasList = categoriasSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategorias(categoriasList);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExcluirCategoria = async (categoriaId, categoriaNome) => {
    Alert.alert(
      "Excluir Categoria",
      `Tem certeza de que deseja excluir a categoria "${categoriaNome}" e todas as tarefas associadas?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: async () => {
            setIsLoading(true);
            try {
              const tarefasQuery = query(
                collection(db, "tarefas"),
                where("categoria", "==", categoriaId)
              );
              const tarefasSnapshot = await getDocs(tarefasQuery);

              const batch = writeBatch(db);

              tarefasSnapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
              });

              batch.delete(doc(db, "categorias", categoriaId));

              await batch.commit();
              await carregarCategorias();
              Alert.alert(
                "Sucesso ✅",
                `Categoria "${categoriaNome}" e todas as tarefas associadas foram excluídas com sucesso.`
              );
            } catch (error) {
              console.error("Erro ao excluir categoria e tarefas:", error);
              Alert.alert(
                "Erro",
                "Houve um erro ao excluir a categoria e suas tarefas. Por favor, tente novamente mais tarde."
              );
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const renderizarItemCategoria = ({ item }) => (
    <View style={estiloListaCategorias.itemCategoria}>
      <Text style={estiloListaCategorias.nomeCategoria}>{item.nome}</Text>
      <TouchableOpacity
        onPress={() => handleExcluirCategoria(item.id, item.nome)}
      >
        <FontAwesome5 name="trash-alt" size={20} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={estiloListaCategorias.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <FontAwesome5
          name="arrow-left"
          style={estiloListaCategorias.voltarIcone}
        />
      </TouchableOpacity>
      <View
        style={{
          marginBottom: 30,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Text style={[estiloForms.tituloLogo1, { fontSize: 40 }]}>Neo</Text>
        <Text style={[estiloForms.tituloLogo2, { fontSize: 40 }]}>
          TaskEase
        </Text>
      </View>
      <View style={estiloListaCategorias.header}>
        <Text style={estiloListaCategorias.titulo}>Categorias</Text>
        <TouchableOpacity onPress={() => navigation.navigate("CriarCategoria")}>
          <FontAwesome5
            name="plus"
            style={estiloListaCategorias.adicionarIcone}
          />
        </TouchableOpacity>
      </View>

      <View style={estiloListaCategorias.listaContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : categorias.length > 0 ? (
          <FlatList
            data={categorias}
            renderItem={renderizarItemCategoria}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <Text style={estiloListaCategorias.listaVazia}>
            Nenhuma categoria encontrada.
          </Text>
        )}
      </View>
    </View>
  );
}
