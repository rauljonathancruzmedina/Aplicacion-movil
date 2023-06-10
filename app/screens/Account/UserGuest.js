import React from "react";
import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
import { Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

export default function UserGuest() {
    const navigation = useNavigation();

  return (
    <ScrollView centerContent={true} style={styles.viewBody}>
        <Image
            source={require("../../../assets/img/guest.jpg")}
            resizeMode="contain"
            style={styles.image}
        />
        <Text style={styles.title}>Consulta tu perfil</Text>
        <Text style={styles.descrition}>
            Casa curtiduria.
        </Text>
        <View style={styles.viewBtn}>
            <Button 
                title="Ver tu perfil"
                buttonStyle={styles.btnStyle}
                containerStyle={styles.btnContainer}
                onPress={() => navigation.navigate("login")}
            />
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    viewBody: {
        marginLeft: 10,
        marginRight: 10,
    },
    image:{
        height: 300,
        width: "100%",
        marginBottom: 40,
    },
    title:{
        fontWeight: "bold",
        fontSize: 19,
        marginBottom: 10,
        textAlign: "center",
    },
    descrition:{
        textAlign: "center",
        marginBottom: 20,
    },
    viewBtn:{
        flex: 1,
        alignItems: "center",  
    },
    btnStyle:{
        backgroundColor: "#FF9200",
        borderRadius: 30,
    },
    btnContainer:{
        width: "70%",
    },
});
