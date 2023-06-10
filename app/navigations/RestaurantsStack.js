import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Habitaciones from "../screens/Habitaciones/Habitaciones";
import AddHabitacion from "../screens/Habitaciones/AddHabitacion";
import Habitacion from "../screens/Habitaciones/Habitacion";
import AddReviewHabitacion from "../screens/Habitaciones/AddReviewHabitacion";

const Stack = createStackNavigator();

export default function RestaurantsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name = "restaurans"
                component = {Habitaciones}
                options = {{ title: "Cuartos" }}
            />
            <Stack.Screen
                name = "add-habitacion"
                component = {AddHabitacion}
                options={{title: "Añadir nueva habitación"}}
            />
            <Stack.Screen 
                name="habitacion"
                component ={Habitacion}
            />
            <Stack.Screen 
                name="add-review-habitacion" 
                component={AddReviewHabitacion}
                options={{title: "Nuevo comentario"}}
            />
        </Stack.Navigator>
    )
}
