import React from 'react'
import {TouchableOpacity, Text, View, Image, StyleSheet, Dimensions} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import {ScrollView} from 'react-native-gesture-handler';

const HomeScreen = () => {
  const navigation = useNavigation();
  
  return (
    <ScrollView style={style.scroll} vertical>
      <View style={style.contSub}>
        <Image style={style.contSubImage} source={require("../assets/logomia.png")} />
      </View>
      <Text style={style.contTitle}>Fundación MIA</Text>
      <Text style={style.contTitleSub}>Construyendo Futuro</Text>
      <TouchableOpacity onPress={() => navigation.navigate("login")} style={style.contBtn}>
        <Text style={style.contBtnText}>Ingresar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  scroll: {
    height: Dimensions.get("window").height,
    backgroundColor: "#FFF",
    marginTop: 20
  },
  contSub: {
    display: "flex",
    justifyContent: "center",
    margin: 10,
    marginTop: 50
  },
  contSubImage: {
    margin: 8,
    resizeMode: "center",
    alignSelf: "center",
    height: 350,
    width: 340
  },
  contTitle: {
    alignSelf: 'center',
    marginTop: 70,
    color: '#1B1E37',
    fontSize: 25
  },
  contTitleSub: {
    alignSelf: 'center',
    marginTop: 20,
    color: '#1B1E37',
    fontSize: 25
  },
  contBtn: {
    backgroundColor: "#3296F3",
    padding: 10,
    marginTop: 90,
    marginBottom: 50,
    width: 250,
    alignSelf: "center",
    borderRadius: 15,
    borderColor: "#CDD1E2",
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9
  },
  contBtnText: {
    fontSize: 25,
    textAlign: "center",
    color: "white"
  }
});

export default HomeScreen