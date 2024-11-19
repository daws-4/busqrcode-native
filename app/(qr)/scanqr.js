import { Screen } from "../../components/Screen"
import {useEffect, useState} from "react"
import { View, Text, Pressable } from "react-native"
import { useBusIdContext, useBusIdToggleContext } from "../../lib/AuthProvider";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { router, Link } from "expo-router";
import axios from "axios";
import { API } from "@env";
export default function Scanqr() {
    const [permission, requestPermission] = useCameraPermissions();
    const [type, setType] = useState("back");
    const [text, setText] = useState("");
    const [busId, setBusId] = useState(null);
    const busData = useBusIdContext();
    const setBusData = useBusIdToggleContext();
    
   if (!permission) {
     requestPermission();
   }
    useEffect(() => {
        const fetchData = async () => {
            if (!permission) {
                requestPermission();
            }
        };
        fetchData();
    }, []);

     const handleBarCodeScanned = async ({ type, data }) => {
       if (data == busId) return ;
       setBusId(data);
       try{
          const response = await axios.post(
            `https://stllbusqrcode.vercel.app/api/app/unidades`,
            { busId: data }
          );
          setBusData(response.data);
       }catch(error){
         console.log(error + " error");
       }
       console.log("Type: " + type + "\nData: " + data);
     };

    return (
      <Screen>
        <View className="flex flex-col justify-center items-center">
          {permission ? (
            <CameraView
              onBarcodeScanned={handleBarCodeScanned}
              facing={type}
              style={{ width: 400, height: 400 }}
            />
          ) : (
            <Text>Se han negado los permisos a la cámara</Text>
          )}

          {busData? (
            <View className="mt-6 p-4">
              <Text className="text-black text-black/90 mb-2 mx-4 text-lg">
                <Text className="font-bold text-black">Unidad: </Text>
                {busData.numero}
                <Text className="font-bold text-black"> Placa: </Text>
                {busData.placa}
              </Text>
              <Text className="text-black text-black/90 mb-2 mx-4 text-lg">
                <Text className="font-bold text-black">Conductor: </Text>
                {busData.nombre_conductor}
              </Text>
              <Text className="text-black text-black/90 mb-2 mx-4 text-lg">
                <Text className="font-bold text-black">
                  Teléfono del Conductor:
                </Text>
                {busData.telefono_conductor}
              </Text>

              <View>
              <Pressable
                onPress={() => { setBusId(null); setBusData(null); }}
                className="p-3 bg-slate-200 rounded items-center justify-center border-slate-800 border-2"
                >
                <Text className='text-lg font-bold'>Escánear de nuevo</Text>
              </Pressable>
              <Link asChild href='/scaner' > 
              <Pressable
                className="mt-4 p-3 bg-emerald-400 rounded items-center justify-center border-slate-800 border-2"
                >
                <Text className='text-lg font-bold'>Enviar Datos</Text>
              </Pressable>
              </Link>
              </View>
            </View>
          ): (
            <View className='mt-5 p-4 bg-slate-200 rounded'>
              <Text className='text-xl '>
                Apunta al código QR que está en la unidad
              </Text>
            </View>
          )}
        </View>
      </Screen>
    );
}