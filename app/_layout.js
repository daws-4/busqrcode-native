import { Link, Stack } from "expo-router";
import { Pressable, View } from "react-native";
import { Logo } from "../components/Logo";
import { CircleInfoIcon } from "../components/Icons";
import { UserProvider } from "../lib/AuthProvider";

export default function Layout() {
  return (
    <UserProvider>
    <View className="flex-1">
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "white" },
          headerTintColor: "yellow",
          headerTitle: "",
          headerLeft: () => (<Logo/>),
          headerRight: () => (
            <Link asChild href="/about">
              <Pressable>
                <CircleInfoIcon />
              </Pressable>
            </Link>
          ),
        }}
        />
    </View>
      </UserProvider>
  );
}
