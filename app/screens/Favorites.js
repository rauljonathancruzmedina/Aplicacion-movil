import React, { useState, useRef, useCallback } from "react";
import  { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { Image, Icon, Button } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-easy-toast";
import Loading from "../components/Loading";

import { firebaseApp } from "../utils/firebase";
import firebase from "firebase";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function Favorites(props){
    const { navigation } = props;
    const [habitacion, setHabitacion] = useState(null);
    const [userLoger, setUserLoger] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [reloadData, setReloadData] = useState(false);
    const toasRef = useRef();

    console.log(habitacion);
    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLoger(true) : setUserLoger(false);
    });

    useFocusEffect(
        useCallback(() => {
            if (userLoger) {
                const idUser = firebase.auth().currentUser.uid;
                db.collection("favorites")
                .where("idUser", "==", idUser)
                .get()
                .then((response) => {
                    const idHabitacionArray = [];
                    response.forEach((doc) => {
                        idHabitacionArray.push(doc.data().idHabitacion);
                    });
                    getDataHabitacion(idHabitacionArray).then((response) => {
                        const habitacion = [];
                        response.forEach((doc) => {
                            const habitacions = doc.data();
                            habitacions.id = doc.id;
                            habitacion.push(habitacions);
                        });
                        setHabitacion(habitacion);
                    });
                });
            }
            setReloadData(false);
        }, [userLoger, reloadData])
    );

    const getDataHabitacion = (idHabitacionArray) => {
        const arrayHabitacions = [];
        idHabitacionArray.forEach((idHabitacion) => {
            const result = db.collection("habitacion").doc(idHabitacion).get();
            arrayHabitacions.push(result);
        });
        return Promise.all(arrayHabitacions);
    };

    if (!userLoger) {
        return <UserNoLogged navigation={navigation}/>
    }
    
    if (habitacion?.length === 0 ) {
        return <NotFountHabitacion/>;
    }

    return (
        <View style={styles.viewBody}>
            {habitacion ? (
                <FlatList 
                    data={habitacion}
                    renderItem={(habitacions) => 
                        <Habitacions 
                            habitacions={habitacions} 
                            setIsLoading={setIsLoading} 
                            toasRef={toasRef} 
                            setReloadData={setReloadData}
                            navigation={navigation}
                        />}
                    keyExtractor={(item, index) => index.toString()}
                />
            ) : (
                <View style={styles.loaderHabitacion}>
                    <ActivityIndicator size="large" color={"#FF9200"} />
                    <Text style={{ textAlign: "center" }}>Cargando habitaciones</Text>
                </View>
            )}
            <Toast ref={toasRef} position="center" opacity={0.9} />
            <Loading text="Eliminando habitación" isVisible={isLoading} />
        </View>
    );
}

function NotFountHabitacion(params) {
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Icon type="material-community" name="alert-outline" size={50} />
            <Text style={{fontSize: 20, fontWeight: "bold"}}>
                No tienes habitaciones favoritas
            </Text>
        </View>
    );
}

function UserNoLogged(props) {
    const { navigation } = props;
    return(
        <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
            <Icon 
                type="material-community"
                name="alert-outline"
                size={50}
            /> 
            <Text style={{fontSize: 20, fontWeight: "bold", textAlign: "center"}}>
                Necesitas estar logeado para ver esta sección
            </Text>
            <Button
                title="Ir al login"
                containerStyle={{marginTop: 20, width: "80%"}}
                buttonStyle={{backgroundColor:"#4093c9", borderRadius: 35}}
                onPress={() => navigation.navigate("account", {screen: "login"})}
            />
        </View>
    );
}

function Habitacions(props) {
   const { habitacions, setIsLoading, toasRef, setReloadData, navigation } = props;
   const { id, name, images } = habitacions.item;

   const confirmRemoveFavorite = () => {
        Alert.alert(
            "Eliminar habitación favorita",
            "¿Estas seguro de eliminar la habitació de tus favoritas?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: removeFavorite,
                }
            ], 
            { cancelable: false }
        );
   };

   const removeFavorite = () => {
       setIsLoading(true);
        db.collection("favorites")
        .where("idHabitacion", "==", id)
        .where("idUser", "==", firebase.auth().currentUser.uid)
        .get()
        .then((response) => {
            response.forEach((doc) => {
                const idFavorite = doc.id;
                db.collection("favorites")
                .doc(idFavorite)
                .delete()
                .then(() => {
                    setIsLoading(false);
                    setReloadData(true);
                    toasRef.current.show("Habitación eliminada correctamente");
                }).catch(() => {
                    setIsLoading(false);
                    toasRef.current.show("Error al eliminar la habitación");
                })
            });
        })
   }

    return(
        <View style={styles.habitaciones}>
            <TouchableOpacity onPress={() => navigation.navigate("Restaurants", {screen: "habitacion", params: { id }})}>
                <Image
                    resizeMode="cover"
                    style={styles.image}
                    PlaceholderContent={<ActivityIndicator color="#4093c9"/>}
                    source={
                        images[0] ? {uri: images[0]}
                        : require("../../assets/img/no-image.png")
                    }
                />
                <View style={styles.info}>
                    <Text style={styles.name}>{name}</Text>
                    <Icon 
                        type="material-community"
                        name="heart"
                        color="#f00"
                        containerStyle={styles.favorites}
                        onPress={confirmRemoveFavorite}
                        underlayColor="transparent"
                    />
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    viewBody:{
        flex: 1,
        backgroundColor: "#f2f2f2",
    },
    loaderHabitacion: {
        marginTop: 10,
        marginBottom: 10,
    },
    habitaciones: {
        margin: 10,
    },
    image:{
        width: "100%",
        height: 180,
    },
    info: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: -30,
        backgroundColor: "#FF9200"
    },
    name: {
        fontWeight: "bold",
        fontSize: 30,
    },
    favorites:{
        marginTop: -30,
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 100,
    },
});