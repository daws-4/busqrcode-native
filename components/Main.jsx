import { useEffect, useState, useRef } from "react";
import { View, Text, Pressable,  ActivityIndicator, ScrollView } from "react-native";
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
import NetInfo from '@react-native-community/netinfo';
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
  const [getRegistros, setGetRegistros] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [requestQueue, setRequestQueue] = useState([]);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);

 
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Iniciar carga
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
   
        if(user.sethora){
          const response  = (await axios.post(`https://stllbusqrcode.vercel.app/api/app/timestamp/fiscal`, {
            numero_fiscal: user.numero,
            id_fiscal: user._id,
          }));
          const sortedData = response.data.sort((a, b) => new Date(b.timestamp_salida) - new Date(a.timestamp_salida));
          setGetRegistros(sortedData);
        }


            setBusList(buses);
            setRutas(rutasl);
      } catch (error) {
        console.log(error + " error");
     } finally {
        setIsLoading(false); // Finalizar carga
      }
    };

    fetchData();
  }, []);


 const sendRequest = async (request, isQueued = false) => {
    try {
      const response = await Promise.race([
        axios.post(`https://stllbusqrcode.vercel.app/api/app/timestamp`, request),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 10000))
      ]);

      if (response.status === 200) {
        // alert(isQueued ? 'Petición enviada desde la cola' : 'Datos enviados correctamente');
        // setTimeout(() => alert(''), 3000);
        return false; // Indicar que la petición se envió correctamente
      }
    } catch (error) {
      console.log(error + " error");
      alert('La petición se agregó a la cola');
      // setTimeout(() => alert(''), 3000);
      return false; // Indicar que la petición se agregó a la cola
    }
  };
  const handleSubmit = async () => {
    if (isSubmitting) return;
  if (busData && selectedRuta) {
      setIsSubmitting(true); // Establecer isSubmitting a true al inicio
      try {
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = String(now.getUTCMonth() + 1).padStart(2, '0');
        const day = String(now.getUTCDate()).padStart(2, '0');
        const hours = String(now.getUTCHours()).padStart(2, '0');
        const minutes = String(now.getUTCMinutes()).padStart(2, '0');
        const seconds = String(now.getUTCSeconds()).padStart(2, '0');
        const milliseconds = String(now.getUTCMilliseconds()).padStart(3, '0');
        const utcDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;

        const request = {
          id_ruta: selectedRuta,
          id_unidad: busData._id,
          timestamp_telefono: utcDate,
          timestamp_salida: selectedTime,
          id_fiscal: user._id,
        };


        // Intentar enviar la petición
         const sent = await sendRequest(request);

        if (sent) {
          setSelectedRuta(null);
          setBusData(null);
        } else {
          alert(requestQueue.toString())
          setRequestQueue((requestQueue) => [request, ...requestQueue]);
          setSelectedRuta(null);
          setBusData(null);
        }

      } finally {
        setIsSubmitting(false); // Establecer isSubmitting a false al final
      }
    }else{
      alert("Debes seleccionar ruta y autobús");
    }
  }
  
   // Procesar la cola de peticiones, se va a crear una función diferente para enviar los datos de la cola y se va a entender mejor cómo funciona
  const processQueue = async () => {
    if (isProcessingQueue || requestQueue.length === 0) return;
    setIsProcessingQueue(true);
      let backupQueue = []
     for (let i = 0; i < requestQueue.length; i++) {
      const nextRequest = requestQueue[i];
      console.log(requestQueue.length);
      alert(requestQueue.length);
      const sent = await sendRequest(nextRequest, true)
    }
    setRequestQueue(backupQueue);
    setIsProcessingQueue(false);
  };
  useEffect(() => {

    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        console.log('connected')
        // processQueue();
      }else{
        console.log('not connected')
      }
    });

    return () => {
      unsubscribe();
    };
  }, [requestQueue, isProcessingQueue]);
  
  const onTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedTime;
    setShowTimePicker(false);
    setSelectedTime(currentDate);
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
    <ScrollView>
    <Screen>
      <View className="flex flex-col items-center justify-center">
        <Text className="text-2xl">Bienvenido Fiscal {user.numero}</Text>
        <Link asChild href="/scanqr">
          <Pressable className="bg-slate-400 p-2 m-4 rounded">
            <Text className="text-xl font-bold">Escánea el código QR</Text>
          </Pressable>
        </Link>
        <Pressable className="bg-slate-400 p-2 m-4 rounded" onPress={() => processQueue()}>
            <Text className="text-xl font-bold">Enviar Cola</Text>
          </Pressable>
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


        {user.sethora? <View className='m-6'>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          getRegistros.length > 0 ? (
            <View className="mt-6 p-4">
              {getRegistros.map((registro) => {
                const bus = busList.find(bus => bus._id === registro.id_unidad);
                return (
                  <View className="m-4 p-4 bg-slate-200 rounded" key={registro._id}>
                    <Text className="text-black text-black/90 mb-2 mx-4 text-lg">
                      <Text className="font-bold text-black">Control: </Text>
                      {bus ? bus.numero : 'N/A'}
                    </Text>
                    <Text className="text-black text-black/90 mb-2 mx-4 text-lg">
                      <Text className="font-bold text-black">Hora de salida: </Text>
                      {formatDate1(registro.timestamp_salida)}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <Text>No hay registros disponibles</Text>
          )
        )}
      </View>
: ''}

    </Screen>
  </ScrollView>
  );

  
}
