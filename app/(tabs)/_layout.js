import { Tabs, Link, Stack } from "expo-router";
import { Pressable } from "react-native";
import { CircleInfoIcon } from "../../components/Icons";
import { Logo } from "../../components/Logo";
import { ScannerIcon, InfoIcon } from "../../components/Icons";
import { useEffect } from "react";
import { check } from "prettier";
import { UserProvider } from "../../lib/AuthProvider";

export default function TabsLayout() {
  return (
    <>
    <UserProvider>

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: "#000" },
          tabBarActiveTintColor: "#ffffff",
        }}
      >
        <Tabs.Screen
          name="scaner"
          options={{
            title: "Escáner",
            tabBarIcon: ({ color }) => <ScannerIcon color={color} />,
          }}
          />
        <Tabs.Screen
          name="about"
          options={{
            title: "Guía",
            tabBarIcon: ({ color }) => <InfoIcon color={color} />,
          }}
          />
      </Tabs>
        </UserProvider>
    </>
  );
}
