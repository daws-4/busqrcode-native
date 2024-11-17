import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export const CircleInfoIcon = (props) => (
  <FontAwesome6 name="circle-info" size={24} color="black" {...props} />
);

export const HomeIcon = (props) => (
  <FontAwesome name="home" size={32} color="black" {...props} />
);

export const InfoIcon = (props) => (
  <FontAwesome name="info" size={32} color="black" {...props} />
);

export const ScannerIcon = (props) => (
  <MaterialIcons name="qr-code-scanner" size={32} color="black" {...props} />
)

export const LogoutIcon = (props) => (
  <MaterialIcons name="logout" size={32} color="black" {...props}/>
)