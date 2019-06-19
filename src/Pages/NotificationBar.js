// import React, { useEffect, useState } from "react";
// import { View, StyleSheet, Animated, Easing, Dimensions } from "react-native";
// import PropTypes from "prop-types";
// import Ionicons from "react-native-vector-icons/Ionicons";
// //local
// import { MText } from "./MText";
// //variables
// const { width } = Dimensions.get("screen");

// let setNotif = (title, type) => [title, type];

// export const useNotification = () => {
// 	const [showNotif, setShowNotif] = useState(false);
// 	const [information, setInformation] = useState({
// 		title: "",
// 		type: "alert",
// 	});

// 	useEffect(() => {
// 		if (showNotif) setTimeout(() => setShowNotif(false), 3000);
// 	});

// 	setNotif = (title, type = "alert") => {
// 		setShowNotif(true);
// 		setInformation({
// 			title,
// 			type,
// 		});
// 	};

// 	let notifInfo = {
// 		enable: showNotif,
// 		...information,
// 	};

// 	return [notifInfo, setNotif];
// };
// export { setNotif };

// const NotificationBar = ({ title, enable, type }) => {
// 	const [transition] = useState(new Animated.Value(0));
// 	const [backgroundColor, setBackground] = useState("#ffab23");

// 	useEffect(() => {
// 		if (enable) {
// 			switch (type) {
// 				case "alert":
// 					setBackground("#ff0250");
// 					break;
// 				case "warning":
// 					setBackground("#ffab23");
// 					break;
// 				case "info":
// 					setBackground("#0054fe");
// 					break;
// 			}
// 			Animated.timing(transition, {
// 				toValue: 1,
// 				useNativeDriver: true,
// 				duration: 500,
// 				easing: Easing.elastic(2),
// 			}).start();
// 		} else
// 			Animated.timing(transition, {
// 				toValue: 0,
// 				useNativeDriver: true,
// 				duration: 300,
// 				easing: Easing.out(Easing.cubic),
// 			}).start();
// 	}, [enable]);

// 	return (
// 		<Animated.View
// 			style={[
// 				styles.container,
// 				{
// 					transform: [
// 						{
// 							translateY: transition.interpolate({
// 								inputRange: [0, 1],
// 								outputRange: [-100, 10],
// 							}),
// 						},
// 					],
// 					backgroundColor,
// 				},
// 			]}
// 		>
// 			<View style={styles.iconWrapper}>
// 				<Ionicons name="md-notifications" color="#fff" size={20} />
// 			</View>
// 			<MText style={styles.text}>{title}</MText>
// 		</Animated.View>
// 	);
// };

// NotificationBar.propTypes = {
// 	title: PropTypes.string,
// 	type: PropTypes.oneOf(["alert", "success", "info"]),
// 	enable: PropTypes.bool,
// };
// NotificationBar.defaultProps = {
// 	type: "alert",
// 	enable: false,
// };

// const styles = StyleSheet.create({
// 	container: {
// 		width: width - 20,
// 		marginHorizontal: 10,
// 		position: "absolute",
// 		zIndex: 999,
// 		backgroundColor: "#ffab23",
// 		borderRadius: 5,
// 		padding: 10,
// 		flexDirection: "row-reverse",
// 		alignItems: "center",
// 	},
// 	iconWrapper: {
// 		width: 40,
// 		height: 40,
// 		borderRadius: 20,
// 		backgroundColor: "rgba(255,255,255,0.2)",
// 		alignItems: "center",
// 		justifyContent: "center",
// 		marginLeft: 10,
// 	},
// 	text: { color: "#fff", flex: 1, textAlign: "left" },
// });

// export { NotificationBar };
