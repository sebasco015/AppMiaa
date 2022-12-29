import axios from "axios";
import React, {useEffect, useState} from "react";
import {TextInput, TouchableOpacity, Text, StyleSheet, Dimensions, Image, View} from "react-native";
import {ScrollView} from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useNavigation, useIsFocused} from "@react-navigation/native";

import env from "../env.json";

function LoginScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  
  const handleSubmit = async () => {
    try {
      if(usernameOrEmail.length > 0 && password.length > 0) {
        setErr("");
        const resp = await axios.post(`${env.HOST}/auth/iniciarSesion`, {
          usernameOrEmail,
          password,
        });
        
        if (resp.status === 200 && env.ALLOWED_ROLES.indexOf(resp.data.unUsuario.roles[0].nombre) >= 0) {
          await AsyncStorage.setItem("token", resp.data.tokeDeAcceso);
          await AsyncStorage.setItem("id", String(resp.data.unUsuario.id));
          await AsyncStorage.setItem("rol", resp.data.unUsuario.roles[0].nombre);
          if (resp.data.unUsuario.roles[0].nombre === "ROLE_DOCENTE") navigation.navigate("camera", { document: "" });
          else navigation.navigate("document");
        } else setErr("Usuario no permitido");
      } else setErr("Todos los campos son obligatorios");
    } catch (e) {
      console.log(e);
      setErr("Usuario no permitido");
    }
  };
  
  useEffect(() => {
    (async () => {
      if(isFocused) {
        const storqageKeys = await AsyncStorage.getAllKeys();
        if (storqageKeys.length > 0) await AsyncStorage.clear();
        setErr("");
        setUsernameOrEmail("");
        setPassword("");
      }
    })();
  }, [isFocused]);
  
  return (
    <ScrollView contentContainerStyle={style.scroll} vertical>
      <Image style={style.logo} source={require("../assets/logomia.png")} />
      <Text style={style.greeting}>Bienvenido</Text>
      <View style={style.form}>
        <Text style={style.inputName}>Usuario</Text>
        <TextInput
          style={style.input}
          placeholder="Usuario"
          value={usernameOrEmail}
          onChangeText={setUsernameOrEmail}
        />
        <View style={style.separator}/>
        <Text style={style.inputName}>Contraseña</Text>
        <TextInput
          style={style.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <View style={style.separator}/>
        {err.length > 0 && <Text style={style.textError}>{err}</Text>}
        <TouchableOpacity style={style.btn} onPress={() => handleSubmit()}>
          <Text style={style.btnText}>Iniciar Sesión</Text>
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
    height: 200,
    width: 200,
    padding: 10
  },
  greeting: {
    color: "black",
    fontSize: 25,
    marginTop: 40,
    textAlign: "center",
    fontWeight: "bold",
  },
  form: {
    marginTop: 40,
    paddingLeft: 10,
    paddingRight: 10
  },
  inputName: {
    marginBottom: 5,
    color: "black",
    fontSize: 18,
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
  textError: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20
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
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center",
  },
});

export default LoginScreen;
