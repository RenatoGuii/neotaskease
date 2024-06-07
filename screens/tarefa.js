import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { collection, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../src/services/firebaseConnection";
import { Picker } from "@react-native-picker/picker";
import { useRoute } from "@react-navigation/native";

import estiloForm from "../styles/AuthenticatonStyleForms";
import estiloHome from "../styles/HomeStyle";

export default function TarefaScreen({ navigation }) {
  const route = useRoute();
  const { tarefa } = route.params;
  const [nomeTarefa, setNomeTarefa] = useState(tarefa.nome);
  const [statusAtual, setStatusAtual] = useState(tarefa.status);
  const [statusSelecionado, setStatusSelecionado] = useState(tarefa.status);
  const [isLoading, setIsLoading] = useState(false);

  const handleAtualizarStatus = async () => {
    if (statusSelecionado === statusAtual) {
      Alert.alert("Status não foi alterado.");
      return;
    }

    setIsLoading(true);
    try {
      await updateDoc(doc(db, "tarefas", tarefa.id), {
        status: statusSelecionado,
      });
      setStatusAtual(statusSelecionado);
      Alert.alert("✅ Sucesso", "Status atualizado com sucesso!");
      navigation.navigate("Home");
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      Alert.alert("❌ Erro", "Houve um erro ao atualizar o status da tarefa.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExcluirTarefa = async () => {
    Alert.alert(
      "Confirmação",
      "Tem certeza de que deseja excluir esta tarefa?",
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
              await deleteDoc(doc(db, "tarefas", tarefa.id));
              Alert.alert("✅ Sucesso", "Tarefa excluída com sucesso!");
              navigation.navigate("Home");
            } catch (error) {
              console.error("Erro ao excluir tarefa:", error);
              Alert.alert("❌ Erro", "Houve um erro ao excluir a tarefa.");
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={estiloForm.container}>
      <Text style={estiloForm.tituloLogo}>
        <Text style={estiloForm.tituloLogo1}>Neo</Text>
        <Text style={estiloForm.tituloLogo2}>TaskEase</Text>
      </Text>

      <Text style={[estiloForm.nomeTarefa, { marginBottom: 30 }]}>
        {nomeTarefa}
      </Text>

      <Text style={[estiloForm.p1, { marginBottom: 20 }]}>Status:</Text>

      <Picker
        selectedValue={statusSelecionado}
        style={[estiloHome.picker, { width: "100%", marginBottom: 20 }]}
        onValueChange={(itemValue) => setStatusSelecionado(itemValue)}
        prompt="Selecione o status"
      >
        <Picker.Item label="Criado" value="CRIADO" />
        <Picker.Item label="Iniciado" value="INICIADO" />
        <Picker.Item label="Concluido" value="CONCLUIDO" />
      </Picker>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <TouchableOpacity
            style={[
              estiloForm.botaoCadastro,
              {
                marginTop: 20,
                opacity: statusSelecionado !== statusAtual ? 1 : 0.5,
              },
            ]}
            onPress={handleAtualizarStatus}
            disabled={statusSelecionado === statusAtual}
          >
            <Text style={estiloForm.botaoText}>Atualizar Status</Text>
          </TouchableOpacity>

          <View style={estiloForm.grupoBotoes}>
            <TouchableOpacity
              style={[
                estiloForm.botaoRetornar,
                { width: "60%", marginRight: 20 },
              ]}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={estiloForm.botaoText}>Retornar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[estiloForm.botaoExcluir, { width: "35%" }]}
              onPress={handleExcluirTarefa}
            >
              <Text style={estiloForm.botaoText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
