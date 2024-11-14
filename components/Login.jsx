import { Screen } from "./Screen";
import { Stack } from "expo-router";
import { useState } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  TextInput,
  Image,
  Animated,
  Pressable,
} from "react-native";
import {  Button } from "@react-native-material/core";
import { Logo1 } from "./Logo1";
export function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(true);

    const submitData = async () => {
        try {
            console.log("submitData");
            alert(username+ password);
            // const response = await axios.posty("http://localhost:3000/api/app/fiscales", {username, password});
            // const data = await response.json();
            // console.log(data);
        } catch (error) {
            
            console.error(error);
        }

    }

    return(
         <Screen>
            <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#7e9aff" },
          headerTintColor: "white",
          headerLeft: () => {},
          headerTitle: "Inicia Sesión como Fiscal",
          headerRight: () => {},
        }}
        />
        <View className='flex flex-cols justify-center items-center'>
        <Logo1/>
        <Text className='text-xl'>Línea Santa Teresa</Text>
        </View>
         <View className='mb-10 rounded-sm bg-slate-200 shadow-default dark:border-strokedark dark:bg-boxdark'>
          <View className='flex justify-center items-center m-5'>
            <Text className='font-bold text-3xl m-2'>Inicia Sesión</Text>
            <View className='w-full mt-4'>
              <TextInput
                placeholder="Usuario"
                value={username}
                onChangeText={setUsername}
                className='p-4 mb-4 rounded-md bg-slate-100 dark:bg-boxdark dark:text-white text-xl'
              />
              <TextInput
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={showPassword}
                className='p-4 mb-4 rounded-md bg-slate-100 dark:bg-boxdark dark:text-white text-xl'
              />
            </View>
            <Pressable className='p-2 m-4 bg-green-700 rounded border-2 border-green-800 ' title='click me' onPress={() => submitData()}>
                <Text className='text-white text-lg' >Iniciar Sesión</Text>
            </Pressable>
          </View>
        </View> 
        </Screen>
    )
}