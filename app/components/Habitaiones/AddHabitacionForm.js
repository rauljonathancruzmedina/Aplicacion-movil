import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Alert, Dimensions } from "react-native";
import { Icon, Avatar, Image, Input, Button } from "react-native-elements";
import { map, size, filter, result } from "lodash";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import uuid from "random-uuid-v4";
import Modal from "../Modal";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

const widthScreen = Dimensions.get("window").width;

export default function AddHabitacionForm(props) {
    const { toastRef, setIsLoading, navigation } = props;
    const [habitacionName, setHabitacionName] = useState("");
    const [habitacionAdress, setHabitacionAdress] = useState("");
    const [habitacionDescriptions, setHabitacionDescriptions] = useState("");
    const [imageSelected, setImageSelected] = useState([]);
    const [isVisibleMap, setIsVisibleMap] = useState(false);
    const [locationHabitacion, setLocationHabitacion] = useState(null);

    const addHabitacion = () => {
        if (!habitacionName || !habitacionAdress || !habitacionDescriptions) {
            toastRef.current.show("Todos los campos del formulario son obligatorios");   
        } else if (size(imageSelected) === 0) {
            toastRef.current.show("La habitación debe tener almenos una foto");
        } else if (!locationHabitacion) {
            toastRef.current.show("tienes que localizar la habitación en la mapa");
        } else {
            setIsLoading(true);
            UploadImageStorage().then((response) => {

                db.collection("habitacion").add({
                    name: habitacionName,
                    address: habitacionAdress,
                    description: habitacionDescriptions,
                    location: locationHabitacion,
                    images: response,
                    rating: 0,
                    ratingTotal: 0,
                    quantityVoting: 0,
                    createAt: new Date(),
                    createBy: firebaseApp.auth().currentUser.uid,
                }).then(() => {
                    setIsLoading(false);
                    navigation.navigate("restaurans");
                }).catch(() => {
                    setIsLoading(false);
                    toastRef.current.show("Error al subir el restaurante, Intente más tarde");
                });

            });
        }
    }

    const UploadImageStorage = async () => {
        const imageBlob = [];

        await Promise.all(
            map(imageSelected, async (image) => {
                const response = await fetch(image);
                const blob = await response.blob();
                const ref = firebase.storage().ref("habitacion").child(uuid());
                await ref.put(blob).then(async (result) => {
                    await firebase.storage().ref(`habitacion/${result.metadata.name}`)
                    .getDownloadURL().then(photoUrl => {
                        imageBlob.push(photoUrl);
                    });
                });
            })
        );
        
        return imageBlob;

    }

    return(
        <ScrollView style={styles.scrollView}>
            <ImageHabitacion
                imageHabitacion={imageSelected[0]}
            />
             <FormAdd
                setHabitacionName={setHabitacionName}
                setHabitacionAdress={setHabitacionAdress}
                setHabitacionDescriptions={setHabitacionDescriptions}
                setIsVisibleMap={setIsVisibleMap}
                locationHabitacion={locationHabitacion}
             />
             <UploadImage 
                toastRef={toastRef} 
                imageSelected={imageSelected} 
                setImageSelected={setImageSelected}
            />
             <Button
                title="Crear habitación"
                onPress={addHabitacion}
                buttonStyle={styles.btnAddHabitacion}
             />
             <Map
                isVisibleMap={isVisibleMap}
                setIsVisibleMap={setIsVisibleMap}
                setLocationHabitacion={setLocationHabitacion}
                toastRef={toastRef}
             />
        </ScrollView>
    );
}

function ImageHabitacion (props){
    const { imageHabitacion } = props;
    
    return(
        <View style={styles.viewFoto}>
            <Image 
                source={ imageHabitacion ? {uri: imageHabitacion } : require("../../../assets/img/no-image.png") }
                style={{ width: widthScreen, height: 200 }}
            />
        </View>
    )

}

function FormAdd(props) {
    const { setHabitacionName, setHabitacionAdress, setHabitacionDescriptions, setIsVisibleMap, locationHabitacion } = props;
    return(
        <View style={styles.viewForm}>
            <Input
                placeholder="Nombre de la habitación"
                containerStyle={styles.input}
                onChange={(e) => setHabitacionName(e.nativeEvent.text)}
            />
            <Input
                placeholder="Dirección"
                containerStyle={styles.input}
                onChange={(e) => setHabitacionAdress(e.nativeEvent.text)}
                rightIcon={{
                    type: "material-community",
                    name: "google-maps",
                    color: locationHabitacion ? "#FF9200" : "#4093c9",
                    onPress: () => setIsVisibleMap(true),
                }}
            />
            <Input
                placeholder="Descripción habitación"
                multiline={true}
                inputContainerStyle={styles.textArea}
                onChange={(e) => setHabitacionDescriptions(e.nativeEvent.text)}
            />
        </View>
    );
}

