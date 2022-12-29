import React, {useState, useEffect} from "react";
import {StyleSheet, Text, TouchableOpacity, Image, TextInput, ScrollView, Dimensions, View} from "react-native";
import {useNavigation, useIsFocused} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import env from '../env.json';

export default function App() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  
  const [error, setError] = useState("");
  const [document, setDocument] = useState("");
  
  const handlePressTouch = async () => {
    const rol = await AsyncStorage.getItem('rol');
    if (document && document !== "" && env.ALLOWED_ROLES.indexOf(rol) >= 0) {
      setError("");
      navigation.navigate("camera", {document});
    } else setError("Todos los campos son obligatorios");
  };
  
  useEffect(() => {
    (async () => {
      setDocument("");
    })();
  }, [isFocused]);
  
  return (
    <ScrollView style={style.scroll} vertical>
      <Image style={style.logo} source={require("../assets/logomia.png")}/>
      <View style={style.form}>
        <Text style={style.inputName}>Documento</Text>
        <TextInput
          style={style.input}
          placeholder="Documento"
          value={document}
          onChangeText={setDocument}
          keyboardType="numeric"
        />
        <View style={style.separator}/>
        {error.length > 0 && <Text style={style.textErr}>{error}</Text>}
        <TouchableOpacity onPress={handlePressTouch} style={style.btn}>
          <Text style={style.btnText}>Tomar fotografía</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  scroll: {
    height: Dimensions.get("window").height,
    backgroundColor: "#FFF",
    marginTop: 20
  },
  logo: {
    resizeMode: "center",
    alignSelf: "center",
    height: 300,
    width: 300,
    padding: 10
  },
  form: {
    marginTop: 40,
    paddingLeft: 10,
    paddingRight: 10
  },
  inputName: {
    color: "black",
    fontSize: 18,
    marginBottom: 5,
    fontWeight: 'bold'
  },
  input: {
    fontSize: 18,
    height: 40,
    color: "black",
    borderBottomColor: "#000",
    borderBottomWidth: 1
  },
  separator: {
    height: 60
  },
  btn: {
    backgroundColor: "#3296F3",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 10,
    width: 240,
    height: 55,
    shadowColor: "#000",
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
    marginBottom: 20
  },
  btnText: {
    fontSize: 25,
    textAlign: "center",
    color: "white",
  },
  textErr: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20
  }
});
