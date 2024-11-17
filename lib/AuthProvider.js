import { router } from "expo-router";
import React, { useState, useContext } from "react";

const userContext = React.createContext();
const userToggleContext = React.createContext();
const userLogoutContext = React.createContext();
const rutaContext = React.createContext();
const rutaToggleContext = React.createContext();

export function useRutaContext() {
  return useContext(rutaContext);
}

export function useRutaToggleContext() {
  return useContext(rutaToggleContext);
}

export function useUserContext() {
  return useContext(userContext);
}

export function useUserToggleContext() {
  return useContext(userToggleContext);
}

export function useUserLogoutContext() {
  return useContext(userLogoutContext);
}

export function UserProvider(props) {
  const [user, setUser] = useState(null);
  const [rutas, setRutas] = useState([]);
  console.log(user + 'authprovider1')

  const Login = (data) => {
    setUser(data)
    console.log(user + 'authprovider')
  };
  const Logout = () => {
    console.log(user + 'auth')
    setUser(null);
    router.push("/");
  };
  const ruta = (data) => {
    setRutas(data)
  };

  return (

    <userContext.Provider value={user}>
      <userToggleContext.Provider value={Login}>
        <userLogoutContext.Provider value={Logout}>
          <rutaContext.Provider value={rutas}>
            <rutaToggleContext.Provider value={ruta}>
        {props.children}
            </rutaToggleContext.Provider>
          </rutaContext.Provider>
        </userLogoutContext.Provider>
      </userToggleContext.Provider>
    </userContext.Provider>
  );
}
