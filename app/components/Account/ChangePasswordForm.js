import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input, Button } from "react-native-elements";
import { size } from "lodash";
import * as firebase from "firebase";
import { reautenticate } from "../../utils/api";

export default function ChangePasswordForm(props){
    const { setShowModal, toastRef } = props;
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(defaultValue());
    const [erros, setErros] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text });
    }

    const onSubmit = async () => {
        let isSetErrors = true;
        let errosTemp = {};
        setErros({});

        if (!formData.password || !formData.newPassword || !formData.repeatNewPasswor) {
            errosTemp = {
                password: !formData.password ? "La contraseña no puede estar vacia." : "",
                newPassword: !formData.newPassword ? "La contraseña no puede estar vacia." : "",
                repeatNewPasswor: !formData.repeatNewPasswor ? "La contraseña no puede estar vacia." : "",
            }
        } else if (formData.newPassword !== formData.repeatNewPasswor) {
            errosTemp= {
                newPassword: "Las contraseñas no son iguales.",
                repeatNewPasswor: "Las contraseñas no son iguales.",
            }
        } else if (size(formData.newPassword) < 6) {
            errosTemp = {
                newPassword: "La contraseña tiene que ser mayo a 5 caracteres.",
                repeatNewPasswor: "La contraseña tiene que ser mayo a 5 caracteres."
            }
        } else {
            setIsLoading(true);
           await reautenticate(formData.password).then(async () => {
           await firebase.auth().currentUser.updatePassword(formData.newPassword).then(() => {
                isSetErrors = false;
                setIsLoading(false);
                setShowModal(false);
                firebase.auth().signOut();
            }).catch(() => {
                errosTemp={
                    other: "Error al actualizar la contraseña."
                };
                setIsLoading(false);
            })
            }).catch(() => {
                errosTemp = {
                    password: "La contraseña no es correcta"
                }
                setIsLoading(false);
            });
        }
        isSetErrors && setErros(errosTemp);
    };

    return(
        <View style={styles.view}>
            <Input
                placeholder="Contraseña actual"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: showPassword ? "eye-off-outline" : "eye-outline",
                    color: "#4093c9",
                    onPress: () => setShowPassword(!showPassword)
                }}
                onChange={(e) => onChange(e, "password")}
                errorMessage={erros.password}
            />
            <Input
                placeholder="Nueva contraseña"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: showPassword ? "eye-off-outline" : "eye-outline",
                    color: "#4093c9",
                    onPress: () => setShowPassword(!showPassword)
                }}
                onChange={(e) => onChange(e, "newPassword")}
                errorMessage={erros.newPassword}
            />
            <Input
                placeholder="Repetir Nueva contraseña"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: showPassword ? "eye-off-outline" : "eye-outline",
                    color: "#4093c9",
                    onPress: () => setShowPassword(!showPassword)
                }}
                onChange={(e) => onChange(e, "repeatNewPasswor")}
                errorMessage={erros.repeatNewPasswor}
            />
            <Button
                title="Cambiar contraseña"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={isLoading}
            />
            <Text>{erros.other}</Text>
        </View>
    );
}

function defaultValue() {
    return{
        password: "",
        newPassword: "",
        repeatNewPasswor: "",
    }
}

const styles = StyleSheet.create({
    view:{
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10,
    },
    input:{
        marginBottom:10,
    },
    btnContainer:{
        marginTop: 20,
        width: "95%",
    },
    btn:{
        backgroundColor: "#4093c9",
        borderRadius: 30,
    },
});