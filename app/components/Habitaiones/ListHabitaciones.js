import React from "react";
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { Image } from "react-native-elements";
import { size } from "lodash";
import { useNavigation } from "@react-navigation/native";

export default function ListHabitaciones(props) {
    const {habitaciones, handleLoadMore, isLoading} = props;
    const navigation = useNavigation();

    return (
        <View>
            {size(habitaciones) > 0 ? (
                <FlatList 
                    data={habitaciones}
                    renderItem={(habitacions) => <Habitacion habitacions={habitacions} navigation={navigation}/>}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={0.5}
                    onEndReached={handleLoadMore}
                    ListFooterComponent={<FooterList isLoading={isLoading}/>}
                />
            ) : (
                <View style={styles.loaderHabitaciones}>
                    <ActivityIndicator size="large" color="#4093c9"/>
                    <Text>Cargando habitaciones</Text>
                </View>   
            )}
        </View>
    );
}

function Habitacion(props) {
    const {habitacions, navigation} = props;
    console.log(habitacions);
    const { id, images, name, description, address } = habitacions.item;
    const imageHabitacions = images[0];

    const goHabitacion = () => {
        navigation.navigate("habitacion", {
            id, 
            name
        });
    }

    return (
        <TouchableOpacity onPress={goHabitacion}>
            <View style={styles.viewHabitacion}>
                <View style={styles.viewHavitacionImage}>
                    <Image 
                        resizeMode="cover"
                        PlaceholderContent={<ActivityIndicator color="#4093c9"/>}
                        source={
                            imageHabitacions ? { uri: imageHabitacions} : require("../../../assets/img/no-image.png")
                        }
                        style={styles.imageHabitac}
                    />
                </View>
                <View>
                    <Text style={styles.habitacioName}>{name}</Text>
                    <Text style={styles.habitacioAddress}>{address}</Text>
                    <Text style={styles.habitacioDescriptio}>
                        {description.substr(0, 60)}...
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

function FooterList(props) {
    const { isLoading } = props;

    if(isLoading) {
        return(
            <View style={styles.loaderHabitaciones}>
                <ActivityIndicator size="large"/>
            </View>
        );
    } else {
        return(
            <View style={styles.noFountHabitacion}>
                <Text>No quedan habitaciones por mostrar</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    loaderHabitaciones:{
        marginTop: 10,
        marginBottom: 10,
        alignItems: "center"
    },
    viewHabitacion:{
        flexDirection: "row",
        margin: 10,
    },
    viewHavitacionImage:{
        marginRight: 15,
    },
    imageHabitac:{
        width: 80,
        height: 80,
    },
    habitacioName:{
        fontWeight: "bold",
    },
    habitacioAddress:{
        paddingTop: 2,
        color: "grey",
    },
    habitacioDescriptio:{
        paddingTop: 2,
        color: "grey",
        width: 300,
    },
    noFountHabitacion:{
        marginTop: 10,
        marginBottom: 20,
        alignItems: "center",
    },
});
