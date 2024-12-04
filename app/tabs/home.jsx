import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList,ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { header, setloader } from '../store/login';
import { TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

const Home = () => {
  const useralldetail = useSelector((state) => state.userexplist);
  const [arr, setArr] = useState([]);

  useEffect(() => {
    if (useralldetail.explist) load();
  }, [useralldetail]);

  const getFormattedDate = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const today = getFormattedDate(new Date());
  const yesterday = getFormattedDate(new Date(new Date().setDate(new Date().getDate() - 1)));
  const lastWeek = getFormattedDate(new Date(new Date().setDate(new Date().getDate() - 7)));
  const lastMonth = getFormattedDate(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const lastYear = getFormattedDate(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));

  const load = () => {
    let totalsum = 0,
      todaysum = 0,
      yestersum = 0,
      weeksum = 0,
      monthsum = 0,
      yearsum = 0;

    useralldetail.explist.forEach((val) => {
      if (val.date === today) todaysum += val.amount;
      if (val.date === yesterday) yestersum += val.amount;
      if (val.date >= lastWeek && val.date <= today) weeksum += val.amount;
      if (val.date >= lastMonth && val.date <= today) monthsum += val.amount;
      if (val.date >= lastYear && val.date <= today) yearsum += val.amount;
      totalsum += val.amount;
    });

    setArr([
      { amt: todaysum, day: 'Today', icon: 'rupee' },
      { amt: yestersum, day: 'Yesterday', icon: 'bolt' },
      { amt: weeksum, day: 'Last Week', icon: 'shopping-bag' },
      { amt: monthsum, day: 'Last Month', icon: 'google-wallet' },
      { amt: yearsum, day: 'Last Year', icon: 'balance-scale' },
      { amt: totalsum, day: 'Total', icon: 'university' },
    ]);
  };

  if(useralldetail.loading){
    return  <ActivityIndicator style={{flex:1}} size={60} color="black" />
  }

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.data}>
        <Text style={styles.amount}>{item.amt}</Text>
        <Text style={styles.day}>{item.day}</Text>
      </View>
      <View style={styles.icon}>
        <Icon name={item.icon} size={70} color="grey" />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={arr}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderCard}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
  },
  card: {
    // flex: 0.8,
    width: '95%',
    flexDirection: 'row',
    backgroundColor: '#dbe1e6',
    marginBottom: 20,
    marginHorizontal: 'auto',
    padding: 15,
    borderRadius: 8,
    // elevation: 5,
    boxShadow: '5px 5px 10px rgba(0,0,0,0.2)'
  },
  data: {
    flex: 2,
    justifyContent: 'center',
  },
  amount: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  day: {
    fontSize: 18,
    color: '#555',
  },
  icon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
