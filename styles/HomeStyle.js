import { StyleSheet } from "react-native";

const estiloHome = StyleSheet.create({
  mainContainer: {
    paddingTop: 50,
    backgroundColor: "#22264B",
    height: "100%",
  },
  deslogar: {
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#22264B",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    borderColor: "white",
    borderTopWidth: 2,
    backgroundColor: "#393C73",
    flex: 1,
  },
  sectionTitle: {
    textAlign: "center",
    fontSize: 23,
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
    paddingTop: 15,
  },
  searchInput: {
    fontSize: 16,
  },
  filtersGroup: {
    flexDirection: "row",
    justifyContent: "center",
  },
  filterItem: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    marginHorizontal: 5,
    marginBottom: 5,
  },
  picker: {
    color: "gray",
    width: 180,
    height: 50,
    backgroundColor: "white",
    marginHorizontal: 5,
  },
  filterContainer: {
    flexDirection: "collumn",
    justifyContent: "center",
    paddingBottom: 25,
    borderBottomWidth: 3,
    borderBottomColor: "white",
    backgroundColor: "#22264B",
  },
  taskList: {
    backgroundColor: "white",
    height: 542,
    marginHorizontal: 0,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 2,
    borderTopColor: "white",
    backgroundColor: "#f0f0f0",
    height: 85,
  },
  footerButton: {
    display: "flex",
    width: "50%",
    height: "100%",
    backgroundColor: "#22264B",
    justifyContent: "center",
  },
  footerButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    alignItems: "center",
  },
  cardTarefa: {
    backgroundColor: "#22264B",
    margin: 20,
    width: 180,
    height: 160,
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
    justifyContent: "space-between",
  },
  cardNome: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    paddingTop: 10,
    paddingHorizontal: 3,
  },
  cardStatus: {
    color: "white",
    padding: 11,
    borderRadius: 15,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardCategoria: {
    color: "white",
    fontWeight: "bold",
  },
  noTasksContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noTasksText: {
    fontSize: 25,
    color: "white",
    marginTop: 10,
    textAlign: "center",
  },
});

export default estiloHome;
