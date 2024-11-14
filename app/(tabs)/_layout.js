import { Tabs } from "expo-router";

import { ScannerIcon, InfoIcon } from "../../components/Icons";
import { useEffect } from "react";
import { check } from "prettier";

export default function TabsLayout() {
  return (
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
  );
}
