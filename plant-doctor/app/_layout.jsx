import { Stack } from 'expo-router';


const RootLayout = () => {
  return (<Stack initialRouteName="index">
            <Stack.Screen name="index" options={{ title: 'Home' }} />
          </Stack>);
}

export default RootLayout;