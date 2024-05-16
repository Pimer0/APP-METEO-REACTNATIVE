import { StatusBar } from "expo-status-bar";
import {
	ImageBackground,
	ImageSourcePropType,
	SafeAreaView,
	StyleSheet,
	Text,
	View,
	Button,
} from "react-native";
import React from "react";
import Weather from "./components/Weather";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WeatherList from "./components/WeatherList";

function HomeScreen({ navigation }: { navigation: any }) {
	const image: ImageSourcePropType = require("./assets/background-app-meteo.jpeg");

	return (
		<SafeAreaView style={styles.container}>
			<View>
				<ImageBackground
					source={image}
					style={{ width: "100%", height: "100%" }}
				>
					<Weather />
					<StatusBar style="auto" />
					<Button
						title="Résultats sur 7 jours"
						onPress={() => navigation.navigate("Details")}
					/>
				</ImageBackground>
			</View>
		</SafeAreaView>
	);
}

function DetailsScreen() {
	const image: ImageSourcePropType = require("./assets/background-app-meteo.jpeg");

	return (
		<SafeAreaView style={styles.container}>
			<View>
				<ImageBackground
					source={image}
					style={{ width: "100%", height: "100%" }}
				>
					<WeatherList />
				</ImageBackground>
			</View>
		</SafeAreaView>
	);
}

const Stack = createNativeStackNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="Home" component={HomeScreen} />
				<Stack.Screen name="Details" component={DetailsScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "darkblue",
	},
});
