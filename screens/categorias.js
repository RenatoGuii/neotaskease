import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import {
  collection,
  query,
  getDocs,
  doc,
  deleteDoc,
  where,
} from "firebase/firestore";
import { db, auth } from "../src/services/firebaseConnection";
import { FontAwesome5 } from "@expo/vector-icons";
import estiloListaCategorias from "../styles/estiloListaCategorias";
import estiloCadastro from "../styles/AuthenticatonStyleForms";

export default function ListaCategoriasScreen({ navigation }) {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Usuário não autenticado!");
        return;
      }

      const categoriasQuery = query(
        collection(db, "categorias"),
        where("userId", "==", user.uid) // Filtra categorias pelo ID do usuário
      );

      const categoriasSnapshot = await getDocs(categoriasQuery);
      const categoriasList = categoriasSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategorias(categoriasList);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  const handleExcluirCategoria = async (categoriaId, categoriaNome) => {
    Alert.alert(
      "Excluir Categoria",
      `Tem certeza de que deseja excluir a categoria "${categoriaNome}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "categorias", categoriaId));
              await carregarCategorias();
              Alert.alert(
                "Sucesso ✅",
                `Categoria "${categoriaNome}" excluída com sucesso.`
              );
            } catch (error) {
              console.error("Erro ao excluir categoria:", error);
              Alert.alert(
                "Erro",
                "Houve um erro ao excluir a categoria. Por favor, tente novamente mais tarde."
              );
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
        <Text style={[estiloCadastro.tituloLogo1, { fontSize: 40 }]}>Neo</Text>
        <Text style={[estiloCadastro.tituloLogo2, { fontSize: 40 }]}>
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
        {categorias.length > 0 ? (
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
