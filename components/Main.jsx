import { useEffect, useState, useRef } from "react";
import { View, Text, Pressable, Button } from "react-native";
import {
  useUserContext,
  useBusIdContext,
  useRutaContext,
  useRutaToggleContext,
  useBusIdToggleContext,
  useBusListContext,
  useBusListToggleContext,
} from "../lib/AuthProvider";
import { Screen } from "./Screen";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from "axios";
import { API } from "@env";
import { Link } from "expo-router";

export function Main() {
  const user = useUserContext();
  const setRutas = useRutaToggleContext();
  const rutas = useRutaContext();
  const busData = useBusIdContext();
  const setBusData = useBusIdToggleContext();
  const busList = useBusListContext();
  const setBusList = useBusListToggleContext();
  const [selectedRuta, setSelectedRuta] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedRealTime, setSelectedRealTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = (await axios.get(`https://stllbusqrcode.vercel.app/api/app/rutas`)).data;
        let rutasl = [];
        for (let r of data) {
          for (let f of r.fiscales) {
            if (f.fiscal_id == user._id) {
              rutasl.push(r);
            }
          }
        }
        const buses = (await axios.get(`https://stllbusqrcode.vercel.app/api/app/unidades`)).data;
        setBusList(buses);
        setRutas(rutasl);
      } catch (error) {
        console.log(error + " error");
      }
    };
    fetchData();
  }, []);
  const handleSubmit = async () => {
    if (isSubmitting) return;
    if(busData && selectedRuta){
      setIsSubmitting(true);
      try {
         const now = new Date();
        const year = now.getUTCFullYear();
        const month = String(now.getUTCMonth() + 1).padStart(2, '0');
        const day = String(now.getUTCDate()).padStart(2, '0');
        const hours = String(now.getUTCHours()).padStart(2, '0');
        const minutes = String(now.getUTCMinutes()).padStart(2, '0');
        const seconds = String(now.getUTCSeconds()).padStart(2, '0');
        const milliseconds = String(now.getUTCMilliseconds()).padStart(3, '0');
        const utcDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`

        //https://stllbusqrcode.vercel.app
        const response = await axios.post(`https://stllbusqrcode.vercel.app/api/app/timestamp`, {
          id_ruta: selectedRuta,
          id_unidad: busData._id,
          timestamp_telefono: utcDate,
          timestamp_salida: selectedTime,
          id_fiscal: user._id,
        });
        if(response.status == 200){
          alert("Datos enviados correctamente")
          setSelectedRuta(null);
          setBusData(null);
          setSelectedRuta(null)
        }
      } catch (error) {
        console.log(error)
      } finally {
       setIsSubmitting(false); // Establecer isSubmitting a false al final
      }
    }else{
      alert("Debes seleccionar ruta y autobús");
    }

  }
  const selectedItem = {
    title: "Selected item title",
    description: "Secondary long descriptive text ...",
  };
  const advanceTimeByFourHours = (selectedTime) => {
    const newTime = new Date(selectedTime);
    newTime.setHours(newTime.getHours() + 4);
    console.log(newTime)
    console.log(`Hora adelantada: ${newTime}`);
    return(newTime);
  };
  
  const onTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedTime;
    setShowTimePicker(false);
    setSelectedTime(advanceTimeByFourHours(currentDate));
    setSelectedRealTime(currentDate);
  };

    const formatDate1 = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const secs = String(date.getSeconds()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const strHours = String(hours).padStart(2, "0");
        return `${strHours}:${minutes} ${ampm}`;
    };

  return (
    <Screen>
      <View className="flex flex-col items-center justify-center">
        <Text className="text-2xl">Bienvenido Fiscal {user.numero}</Text>
        <Link asChild href="/scanqr">
          <Pressable className="bg-slate-400 p-2 m-4 rounded">
            <Text className="text-xl font-bold">Escánea el código QR</Text>
          </Pressable>
        </Link>
      </View>
      {busData && (
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
          <View className='m-3 bg-slate-200 rounded'>
            <Picker
              selectedValue={selectedRuta}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedRuta(itemValue)
              }
            >
               <Picker.Item key='r._id' label='Selecciona una Ruta' value={null} />
              {rutas.map((r) => (
              <Picker.Item key={r._id} label={r.nombre} value={r._id} />
              ))}
            </Picker>
          </View>
         {user.sethora ? <View>
        <Pressable className="p-3 mt-10 bg-slate-200 rounded items-center justify-center border-slate-800 border-2" onPress={() => setShowTimePicker(true)} title="Seleccionar Hora" ><Text className='text-lg font-bold'>Hora de Salida</Text>
        </Pressable>
        {showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display="default"
             onChange={onTimeChange}
          />
        )}

       <View>
        <Text className='text-base'>Hora seleccionada: {selectedRealTime ? formatDate1(selectedRealTime) : ''} </Text>
       </View>
          </View>: ''}
           {isSubmitting ? <View className="p-3 mt-10 bg-slate-200 rounded items-center justify-center border-slate-800 border-2"> 
            <Text className='text-lg font-bold'>Enviando...</Text>
           </View> :<Pressable
                onPress={() => handleSubmit()}
                className="p-3 mt-10 bg-slate-200 rounded items-center justify-center border-slate-800 border-2"
                >
                <Text className='text-lg font-bold'>Enviar Datos</Text>
              </Pressable>}
        </View>
      )}
    </Screen>
  );
}
