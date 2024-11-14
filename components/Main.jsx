import { useEffect, useState } from "react";
import { Link } from "expo-router";

import { FlatList, View, ActivityIndicator, Pressable } from "react-native";
import { getLatestGames } from "../lib/metacritic";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnimatedGameCard } from "./GameCard";
import { Logo } from "./Logo";

import { CircleInfoIcon } from "./Icons";
import { Screen } from "./Screen";

export function Main() {

  return (
    <Screen>
      
    </Screen>
  );
}
