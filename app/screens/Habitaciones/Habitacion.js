import React, { useState, useEffect, useCallback, useRef } from "react";
import { StyleSheet, Text, View, ScrollView, Dimensions, TextInput, Linking } from "react-native";
import { map } from "lodash";
import { Rating, ListItem, Icon, Button } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";
import Carousel from "../../components/Carousel";
import Map from "../../components/Map";
import ListReviews from "../../screens/Habitaciones/ListReviews";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);
const screenWidth = Dimensions.get("window").width;

export default function Habitacion(props) {
    const { navigation, route } = props;
    const { id, name } = route.params;
    const [habitacion, setHabitacion] = useState(null);
    const [rating, setRating] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [userLoger, setUserLoger] = useState(false);
    const toasRef = useRef();

    navigation.setOptions({title: name});

    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLoger(true) : setUserLoger(false);
    });

    useFocusEffect(

        useCallback(() => {
            db.collection("habitacion").doc(id).get().then((response) => {
                const data = response.data();
                data.id = response.id;
                setHabitacion(data);
                setRating(data.rating);
            })
        }, [])

    );

    useEffect(() => {
        if (userLoger && habitacion) {
            db.collection("favorites").where("idHabitacion", "==", habitacion.id)
            .where("idUser", "==", firebase.auth().currentUser.uid)
            .get().then((response) => {
                if(response.docs.length === 1){
                    setIsFavorite(true);
                }
            });
        }
    }, [userLoger, habitacion])

    const addFavorite = () => {
        if (!userLoger) {
            toasRef.current.show("Para usar el sistema de favoritos es necesario estar logeado");
        } else {
            const payload = {
                idUser: firebase.auth().currentUser.uid,
                idHabitacion: habitacion.id,
            }
            db.collection("favorites").add(payload).then(() => {
                setIsFavorite(true);
                toasRef.current.show("Habitación añadida a favoritas");
            }).catch(() => {
                toasRef.current.show("Error al añadir habitación a favoritas");
            });
        }
    };

    const removeFavorite = () => {
        db.collection("favorites")
        .where("idHabitacion", "==", habitacion.id)
        .where("idUser", "==", firebase.auth().currentUser.uid)
        .get()
        .then((response) => {
            response.forEach((doc) => {
                const idFavorite = doc.id;
                db.collection("favorites")
                .doc(idFavorite)
                .delete()
                .then(() => {
                    setIsFavorite(false);
                    toasRef.current.show("Habitación eliminada de favoritos");
                })
                .catch(() => {
                    toasRef.current.show("Error al eliminar la habitación de favoritos");
                });
            });
        });
    };

    if (!habitacion) return <Loading isVisible={true} text="Cargando..."/>;

    return (
        <ScrollView vertical style={styles.viewBody}>
            <View style={styles.viewFovorite}>
                <Icon 
                    type="material-community"
                    name={isFavorite ? "heart" : "heart-outline"}
                    onPress={isFavorite ? removeFavorite : addFavorite}
                    color={isFavorite ? "#f00" : "#000"}
                    size={35}
                    underlayColor="transparent"
                />
            </View>
            <Carousel 
                arrayImages={habitacion.images}
                height={250}
                width={screenWidth}
            />
            <TitleHabitacion
                name={habitacion.name}
                description={habitacion.description}
                rating={rating}
            />
            <WhatsApp/>
            <HabitacionInfo 
                location={habitacion.location}
                name={habitacion.name}
                address={habitacion.address}
            />
            <ListReviews
                navigation={navigation}
                idHabitacion={habitacion.id}
            />
            <Toast ref={toasRef} position="center" opacity={0.9} />
        </ScrollView>
    )
}

function WhatsApp() {
    return(
        <View centerContent={true} >
            <Button 
                buttonStyle={styles.btnWhat}
                title="Reservar habitación"
                icon={{
                    type: "material-community",
                    name: "whatsapp",
                    color: "#fff"
                }}
                onPress={this.openWhatsApp}
            />
        </View>
    );

}

openWhatsApp = () => {
    Linking.openURL('https://wa.me/qr/PZ4IU6AVWJTIO1');
}

function TitleHabitacion(props) {
    const { name, description, rating } = props;

    return (
        <View style={styles.viewHabitacionTitle}>
            <View style={{flexDirection: "row"}}>
                <Text style={styles.nameHabitacion}>{name}</Text>
                <Rating
                    style={styles.rating}
                    imageSize={20}
                    readonly
                    startingValue={parseFloat(rating)}
                />
            </View>
            <Text style={styles.descriptionHabitacion}>
                {description}
            </Text>
            
        </View>
    );
    
}

function HabitacionInfo(props){
    const { location, name, address } = props;
    const listInfo = [
        {
            text: address,
            iconName: "map-marker",
            iconType: "material-community",
            action: null,
        },
        {
            text: "(+52) 951 132 68 23",
            iconName: "phone",
            iconType: "material-community",
            action: null,
        },
        {
            text: "Casa Curtiduría",
            iconName: "facebook",
            iconType: "material-community",
            action: null,
        },
        {
            text: "casacurtiduria@gmail.com",
            iconName: "at",
            iconType: "material-community",
            action: null,
        },
    ]


        return(
            <View style={styles.viewHabitacionInfo}>
                <Text style={styles.habitacionInfoTitle}>Información sobre la habitación</Text>
                <Map location={location} name={name} height={100} />
                {map(listInfo, (item, index) => (
                    <ListItem
                        key={index}
                        title={item.text}
                        leftIcon={{
                            name: item.iconName,
                            type: item.iconType,
                            color: "#4093c9",
                        }}
                        containerStyle={styles.containerListItem}
                    />
                ))}
            </View>
        );
}

const styles = StyleSheet.create({
    viewBody:{
        flex: 1,
        backgroundColor: "#fff",
    },
    viewHabitacionTitle: {
        padding: 15,
    },
    nameHabitacion:{
        fontSize: 20,
        fontWeight: "bold",
    },
    descriptionHabitacion:{
        marginTop: 5,
        color: "grey",
    },
    rating:{
        position: "absolute",
        right: 0,
    },
    viewHabitacionInfo: {
        margin: 15,
        marginTop: 25,
    },
    habitacionInfoTitle:{
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    containerListItem:{
        borderBottomColor: "#4093c9",
        borderBottomWidth: 1,
    },
    viewFovorite:{
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 2,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 100,
        padding: 5,
        paddingLeft: 15,
    },
    btnWhat: {
        marginRight: 10,
        marginLeft: 60,
        backgroundColor: "#4093c9",
        width: "70%",
    },
});
