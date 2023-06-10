import React, { useRef } from "react";
import { StyleSheet, View, Image } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-easy-toast";
import RegisterForm from "../../components/Account/RegisterForm";

export default function Register() {
    const toastRe = useRef();

    return (
    <KeyboardAwareScrollView>  
        <Image
            source={require("../../../assets/img/logo_web.png")}
            resizeMode="contain"
            style={styles.logo}
        />
        <View style={styles.viewForm}>
            <RegisterForm toastRe={toastRe} />
        </View>
        <Toast ref={toastRe} position="center" opacity={0.9}/>
      </KeyboardAwareScrollView>  
    )
}

const styles = StyleSheet.create({
    logo:{
        width: "80%",
        marginLeft: 35,
        height: 150,
        marginTop: 20,
    },
    viewForm:{
        marginRight: 40,
        marginLeft:40,
    },

});