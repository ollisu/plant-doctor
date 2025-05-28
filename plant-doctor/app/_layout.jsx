import { Stack } from 'expo-router';


const RootLayout = () => {
  return (<Stack initialRouteName="login">
            <Stack.Screen name="login" options={{ title: 'Login' }} />
          </Stack>);
}

export default RootLayout;