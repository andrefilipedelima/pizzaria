import { StyleSheet, Text, View, StatusBar } from 'react-native';
import Routes from './src/routes';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#1D1D2E" barStyle="light-content" translucent={ false } />
      <Routes />
    </NavigationContainer>
  );
}

