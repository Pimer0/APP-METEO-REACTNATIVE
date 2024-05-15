import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TextInput } from "react-native";
import * as Location from "expo-location";
import { WEATHER_INTERPRETATIONS } from "../const/WEATHER_INTERPRETATIONS";

export interface Meteo {
	current_weather: CurrentWeather;
	current_weather_units: CurrentWeatherUnits;
	daily: Daily;
	daily_units: DailyUnits;
	elevation: number;
	generationtime_ms: number;
	latitude: number;
	longitude: number;
	timezone: string;
	timezone_abbreviation: string;
	utc_offset_seconds: number;
}

export interface Ville {
	address: {
		city: string;
	};
}

export interface CurrentWeather {
	interval: number;
	is_day: number;
	temperature: number;
	time: string;
	weathercode: number;
	winddirection: number;
	windspeed: number;
}

export interface CurrentWeatherUnits {
	interval: string;
	is_day: string;
	temperature: string;
	time: string;
	weathercode: string;
	winddirection: string;
	windspeed: string;
}

export interface Daily {
	sunrise: string[];
	sunset: string[];
	temperature_2m_max: number[];
	time: Date[];
	weather_code: number[];
	wind_speed_10m_max: number[];
}

export interface DailyUnits {
	sunrise: string;
	sunset: string;
	temperature_2m_max: string;
	time: string;
	weather_code: string;
	wind_speed_10m_max: string;
}

export interface address {
	city: string;
	road: string;
	county: string;
	state: string;
	postcode: string;
	country: string;
	country_code: string;
}

function Weather() {
	const [location, setLocation] = useState(null);
	const [errorMsg, setErrorMsg] = useState(null);
	const [weather, setWeather] = useState<Meteo | null>(null);
	const [ville, setVille] = useState<Ville | null>(null);
	const [text, onChangeText] = React.useState("");
	const [lat, setLat] = useState<number | null>(null);
	const [lon, setLon] = useState<number | null>(null);

	useEffect(() => {
		(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				setErrorMsg("Permission to access location was denied");
				return;
			}

			let location = await Location.getCurrentPositionAsync({});
			setLocation(location);
			setLat(location.coords.latitude);
			setLon(location.coords.longitude);
		})();
	}, []);

	useEffect(() => {
		(async () => {
			if (lat && lon) {
				const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,sunrise,sunset,windspeed_10m_max&timezone=auto&current_weather=true`;
				const urlN = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
				const response = await fetch(url);
				const responseN = await fetch(urlN);
				const dataN = await responseN.json();
				console.log(dataN);
				const data: Meteo = await response.json();
				console.log(data);
				setWeather(data);
				setVille(dataN);
			}
		})();
	}, [lat, lon]);

	const handleTextChange = async (text: string) => {
		onChangeText(text);
	};

	const handleSubmit = async () => {
		const urlC = `https://geocoding-api.open-meteo.com/v1/search?name=${text}&language=fr&count=1`;
		const responseC = await fetch(urlC);
		const dataC: { results: Array<{ latitude: number; longitude: number }> } =
			await responseC.json();
		if (dataC.results.length > 0) {
			setLat(dataC.results[0].latitude);
			setLon(dataC.results[0].longitude);
		}
	};

	const getWeatherImage = (weatherCode: number) => {
		const weatherInterpretation = WEATHER_INTERPRETATIONS.find(
			(interpretation) => interpretation.codes.includes(weatherCode)
		);
		return weatherInterpretation ? weatherInterpretation.image : null;
	};

	const getWeatherCode = (weatherCode: number) => {
		const weatherInterpretation = WEATHER_INTERPRETATIONS.find(
			(interpretation) => interpretation.codes.includes(weatherCode)
		);
		return weatherInterpretation ? weatherInterpretation.label : null;
	};

	return (
		<View style={styles.container}>
			<TextInput
				style={styles.input}
				onChangeText={handleTextChange}
				onSubmitEditing={handleSubmit}
				value={text}
				placeholder="Rechercher une ville"
			/>
			<Text style={styles.data}>
				{ville ? ville.address.city : "Loading..."}
			</Text>
			<Text style={styles.data}>
				{"Vitesse du vent: " +
					(weather ? weather.current_weather.windspeed : "Loading...")}
			</Text>
			<Text style={styles.data}>
				{"temperature actuel: " +
					(weather?.current_weather?.temperature ?? "Loading...")}
			</Text>
			{weather ? (
				<Image
					source={getWeatherImage(weather.current_weather.weathercode)}
					style={{ width: 50, height: 50 }}
				/>
			) : (
				<Text>Loading...</Text>
			)}
			<Text style={styles.data}>
				{" "}
				{getWeatherCode(weather?.current_weather.weathercode ?? 0)}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	data: {
		fontSize: 30,
		color: "white",
		fontWeight: "bold",
		margin: 10,
	},
	press: {
		fontSize: 30,
		color: "red",
		fontWeight: "bold",
		margin: 10,
	},

	container: {
		flex: 1,
		alignContent: "center",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 10,
		margin: "auto",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		height: "auto",
		width: "90%",
	},
	input: {
		height: 40,
		width: "60%",
		borderRadius: 10,
		margin: 12,
		borderWidth: 1,
		padding: 10,
		backgroundColor: "white",
	},
});

export default Weather;
