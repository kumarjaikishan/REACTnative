import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector, useDispatch } from 'react-redux';
import { setloader } from '../store/login';
import CircularProgress from 'react-native-circular-progress-indicator';

const Datanalysis = () => {
    const dispatch = useDispatch();
    const useralldetail = useSelector((state) => state.userexplist);

    const date = new Date();
    const today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getUTCDate()}`;

    const [inp, setInp] = useState({
        date: today,
        month: date.getMonth(),
        year: date.getFullYear(),
    });

    const [cardarr, setCardarr] = useState({});

    useEffect(() => {
        cal();
        dispatch(setloader(false));
    }, [inp]);

    let ledgerSum = {};

    const cal = () => {
        useralldetail.ledgerlist.forEach((element) => {
            ledgerSum[element.ledger] = 0;
        });
        ledgerSum['total'] = 0;
        const monthIn2Digit = String(parseInt(inp.month) + 1).padStart(2, '0');
        const startdate = `${inp.year}-${monthIn2Digit}-01`;
        const enddate = `${inp.year}-${monthIn2Digit}-31`;

        useralldetail.explist.forEach((entry) => {
            let { ledger, amount, date } = entry;
            ledger = ledger.ledger; // Ledger is an object
            const amountValue = parseFloat(amount);

            if (!isNaN(amountValue) && date >= startdate && date <= enddate) {
                ledgerSum['total'] += amountValue;
                if (ledgerSum.hasOwnProperty(ledger)) {
                    ledgerSum[ledger] += amountValue;
                } else {
                    ledgerSum[ledger] = amountValue;
                }
            }
        });

        setCardarr(ledgerSum);
    };

    const handleMonthChange = (value) => {
        setInp((prev) => ({ ...prev, month: value }));
    };

    const handleYearChange = (value) => {
        setInp((prev) => ({ ...prev, year: value }));
    };

    const monname = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.selectorContainer}>
                <Picker
                    selectedValue={inp.month}
                    style={styles.picker}
                    onValueChange={(itemValue) => handleMonthChange(itemValue)}
                >
                    {monname.map((val, ind) => (
                        <Picker.Item label={val} value={ind} key={ind} />
                    ))}
                </Picker>
                <Picker
                    selectedValue={inp.year}
                    style={styles.picker}
                    onValueChange={(itemValue) => handleYearChange(itemValue)}
                >
                    {['2021', '2022', '2023', '2024', '2025'].map((year) => (
                        <Picker.Item label={year} value={year} key={year} />
                    ))}
                </Picker>
            </View>
            <View style={styles.cardsContainer}>
                {Object.entries(cardarr).map(([ledger, sum]) => {
                    let percentvalue = isNaN(Math.floor((sum / cardarr['total']) * 100))
                        ? 0
                        : Math.floor((sum / cardarr['total']) * 100)

                    return <View style={styles.card} key={ledger}>
                        <View style={styles.cardData}>
                            <Text style={styles.amount}>{sum}</Text>
                            <Text style={styles.ledger}>{ledger}</Text>
                        </View>
                        <View style={styles.icon}>
                            <CircularProgress
                                value={percentvalue}
                                radius={50}
                               duration={1000}
                                inActiveStrokeColor='#2ecc71'
                                inActiveStrokeOpacity={0.2}
                                valueSuffix='%'
                                // dashedStrokeConfig={{
                                //     count: 50,
                                //     width: 4,
                                // }}
                            />
                        </View>

                    </View>
                })}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    selectorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 40,
        borderWidth: 1,
        // height:150
    },
    picker: {
        height: 80,
        width: Dimensions.get('window').width / 2.5,
    },
    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: Dimensions.get('window').width / 2.2,
        backgroundColor: '#dbe1e6',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
    },
    cardData: {
        marginBottom: 10,
    },
    amount: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    ledger: {
        textTransform: 'capitalize',
    },
    icon: {
        alignItems: 'center',
    },
    circle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    percentage: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Datanalysis;
