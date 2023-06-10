import React, { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import Toast from "react-native-easy-toast";
import ListTopHabitacions from "../components/Ranking/ListTopHabitacions";

import { firebaseApp } from "../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function TopRestaurants(props){
    const { navigation } = props;
    const [habitacion, setHabitacion] = useState([]);
    const toasRef = useRef();

    useEffect(() => {
        db.collection("habitacion")
        .orderBy("rating", "desc")
        .limit(5)
        .get()
        .then((response) => {
            const habitacionArray = [];
            response.forEach((doc) => {
                const data = doc.data();
                data.id = doc.id;
                habitacionArray.push(data);
            });
            setHabitacion(habitacionArray);
        });
    }, [])

    return(
        <View>
            <ListTopHabitacions habitacion={habitacion} navigation={navigation}/>
            <Toast ref={toasRef} position="center" opacity={0.9} />
        </View>
    );
}