import { Screen } from "./Screen";
import { Stack, Link, Redirect } from "expo-router";
import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { Logo1 } from "./Logo1";
import axios from "axios";
import { useUserContext, useUserToggleContext } from "../lib/AuthProvider";
import { API } from '@env'
export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const togglePassword = () => setShowPassword(!showPassword);
  const user = useUserContext();
  const login = useUserToggleContext();
  console.log(user + "usuario");
  const now = new Date();
  const submitData = async () => {
    if (username != "" && password != "") {
      console.log(now + "hora");
    console.log(API + "api");
      try {
        const response = await axios.post(
          `${API}/api/auth/fiscales`,
          { username, password }
        );
        if (response.status === 200) {
          login(response.data);
          // router.push("/scaner");
        } else {
          alert("Usuario o contraseña incorrectos");
        }
      } catch (error) {
        alert("Usuario o contraseña incorrectos");
      }
    } else {
      alert("Por favor, llena todos los campos");
    }
  };
if(user!==null){
  return(
  <Redirect href="/scaner" />
)
}
  return (
    <Screen>
      <View className="flex flex-cols justify-center items-center">
        <View className="bg-white px-2 pt-10 pb-2 flex flex-row justify-between items-center border-b-2 border-stone-600 w-full">
          <Text className='text-xl'>Iniciar Sesión como Fiscal</Text>
        </View>
        <Logo1 />
        <Text className="text-xl">Línea Santa Teresa</Text>
      </View>
      <View className="mb-10 rounded-sm bg-slate-200 shadow-default dark:border-strokedark dark:bg-boxdark">
        <View className="flex justify-center items-center m-5">
          <Text className="font-bold text-3xl m-2">Inicia Sesión</Text>
          <View className="w-full mt-4">
            <TextInput
              required
              placeholder="Usuario"
              value={username}
              onChangeText={setUsername}
              className="p-4 mb-4 rounded-md bg-slate-100 dark:bg-boxdark dark:text-white text-xl"
            />
            <TextInput
              required
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={showPassword}
              className="p-4 mb-4 rounded-md bg-slate-100 dark:bg-boxdark dark:text-white text-xl"
            />
          </View>
          <Pressable
            className="p-2 m-4 bg-green-700 rounded border-2 border-green-800 "
            title="click me"
            onPress={() => submitData()}
          >
            <Text className="text-white text-lg">Iniciar Sesión</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
