import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet ,View, Text} from "react-native"
import { Icon } from "react-native-elements";
import { useFocusEffect } from '@react-navigation/native';
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import ListHabitaciones from "../../components/Habitaiones/ListHabitaciones";

const db = firebase.firestore(firebaseApp);

export default function Habitaciones(props){
    const { navigation } = props;
    const [user, setUser] = useState(null);
    const [habitaciones, setHabitaciones] = useState([]);
    const [totalHabitaciones, seTotalHabitaciones] = useState(0);
    const [startHabitacion, setStartHabitacion] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const limitHabitacion = 10;

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            console.log(userInfo.email);
            if (userInfo.email === "raul.jona9@gmail.com") {
                setUser(userInfo);   
            }
        })
    }, []);

    useFocusEffect(
        useCallback(() => {
            db.collection("habitacion").get().then((snap) => {
                seTotalHabitaciones(snap.size)
            });
            const resultHabitaciones = [];
    
            db.collection("habitacion").orderBy("createAt", "desc")
            .limit(limitHabitacion).get().then((response) => {
                setStartHabitacion(response.docs[response.docs.length -1]);
    
                response.forEach((doc) => {
                    const infoHabitac = doc.data();
                    infoHabitac.id = doc.id;
                    resultHabitaciones.push(infoHabitac);
                });
                setHabitaciones(resultHabitaciones);
            });
        }, [])
    );

    const handleLoadMore = () => {
        const resultHabicion = [];
        habitaciones.length < totalHabitaciones && setIsLoading(true);

        db.collection("habitacion").orderBy("createAt", "desc").startAfter(startHabitacion.data().createAt)
        .limit(limitHabitacion).get().then((response) => {
            if (response.docs.length > 0) {
                setStartHabitacion(response.docs[response.docs.length - 1])
            } else {
                setIsLoading(false);
            }

            response.forEach((doc) => {
                const habita = doc.data();
                habita.id = doc.id;
                resultHabicion.push(habita);
            });

            setHabitaciones([...habitaciones, ...resultHabicion]);
        })

    }

    return (
        <View style={styles.viewBody}>
            <ListHabitaciones
                habitaciones={habitaciones}
                handleLoadMore={handleLoadMore}
                isLoading={isLoading}
            />

            {user && (
                <Icon
                    reverse
                    type="material-community"
                    name="plus"
                    color="#FF9200"
                    containerStyle={styles.btnContainer}
                    onPress={() => navigation.navigate("add-habitacion")}
                />
            )}
            
        </View>
    );

}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff",
    },
    btnContainer:{
        position: "absolute",
        bottom: 10,
        right: 10,
        shadowColor: "black", shadowOffset: { width: 2, height:2 },
        shadowOpacity: 0.5,
    },
});