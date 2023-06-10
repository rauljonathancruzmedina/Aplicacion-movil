import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import RestaurantsStack from "./RestaurantsStack";
import FavoritesStack from "./Favorites.Stack";
import TopCuartosStack from "./TopCuartosStack";
import SearchStack from "./SearchStack";
import AccountStack from "./AccountStack";
import HomeStack from "./HomeStack"

const Tab = createBottomTabNavigator();

export default function navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName = "account"
        tabBarOptions  = {{
          inactiveTintColor: "#4093c9",
          activeTintColor: "#FF9200",
        }}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color  }) => screenOptions(route, color),
        }) }
      >
        
       

        <Tab.Screen 
        name="Restaurants" 
        component={RestaurantsStack} 
        options={{ title: "Cuartos" }} />

        <Tab.Screen 
        name="Favoritos" 
        component={FavoritesStack} 
        options={{ title: "favoritos" }}/>

        <Tab.Screen 
        name="top-restaurants" 
        component={TopCuartosStack} 
        options={{ title: "Top 5" }}/>

        <Tab.Screen
        name="search"
        component={SearchStack}
        options={{title: "Buscar"}}/>

        <Tab.Screen
        name="account"
        component={AccountStack}
        options={{title: "Perfil"}}/>

      </Tab.Navigator>
    </NavigationContainer>
  );
}


function screenOptions(route, color){
  let iconName;

  switch (route.name){
    case "home":
          iconName = "home-city"
      break;
    case "Restaurants":
          iconName = "home"
      break;
    case "Favoritos":
        iconName = "heart-outline"
    break;
    case "top-restaurants":
      iconName = "star-outline"
      break;
    case "search":
      iconName = "magnify"
      break;
    case "account":
      iconName = "account"
      break;
    default:
      break;  
  }
  return(
    <Icon type = "material-community" name = {iconName} size = {22} color = {color} />
  )
}
