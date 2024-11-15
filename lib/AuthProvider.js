import React, { useState, useContext } from "react";

const userContext = React.createContext();
const userToggleContext = React.createContext();

export function useUserContext() {
  return useContext(userContext);
}

export function useUserToggleContext() {
  return useContext(userToggleContext);
}

export function UserProvider(props) {
  const [user, setUser] = useState(null);

  const cambiaLogin = (data) => {
    if (user) {
      setUser(null);
    } else if(data) {
      setUser(data);
    }
  };

  return (
    <userContext.Provider value={user}>
      <userToggleContext.Provider value={cambiaLogin}>
        {props.children}
      </userToggleContext.Provider>
    </userContext.Provider>
  );
}
