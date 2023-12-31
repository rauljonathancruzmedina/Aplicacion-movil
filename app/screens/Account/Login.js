import React, { useRef } from "react";
import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
import { Divider } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-easy-toast";
import LoginForm from "../../components/Account/LoginForm";


export default function Login(){
    const toastRef = useRef();
    return(
        <ScrollView style={styles.color}>
            <Image
                source = {require("../../../assets/img/logo_web.png")}
                resizeMode = "contain"
                style = {styles.logo}
            />
            <View style={styles.viewContainer}>
                <LoginForm toastRef={toastRef} />
                <CreateAccount/>
            </View>
            <Divider style={styles.divider}/>
            <Toast ref={toastRef} position="center" opacity={0.9} />
        </ScrollView>
    );
}

function CreateAccount(){
    const navigation = useNavigation();
    return(
    <Text style={styles.textRegister}>
        ¿Aún no tines una cuenta? {" "}
        <Text style={styles.btnRegister}
        onPress={() => navigation.navigate("register") }>
            Registrate
        </Text>
    </Text>
    );
}

const styles = StyleSheet.create({
    color:{
        //backgroundColor: "#FF9200",
    },
    logo: {
        width: "80%",
        height: 150,
        marginTop: 20,
        marginLeft: 20,
    },
    viewContainer: {
        marginRight: 40,
        marginLeft: 40,
    },
    textRegister: {
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10,
    },
    btnRegister: {
        color: "#FF9200",
        fontWeight: "bold",
    },
    divider:{
        backgroundColor: "#FF9200",
        margin: 40,
    },

})