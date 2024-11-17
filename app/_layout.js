import { Link, Stack, Slot } from "expo-router";
import { Pressable, View } from "react-native";
import { Logo } from "../components/Logo";
import { CircleInfoIcon } from "../components/Icons";
import { UserProvider } from "../lib/AuthProvider";


export default function Layout() {
 
  return (
    <UserProvider>
    <View className="flex-1">
      <Slot/>
    </View>
      </UserProvider>
  );
}
