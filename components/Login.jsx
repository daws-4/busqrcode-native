import { Screen } from "./Screen";
import { Stack } from "expo-router";
import { useState, useEffect } from "react";
import {View,Text,TextInput,Pressable} from "react-native";
import { router } from 'expo-router';
import {  Button } from "@react-native-material/core";
import { Logo1 } from "./Logo1";
import axios from "axios";
import { useUserContext, useUserToggleContext } from "../lib/AuthProvider";


//https://docs.expo.dev/router/reference/authentication/
//https://www.youtube.com/watch?v=Ae33_gdJgnQ
export function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(true);
    const togglePassword = () => setShowPassword(!showPassword);
    const user = useUserContext();
    const login = useUserToggleContext();
    console.log(user + 'usuario')
    const now = new Date();
    const submitData = async () => {
        if(username !='' && password !='') {
            console.log(now + 'hora' )
            try {
            const response = await axios.post("http://172.16.0.242:3000/api/auth/fiscales", {username, password});
            if(response.status === 200) {
                login(response.data);
            }else{
                alert("Usuario o contraseña incorrectos");
            }
        } catch (error) {
            console.error(error);
            alert("Usuario o contraseña incorrectos");
        }
    }else{
    alert("Por favor, llena todos los campos");
            }}

    return(
         <Screen>
            <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "white" },
          headerTintColor: "black",
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
                required
                placeholder="Usuario"
                value={username}
                onChangeText={setUsername}
                className='p-4 mb-4 rounded-md bg-slate-100 dark:bg-boxdark dark:text-white text-xl'
              />
              <TextInput
                required
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