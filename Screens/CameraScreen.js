import axios from "axios";
import React, {useState, useEffect, useRef} from "react";
import {Text, View, TouchableOpacity, Image, Modal, Pressable, StyleSheet, ScrollView} from "react-native";
import {Camera} from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useNavigation, useIsFocused} from "@react-navigation/native";

import Loading from "../Components/Loading";
import env from '../env.json';

export default function CameraScreen({route}) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  
  const [modalVisible, setModalVisible] = useState(false);
  const refCamera = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [img, setImg] = useState(null);
  const [showLoading, setShowLoading] = useState(false);
  const [showCammera, setShowCammera] = useState(true);
  const [access, setAccess] = useState(null);
  const [color, setColor] = useState(null);
  const [url, setUrl] = useState("");
  const [prefixMensaje, setPrefixMesaje] = useState("");
  const [reqType, setReqType] = useState("");
  const [rol, setRol] = useState("");
  
  const takePhoto = async () => {
    try {
      const benefitType = getBenefitType();
      const photo = await refCamera.current.takePictureAsync({base64: true, exif: true});
      photo.exif.Orientation = 1;
      
      setImg(photo);
      setShowCammera(false);
      setShowLoading(true);
  
      await submit({
        userId: await AsyncStorage.getItem("id"),
        benefitTypeName: String(benefitType),
        studentNid: String(route.params.document),
        photoB64: photo.base64,
        reqType
      });
      
    } catch (e) {
      setColor(style.colorRojo);
      setModalVisible(true);
      setAccess(`Error con la camara`);
    }
  };
  
  const submit = async data => {
    try {
      if(rol === "ROLE_DOCENTE" && data.benefitTypeName === "FUERA DE RANGO") {
        setColor(style.colorRojo);
        setModalVisible(true);
        setAccess(`Fuera del horario`);
      } else {
        await axios.post(url, data);
        setColor(style.colorVerde);
        setModalVisible(true);
        setAccess(`${prefixMensaje} exitoso`);
      }
    } catch (e) {
      setColor(style.colorRojo);
      setModalVisible(true);
      setAccess(`${prefixMensaje} fallo`);
    }
  };
  
  const resetFunctions = async () => {
    setImg(null);
    setShowCammera(true);
    setShowLoading(false);
    setModalVisible(false);
    if(rol !== "ROLE_DOCENTE") navigation.navigate("document");
  };
  
  const getBenefitType = () => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    if(hours > 6 && hours < 10) return "COMPLEMENTO_AM";
    else if(hours >= 10 && hours < 14) {
      if (hours === 10 && minutes < 30) return "FUERA DE RANGO";
      else return "ALMUERZO";
    } else if(hours >= 14 && hours <= 17) {
      if(hours === 17 && minutes > 30) return "FUERA DE RANGO";
      else return "COMPLEMENTO_PM";
    } else return "FUERA DE RANGO";
  }
  
  useEffect(() => {
    (async () => {
      const {status} = await Camera.requestCameraPermissionsAsync();
      const rol = await AsyncStorage.getItem("rol");
      setRol(rol);
      setUrl(rol === "ROLE_DOCENTE" ? `${env.HOST}/recognition` : `${env.HOST}/recognition/save-student-image`);
      setPrefixMesaje(rol === "ROLE_DOCENTE" ? "Reconocimiento" : "Registro");
      setHasPermission(status === "granted");
    })();
  }, [isFocused]);
  
  return (
    <ScrollView style={style.scroll} vertical>
      {
        (hasPermission == null && hasPermission === false) ?
          <Text>No access to camera</Text> :
          <View>
            {showCammera && (
              <View>
                <Camera style={style.camera} type={type} ref={refCamera}>
                  <View style={style.buttonContainer}>
                    <TouchableOpacity
                      style={style.btnPositionCamera}
                      onPress={() => {
                        setType(
                          type === Camera.Constants.Type.back
                            ? Camera.Constants.Type.front
                            : Camera.Constants.Type.back
                        );
                      }}
                    >
                      <Text style={style.text}> Cambiar camara </Text>
                    </TouchableOpacity>
                  </View>
                </Camera>
              </View>
            )}
    
            {!showCammera && img && (
              <Image
                source={{uri: `data:image/jpeg;base64,${img.base64}`}}
                style={style.camera}
              />
            )}
  
            {rol === "ROLE_DOCENTE" ?
              (
                <View style={style.btnCont}>
                  <TouchableOpacity onPress={() => {
                    setReqType("recognition");
                    takePhoto().then()
                  }} style={style.btn}>
                    <Text style={style.btnText}>{prefixMensaje}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    setReqType("reassignment");
                    takePhoto().then();
                  }} style={style.btn}>
                    <Text style={style.btnText}>Reasignación</Text>
                  </TouchableOpacity>
                </View>
              ) :
              (
                <TouchableOpacity onPress={takePhoto} style={style.btn}>
                  <Text style={style.btnText}>{prefixMensaje}</Text>
                </TouchableOpacity>
              )
            }
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => { setModalVisible(!modalVisible); }}
            >
              <View style={style.centeredView}>
                <View style={[style.modalView, color]}>
                  <Text style={style.modalText}> {access} </Text>
          
                  <Pressable
                    style={[style.button, style.buttonClose]}
                    onPress={() => resetFunctions()}
                  >
                    <Text style={style.textStyle}> VOLVER </Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
            {showLoading && <Loading/>}
          </View>
      }
    </ScrollView>
  );
}

const style = StyleSheet.create({
  camera: {
    alignSelf: "center",
    marginTop: 60,
    height: 500,
    width: 350,
  },
  cameraMask: {
    alignSelf: "center",
    marginTop: 60,
    height: 500,
    width: 350,
    position: "absolute",
    opacity: 1,
    borderColor: "#000",
    borderTopWidth: 50,
    borderRightWidth: 50,
    borderLeftWidth: 50,
    borderBottomWidth: 50,
    overflow: "hidden"
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
  },
  btnPositionCamera: {
    flex: 2,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 15,
    color: "white",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 50,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 15,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "green",
  },
  buttonClose: {
    backgroundColor: "#FFF",
  },
  textStyle: {
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    color: "white",
  },
  colorRojo: {
    backgroundColor: "red",
  },
  colorVerde: {
    backgroundColor: "green",
  },
  btnCont: {
    flexDirection: "row",
    alignItems: "stretch"
  },
  btn: {
    backgroundColor: "#3296F3",
    padding: 10,
    marginTop: 40,
    width: 200,
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
  btnText: {
    fontSize: 25,
    textAlign: "center",
    color: "white"
  }
});
