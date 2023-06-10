import React, { useState, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AirbnbRating, Button, Input, Rating } from "react-native-elements";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function AddReviewHabitacion(props) {
    const { navigation, route } = props;
    const { idHabitacion } = route.params;
    const [rating, setRating] = useState(null);
    const [title, setTitle] = useState("");
    const [review, setReview] = useState("");
    const [isloading, setIsloading] = useState(false);
    const toasRef = useRef();

    const addReview = () => {
        if (!rating) {
            toasRef.current.show("No has dado ninguna puntuación");
        } else if (!title) {
            toasRef.current.show("El titulo es obligatorio");
        } else if (!review){
            toasRef.current.show("El comentario es obligatorio");
        } else {
            setIsloading(true);
            const user = firebase.auth().currentUser;
            const paylod = {
                idUser: user.uid, 
                avatarUser: user.photoURL,
                idHabitacion: idHabitacion,
                title: title,
                review: review,
                rating: rating,
                createAt: new Date(),
            };
            db.collection("reviews").add(paylod).then(() =>{
                updateHabitacion();
            }).catch(() =>{
                toasRef.current.show("Error al enviar comentario");
                setIsloading(false);
            })
        }
    }

    const updateHabitacion = () => {
        const habitacionRef = db.collection("habitacion").doc(idHabitacion);

        habitacionRef.get().then((response) => {
            const habitacionData = response.data();
            const ratingTotal = habitacionData.ratingTotal + rating;
            const quantityVoting = habitacionData.quantityVoting + 1;
            const ratingResult = ratingTotal / quantityVoting;

            habitacionRef.update({
                rating: ratingResult,
                ratingTotal,
                quantityVoting,
            }).then(() => {
                setIsloading(false);
                navigation.goBack();
            })
        });
    };

    return (
        <View style={styles.viewBody}>
            <View style={styles.viewRating}>
                <AirbnbRating 
                    count={5}
                    reviews={["Pésimo", "Deficiente", "Bueno", "Muy bueno", "Excelente"]}
                    defaultRating={0}
                    size={35}
                    onFinishRating={(value) => {setRating(value)}}
                />
            </View>    
            <View style={styles.formReview}>
                <Input 
                    placeholder="Titulo"
                    containerStyle={styles.input}
                    onChange={(e) => setTitle(e.nativeEvent.text)}
                />
                <Input 
                    placeholder="Comentario..."
                    multiline={true}    
                    inputContainerStyle={styles.textArea}
                    onChange={(e) => setReview(e.nativeEvent.text)}
                />
                <Button
                    title="Enviar comentario"
                    containerStyle={styles.btnContainer}
                    buttonStyle={styles.btn}
                    onPress={addReview}
                />
            </View>
            <Toast ref={toasRef} position="center" opacity={0.9}/>
            <Loading isVisible={isloading} text="Enviando comentario" />
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody:{
        flex: 1,
    },
    viewRating:{
        height: 110,
        backgroundColor: "#f2f2f2",
    },
    formReview:{
        flex: 1,
        alignItems: "center",
        margin: 10,
        marginTop: 40
    },
    input: {
        marginBottom: 10,
    },
    textArea:{
        height: 150,
        width: "100%",
        padding: 0,
        margin: 0,
    },
    btnContainer: {
        flex: 1,
        justifyContent: "flex-end",
        marginTop: 20,
        marginBottom: 10,
        width: "95%"
    },
    btn:{
        backgroundColor: "#FF9200",
        borderRadius: 35,
    },
});
