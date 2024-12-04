import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import Home from './home';
import Exp from './exp';
import DataAnalysis from './dataAnalysis';
import Report from './Report';
import Logout from './logout';

const Drawer = createDrawerNavigator();

export default function AppLayout() {

  const alldetail = useSelector((state) => state.userexplist);

  useEffect(() => {
    // console.warn("main layout", alldetail.user.imgsrc)
  }, [alldetail]);

  const CustomHeader = ({ navigation, title }) => (
    <View style={styles.header}>
      <View style={styles.left}>
        <Pressable onPress={() => navigation.toggleDrawer()} style={styles.hamburger}>
          <FontAwesome name="bars" size={24} color="black" />
          {/* <Image
            source={require('../../assets/images/menuicon.svg')}
            style={{ width: 28, height: 28 }}
            resizeMode="contain"
          /> */}
        </Pressable>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      <View style={styles.profileContainer}>
        <Image
          source={{ uri: alldetail?.user?.imgsrc }} // Replace with a valid profile image URL
          style={styles.profileImage}
        />
      </View>
    </View>
  );

  return (
    <Drawer.Navigator
      screenOptions={({ route, navigation }) => ({
        header: () => <CustomHeader navigation={navigation} title={route.name} />, // Custom Header
        drawerActiveTintColor: 'tomato',
        drawerInactiveTintColor: 'gray',
        drawerStyle: {
        width: 250, // Customize drawer width here
        backgroundColor: '#f8f9fa', // Optional: Customize background color
      },
      })}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          drawerIcon: ({ color, size }) => <FontAwesome name="home" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Exp"
        component={Exp}
        options={{
          drawerIcon: ({ color, size }) => <FontAwesome name="bank" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Data Analysis"
        component={DataAnalysis}
        options={{
          drawerIcon: ({ color, size }) => <FontAwesome name="book" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Report"
        component={Report}
        options={{
          drawerIcon: ({ color, size }) => <FontAwesome name="address-book" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Logout"
        component={Logout}
        options={{
          drawerIcon: ({ color, size }) => <FontAwesome name="sign-out" size={size} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  left: {
    flexDirection: 'row',
    width: 240,
    // borderWidth: 1,
    alignItems: 'center',
    gap: 5
  },
  hamburger: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 8,
  },
  profileName: {
    width: 80,
    fontSize: 16,
    color: '#333',
  },
});
