import { useEffect, useState, useRef } from "react";
import { View, Text, Pressable, Button } from "react-native";
import { useUserContext, useBusIdContext, useRutaContext, useRutaToggleContext } from  "../lib/AuthProvider";
import { Screen } from "./Screen";
import { Redirect } from "expo-router";
import axios from "axios";
import { API } from "@env";
import { Link } from "expo-router";

export function Main() {
  const user = useUserContext();
  const setRutas = useRutaToggleContext();
  const [scanned, setScanned] = useState(false);
  const rutas = useRutaContext();
  const busData = useBusIdContext();

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
  // if(busData){
  //   setScanned(true)
  // }
   
  return (
    <Screen>
      <View className='flex flex-col items-center justify-center'>
        <Text className='text-2xl'>Bienvenido Fiscal {user.numero}</Text>
        <Link asChild href='/scanqr'>
        <Pressable className='bg-slate-400 p-2 m-4 '>
        <Text className='text-xl font-bold'>Escánea el código QR</Text>
        </Pressable>
        </Link>
      </View>
        {scanned && <Button title={'Scan again?'} onPress={() => setScanned(false)} color='tomato' />}
     {busData && (
      <View>
        <Text>
          oal
        </Text>
      </View>
      )}
    </Screen>
  );
}
