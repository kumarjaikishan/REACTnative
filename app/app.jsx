import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useDispatch } from 'react-redux';
import Login from './login';
import { useSelector } from 'react-redux';
import Signup from './signup';
import Layout from './tabs/layout';
import { userdata } from './store/api';
import Splash from './splash'

export {
    ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();


export default function App() {
    const dispatch = useDispatch();
    const [isAppReady, setIsAppReady] = useState(false);
    const log = useSelector((state) => state.login);

    useEffect(() => {
        const prepareApp = async () => {
          try {
            await SplashScreen.preventAutoHideAsync();
            // Simulate some async tasks (e.g., API call, font loading)
            await new Promise((resolve) => setTimeout(resolve, 5000));
          } catch (e) {
            console.warn(e);
          } finally {
            setIsAppReady(true);
            await SplashScreen.hideAsync();
          }
        };
        log.islogin && dispatch(userdata());
        prepareApp();
      }, []);

      if (!isAppReady) {
        return <Splash />; // Display your custom splash component
      }

    return (
        <>
            <Stack.Navigator
                initialRouteName={log?.islogin ? "Layout" : "Login"}
                screenOptions={{
                    headerShown: false,
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // Add slide animation
                }}
            >
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Layout" component={Layout} />
                <Stack.Screen name="Signup" component={Signup} />
            </Stack.Navigator>
        </>
    );
}
