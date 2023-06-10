import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import Loading from "../Loading";
import { validateEmail } from "../../utils/validations";
import { size, isEmpty } from "lodash";
import * as firebase from "firebase";
import { useNavigation } from "@react-navigation/native";

export default function RegisterForm(props) {
    
    const { toastRe } = props;
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [formData, setFormData] = useState(defaultFormValue());
    const [loadind, setLoadind] = useState(false);
    const navigation = useNavigation();

    const onSubmit = () => {
        if(isEmpty(formData.email) || 
           isEmpty(formData.password) || 
           isEmpty(formData.repeatPassword)){
           toastRe.current.show("Todos los cambios son obligatorios"); 
        } else if(!validateEmail(formData.email)) {
            toastRe.current.show("El email no es correcto");
        } else if (formData.password !== formData.repeatPassword){
            toastRe.current.show("Las contraseñas tienen que ser iguales");
        } else if (size(formData.password) < 6){
            toastRe.current.show("La contraseña debe tener al menos 6 caracteres");
        } else {
            setLoadind(true);
            firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password)
            .then( () => {   
                setLoadind(false); 
                navigation.navigate("account");
            } )
            .catch( () => {
                setLoadind(false); 
                toastRe.current.show("El email ya esta en uso, pruebe con otro");
            })
        }
    };

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    }

    return (
        <View style={styles.formContainer}>
            <Input
                placeholder = "Correo electronico"
                containerStyle={styles.inputForm}
                onChange={(e) => onChange(e, "email")}
                rightIcon={
                    <Icon
                        type="material-community"
                        name="at"
                        iconStyle={styles.iconRight}
                    />
                }
            />
            <Input
                placeholder = "Contraseña"
                containerStyle={styles.inputForm}
                password = {true}
                secureTextEntry = {showPassword ? false : true}
                onChange={(e) => onChange(e, "password")}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword ? "eye-off-outline" : "eye"}
                        iconStyle={styles.iconRight}
                        onPress={ () => setShowPassword(!showPassword) }
                    />
                }
            />
            <Input
                placeholder = "Repetir contraseña"
                containerStyle = {styles.inputForm}
                password = {true}
                secureTextEntry = {showRepeatPassword ? false : true}
                onChange={(e) => onChange(e, "repeatPassword")}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showRepeatPassword ? "eye-off-outline" : "eye"}
                        iconStyle={styles.iconRight}
                        onPress={ () => setShowRepeatPassword(!showRepeatPassword) }
                    />
                }
            />
            <Button
                title = "Crear"
                containerStyle={styles.btnContainerRegister}
                buttonStyle={styles.btnRegister}
                onPress={onSubmit}
            />
            <Loading isVisible={loadind} text="Creando cuenta" />

        </View>
    )
}

function defaultFormValue() {
    return{
        email: "",
        password: "",
        repeatPassword: "",
    }
}

const styles = StyleSheet.create({
    formContainer:{
        flex:1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
    },
    inputForm:{
        width: "100%",
        marginTop: 20,
    },
    btnContainerRegister:{
        marginTop: 20,
        width: "95%",
    },
    btnRegister:{
        backgroundColor: "#FF9200",
        borderRadius: 30,
    },
    iconRight: {
        color: "#FF9200",
    },
});