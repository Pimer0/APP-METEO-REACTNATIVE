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
	weathercode: number[];
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

function WeatherList() {
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
	const styles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: "#fff",
			alignItems: "center",
			justifyContent: "center",
		},
		input: {
			height: 40,
			margin: 12,
			borderWidth: 1,
		},
		data: {
			margin: 12,
			color: "white",
		},
	});

	return (
		<>
			<View style={{ flexDirection: "row" }}>
				{weather ? (
					<Image
						source={getWeatherImage(weather.current_weather.weathercode)}
						style={{ width: 50, height: 50 }}
					/>
				) : (
					<Text>Loading...</Text>
				)}
				<Text style={styles.data}>
					{(weather?.current_weather?.temperature ?? "Loading...") + "°C"}
				</Text>
				<Text style={styles.data}>
					{"" + (weather?.daily?.time[0] ?? "Loading...")}
				</Text>
			</View>
			<View style={{ flexDirection: "row" }}>
				{weather ? (
					<Image
						source={getWeatherImage(weather.daily.weathercode[1])}
						style={{ width: 50, height: 50 }}
					/>
				) : (
					<Text>Loading...</Text>
				)}
				<Text style={styles.data}>
					{(weather?.daily?.temperature_2m_max[1] ?? "Loading...") + "°C"}
				</Text>
				<Text style={styles.data}>
					{"" + (weather?.daily?.time[1] ?? "Loading...")}
				</Text>
			</View>
			<View style={{ flexDirection: "row" }}>
				{weather ? (
					<Image
						source={getWeatherImage(weather.daily.weathercode[2])}
						style={{ width: 50, height: 50 }}
					/>
				) : (
					<Text>Loading...</Text>
				)}
				<Text style={styles.data}>
					{(weather?.daily?.temperature_2m_max[2] ?? "Loading...") + "°C"}
				</Text>
				<Text style={styles.data}>
					{"" + (weather?.daily?.time[2] ?? "Loading...")}
				</Text>
			</View>
			<View style={{ flexDirection: "row" }}>
				{weather ? (
					<Image
						source={getWeatherImage(weather.daily.weathercode[3])}
						style={{ width: 50, height: 50 }}
					/>
				) : (
					<Text>Loading...</Text>
				)}
				<Text style={styles.data}>
					{(weather?.daily?.temperature_2m_max[3] ?? "Loading...") + "°C"}
				</Text>
				<Text style={styles.data}>
					{"" + (weather?.daily?.time[3] ?? "Loading...")}
				</Text>
			</View>
			<View style={{ flexDirection: "row" }}>
				{weather ? (
					<Image
						source={getWeatherImage(weather.daily.weathercode[4])}
						style={{ width: 50, height: 50 }}
					/>
				) : (
					<Text>Loading...</Text>
				)}
				<Text style={styles.data}>
					{(weather?.daily?.temperature_2m_max[4] ?? "Loading...") + "°C"}
				</Text>
				<Text style={styles.data}>
					{"" + (weather?.daily?.time[4] ?? "Loading...")}
				</Text>
			</View>
			<View style={{ flexDirection: "row" }}>
				{weather ? (
					<Image
						source={getWeatherImage(weather.daily.weathercode[5])}
						style={{ width: 50, height: 50 }}
					/>
				) : (
					<Text>Loading...</Text>
				)}
				<Text style={styles.data}>
					{(weather?.daily?.temperature_2m_max[5] ?? "Loading...") + "°C"}
				</Text>
				<Text style={styles.data}>
					{"" + (weather?.daily?.time[5] ?? "Loading...")}
				</Text>
			</View>
			<View style={{ flexDirection: "row" }}>
				{weather ? (
					<Image
						source={getWeatherImage(weather.daily.weathercode[6])}
						style={{ width: 50, height: 50 }}
					/>
				) : (
					<Text>Loading...</Text>
				)}
				<Text style={styles.data}>
					{(weather?.daily?.temperature_2m_max[6] ?? "Loading...") + "°C"}
				</Text>
				<Text style={styles.data}>
					{"" + (weather?.daily?.time[6] ?? "Loading...")}
				</Text>
			</View>
		</>
	);
}

export default WeatherList;
