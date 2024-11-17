import { useEffect, useState } from "react";
import { useUserContext,  useUserToggleContext, useUserLogoutContext, useRutaContext, useRutaToggleContext } from  "../lib/AuthProvider";
import { Screen } from "./Screen";
import { Redirect } from "expo-router";
import axios from "axios";
import { API } from "@env";
import { View, Text } from "react-native";
export function Main() {
  const user = useUserContext();
  const setRutas = useRutaToggleContext();
  const rutas = useRutaContext();
  useEffect(() => {
  const fetchData = async () => {
    try {
      const data = (await axios.get(`${API}/api/app/rutas`)).data

                let rutasl = [];
                for (let r of data) {
                  for (let f of r.fiscales) {
                    if (f.fiscal_id == user._id) {
                      rutasl.push(r);
                    }
                  }
                }
      setRutas(rutasl)
    } catch (error) {
      console.log(error + ' error')
    }
  }
  fetchData()
  }, []);
  return (
    <Screen>
      <View className='flex flex-col items-center justify-center'>
        <Text className='text-2xl'>Bienvenido Fiscal {user.numero}</Text>
        <Text className='text-xl font-bold'>Escánea el código QR</Text>
      </View>
      
    </Screen>
  );
}
