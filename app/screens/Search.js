import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, Image } from "react-native";
import { SearchBar, ListItem, Icon } from "react-native-elements";
import { FireSQL } from "firesql";
import firebase from "firebase/app";

const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id" });

export default function Search(props) {
    const { navigation } = props;
    
    const [search, setSearch] = useState("");
    const [habitacion, setHabitacion] = useState([]);

    useEffect(() => {
        if (search) {
            fireSQL.query(`SELECT * FROM habitacion WHERE name LIKE '${search}%'`)
            .then((response) => {
                setHabitacion(response);
            });   
        }
    }, [search]);
    

    return(
        <View>
            <SearchBar
                placeholder="Buscar habitación..."
                onChangeText={(e) => setSearch(e)}
                value={search}
                containerStyle={styles.searchBar}
            />
            {habitacion.length === 0 ? (
                <NoFountHabitacion/>
            ) : (
                <FlatList
                    data={habitacion}
                    renderItem={(habitacion) => <Habitaciones habitacion={habitacion} navigation={navigation} />}
                    keyExtractor={(item, index) => index.toString()}
                />
            )}
        </View>
    );
}

function NoFountHabitacion() {
    return(
        <View style={{flex: 1, alignItems: "center"}}>
            <Image
                source={require("../../assets/img/no-result-found.png")}
                resizeMode="cover"
                style={{width: 200, height: 200}}
            />
        </View>
    );
}

function Habitaciones(props) {
    const { habitacion, navigation } = props;
    const { id, name, images } = habitacion.item;
    return(
        <ListItem
            title={name}
            leftAvatar={{
                source: images[0] ? {  uri: images[0] } : require("../../assets/img/no-image.png")
            }}
            rightIcon={<Icon type="material-community" name="chevron-right"/>}
            onPress={() => navigation.navigate("Restaurants", {screen: "habitacion", params: { id, name }})}
        />
    );
}

const styles = StyleSheet.create({
    searchBar:{
        marginBottom: 20,
    },
});