function Map(props) {
    const { isVisibleMap, setIsVisibleMap, setLocationHabitacion, toastRef } = props;
    const [location, setLocation] = useState(null);
    
    useEffect(() => {
        (async() => {
            const resultPermissions = await Permissions.askAsync(
                Permissions.LOCATION
            );
            const statusPermissions = resultPermissions.permissions.location.status;
            
            if (statusPermissions !== "granted") {
                toastRef.current.show("Tienes que aceptar los permisos de localización para crear una habitación", 3000);
            } else {
                const loc = await Location.getCurrentPositionAsync({});
                setLocation({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001
                });
            }
        })()
    }, [])

    const confirmLocation = () => {
        setLocationHabitacion(location);
        toastRef.current.show("Localización guardada correctamente");
        setIsVisibleMap(false);
    }

    return(
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
            <View>
                {location && (
                    <MapView
                        style={styles.mapStyle}
                        initialRegion={location}
                        showsUserLocation={true}
                        onRegionChange={(region) => setLocation(region)}
                    >
                        <MapView.Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude
                            }}
                            draggable
                        />
                    </MapView>
                )}
                <View style={styles.viewMapBtn}>
                    <Button 
                        title="Guardar ubicación"
                        containerStyle={styles.viewMapBtnContainerSave}
                        buttonStyle={styles.viewMapBtnSave}
                        onPress={confirmLocation}
                    />
                    <Button 
                        title="Cancelar"
                        containerStyle={styles.viewMapBtnContainerCancelar}
                        buttonStyle={styles.viewMapBtnCancelar}
                        onPress={() => setIsVisibleMap(false)}
                    />
                </View>
            </View>
        </Modal>
    );

}

function UploadImage(props) {
    const { toastRef, imageSelected, setImageSelected } = props;
    
    const imageSelect = async () => {
        const resultPermissions = await Permissions.askAsync(
            Permissions.CAMERA_ROLL
        );
        
        if (resultPermissions === "denied") {
            toastRef.current.show("Es necesario aceptar los permisos de la galeria", 3000);        
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4,3],
            });
            if (result.cancelled) {
                toastRef.current.show("Has cerrado la galeria sin seleccionar una imagen" , 2000);
            } else {
                setImageSelected([...imageSelected, result.uri]);
            }
        }
    }

    const removeImage = (image) => {

        Alert.alert(
            "Eliminar imagen",
            "¿Estas seguro de eliminar la imagen.?",
            [
                {
                    text: "Cacelar",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: () => {
                        setImageSelected(
                            filter(imageSelected, (imageUrl) => imageUrl !== image )
                        );
                    },
                },
            ],
            { cancelable: false }
        );
    }

    return(
        <View style={styles.viewImage}> 
        {size(imageSelected) < 5 && (
            <Icon
                type="material-community"
                name="camera"
                color="#4093c9"
                size={40}
                containerStyle={styles.containerIcon}
                onPress={imageSelect}
            />
        )}
            
            {map(imageSelected, (imageHabitacion, index) => (
                <Avatar
                    key={index}
                    style={styles.miniatureStyle}
                    source={{uri: imageHabitacion}}
                    onPress={() => removeImage(imageHabitacion) }
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    scrollView:{
        height: "100%",
    },
    viewForm:{
        marginLeft: 10,
        marginRight: 10,
    },
    input:{
        marginBottom: 10,
    },
    textArea:{
        height: 100,
        width: "100%",
        padding: 0,
    },
    btnAddHabitacion:{
        backgroundColor:"#4093c9",
        margin: 20,
        borderRadius: 35,
    },
    viewImage:{
        flexDirection: "row",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30,
    },
    containerIcon:{
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: "#e3e3e3",
    },
    miniatureStyle:{
        width: 70,
        height: 70,
        marginRight: 10,
    },
    viewFoto:{
        alignItems: "center",
        height: 200,
        marginBottom: 20,
    },
    mapStyle:{
        width: "100%",
        height: 550,
    },
    viewMapBtn:{
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },
    viewMapBtnContainerCancelar:{
        paddingLeft: 5,
    },
    viewMapBtnCancelar:{
        backgroundColor: "#a60d0d",
    },
    viewMapBtnContainerSave:{
        paddingRight: 5,
    },
    viewMapBtnSave:{
        backgroundColor: "#00a680"
    },
});