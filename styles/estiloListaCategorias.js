import { StyleSheet } from "react-native";

const estiloListaCategorias = StyleSheet.create({
  container: {
    paddingTop: 60,
    flex: 1,
    padding: 20,
    backgroundColor: "#22264B",
  },
  voltarIcone: {
    color: "white",
    fontSize: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 3,
    borderBottomColor: "white",
    marginBottom: 20,
  },
  titulo: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  adicionarIcone: {
    color: "white",
    fontSize: 30,
    backgroundColor: "green",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  listaContainer: {
    flexGrow: 1,
  },
  itemCategoria: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  nomeCategoria: {
    fontSize: 22,
    color: "white",
  },
  listaVazia: {
    fontSize: 23,
    textAlign: "center",
    marginTop: 20,
    color: "white",
    fontWeight: "bold",
  },
});

export default estiloListaCategorias;
