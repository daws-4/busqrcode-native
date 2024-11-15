import { useEffect, useState } from "react";
import { useUserContext, useUserToggleContext } from  "../lib/AuthProvider";
import { Screen } from "./Screen";

export function Main() {
  const user = useUserContext();
  const cambiaLogin = useUserToggleContext();
  return (
    <Screen>
      
    </Screen>
  );
}
