import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, Button, ActivityIndicator,
    Modal, FlatList, Alert, StyleSheet,
    TouchableOpacity, RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useSelector, useDispatch } from 'react-redux';
import dayjs, { Dayjs } from 'dayjs';
import { Swipeable } from 'react-native-gesture-handler';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MaterialIcons } from 'react-native-vector-icons';
import Toast from '../Toast'
import { userdata } from '../store/api'

const AddExpenses = ({ navigation }) => {
    const dispatch = useDispatch();
    const userAllDetails = useSelector((state) => state.userexplist);
    const [searchInput, setSearchInput] = useState('');
    const [finalsearch, setFinalSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setloading] = useState(false);
    const [isediting, setisediting]= useState(false)
    const init = {
        _id: '',
        amount: '',
        ledger: '',
        narration: '',
        datefiled: dayjs(new Date()).format('DD-MM-YYYY'),
        date: new Date(),
    }
    const [newExpense, setNewExpense] = useState(init);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const onRefresh = async () => {
        setRefreshing(true);
        await dispatch(userdata()); // Fetch updated data
        setRefreshing(false); // Stop the refresh animation
    };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        console.warn("A date has been picked: ", date);
        setNewExpense({ ...newExpense, date: date, datefiled: dayjs(date).format('DD-MM-YYYY') })
        hideDatePicker();
    };
    useEffect(() => {
        const timerId = setTimeout(() => {
            setFinalSearch(searchInput.toLowerCase());
        }, 1300);

        return () => {
            clearTimeout(timerId);
        };
    }, [searchInput]);

    const deleteExpense = (expenseId) => {
        Alert.alert('Delete Expense', 'Are you sure you want to delete this expense?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', onPress: async () => {

                    try {
                        const token = await AsyncStorage.getItem('jwtToken');
                        const res = await fetch(`https://backend-exp-man.vercel.app/api/delmany`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                id: [expenseId]
                            })
                        });

                        const data = await res.json();
                        console.log(data);

                        if (res.ok) {
                            Toast('success', "Successfull", `${data.message}`)
                            dispatch(userdata());
                        } else {
                            Toast('warning', "Wait", `${data.message}`)
                        }
                    } catch (error) {
                        console.log(error)
                        Toast('error', "Error", `${error.message}`)
                    }
                }
            },
        ]);
    };

    const editExpense = (expense) => {
        console.log(expense.amount)
        setisediting(true)
        setNewExpense({
            _id: expense._id,
            ledger: expense.ledger._id,
            date: expense.date,
            amount: expense.amount,
            narration: expense.narration,
            datefiled: dayjs(expense.date).format('DD-MM-YYYY'),
        });
        setIsModalOpen(true)

    };
    const capitalize = (value) => {
        const words = value.split(' ');
        const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
        return capitalizedWords.join(' ');
    };

    const handleAddExpense = async () => {
        let { ledger, date, amount, narration } = newExpense;

        if (!ledger || !date || !amount || !narration) {
            return Toast('warning', "Wait", "Kindly Fill all Fields")
        }
        amount= parseInt(amount);
        date = dayjs(date).format('YYYY-MM-DD')
        setloading(true)

        try {
            const token = await AsyncStorage.getItem('jwtToken');
            const res = await fetch(`https://backend-exp-man.vercel.app/api/addexpense`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ledger,
                    date,
                    amount,
                    narration: capitalize(narration)
                })
            });

            const data = await res.json();
            console.log(data);

            setloading(false)
            if (res.ok) {
                Toast('success', "Successfull", `${data.message}`)
                setIsModalOpen(false);
                setNewExpense(init);
                dispatch(userdata());
            } else {
                Toast('warning', "Wait", `${data.message}`)
            }
        } catch (error) {
            console.log(error)
            setloading(false);
            Toast('error', "Error", `${error.message}`)
        }
    };
    const handleexpupdate = async () => {
        let { _id,ledger, date, amount, narration } = newExpense;

        if (!ledger || !date || !amount || !narration) {
            return Toast('warning', "Wait", "Kindly Fill all Fields")
        }
        amount= parseInt(amount);
        date = dayjs(date).format('YYYY-MM-DD')
        setloading(true)

        try {
            const token = await AsyncStorage.getItem('jwtToken');
            const res = await fetch(`https://backend-exp-man.vercel.app/api/updateexp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    _id,
                    ledger,
                    date,
                    amount,
                    narration: capitalize(narration)
                })
            });

            const data = await res.json();
            console.log(data);

            setloading(false)
            if (res.ok) {
                Toast('success', "Successfull", `${data.message}`)
                setIsModalOpen(false);
                setNewExpense(init);
                dispatch(userdata());
            } else {
                Toast('warning', "Wait", `${data.message}`)
            }
        } catch (error) {
            console.log(error)
            setloading(false);
            Toast('error', "Error", `${error.message}`)
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setisediting(false)
        setNewExpense(init);
    };

    const renderRightActions = (expense) => (
        <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.editButton} onPress={() => editExpense(expense)}>
                <MaterialIcons name="edit" size={24} color="#4CAF50" />
                <Text style={[styles.actionText, { color: "#4CAF50" }]}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteExpense(expense._id)}>
                <MaterialIcons name="delete" size={24} color="#F44336" />
                <Text style={[styles.actionText, { color: "#F44336" }]}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    const renderRow = ({ item }) => (
        <Swipeable renderRightActions={() => renderRightActions(item)}>
            <View style={styles.row}>
                <View style={styles.cell1}>
                    <Text style={{ fontSize: 18, paddingHorizontal: 5 }}>{item.amount}</Text>
                </View>
                <View style={styles.cell2}>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: '50px', flex: 1 }}>
                        <Text style={{ fontSize: 16, textTransform: 'capitalize' }}>{item.ledger.ledger}</Text>
                        <Text style={{ fontSize: 14 }}>{dayjs(item.date).format('DD-MM-YYYY')}</Text>
                    </View>
                    <View style={{ paddingVertical: 4, paddingHorizontal: 1 }}>
                        <Text style={{ fontSize: 13 }}>{item.narration}</Text>
                    </View>
                </View>
            </View>
        </Swipeable>
    );

    const filteredExpenses = userAllDetails.explist.filter((expense) => {
        const searchText = finalsearch.toLowerCase();
        return (
            expense.amount.toString().includes(searchText) ||
            expense.ledger.ledger.toLowerCase().includes(searchText) ||
            expense.narration.toLowerCase().includes(searchText)
        );
    });


    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.addButton} onPress={() => setIsModalOpen(true)}>
                <Text style={styles.addText}>Add Expense</Text>
            </TouchableOpacity>

            <Modal visible={isModalOpen} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Expense</Text>

                        <View style={styles.modalInput1}>
                            <Picker
                                style={{ borderWidth: 1 }}
                                selectedValue={newExpense.ledger}
                                onValueChange={(text) => setNewExpense({ ...newExpense, ledger: text })}
                            >
                                {userAllDetails?.ledgerlist?.map((val, ind) => {
                                    return <Picker.Item key={ind} style={{ textTransform: 'capitalize' }} label={val.ledger} value={val._id} />;
                                })}
                            </Picker>
                        </View>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Amount"
                            value={newExpense.amount.toString()}
                            keyboardType="numeric"
                            onChangeText={(text) => setNewExpense({ ...newExpense, amount: text })}
                        />
                        <TouchableOpacity onPress={showDatePicker}>
                            <TextInput
                                style={styles.modalInput}
                                value={newExpense.datefiled}
                                placeholder="Select Date"
                                editable={false}
                            />
                        </TouchableOpacity>

                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            value={newExpense.date}
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Narration"
                            value={newExpense.narration}
                            onChangeText={(text) => setNewExpense({ ...newExpense, narration: text })}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.submitButton} onPress={isediting ? handleexpupdate: handleAddExpense}>
                                {loading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>{isediting ? "Update":"Submit"}</Text>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={styles.head}>
                <View style={styles.ledgerSelector}>
                    <Picker style={{ borderWidth: 1 }} selectedValue={10} onValueChange={() => { }}>
                        <Picker.Item label="10" value="10" />
                        <Picker.Item label="20" value="20" />
                        <Picker.Item label="50" value="50" />
                        <Picker.Item label="100" value="100" />
                        <Picker.Item label="500" value="500" />
                        <Picker.Item label="ALL" value="5000" />
                    </Picker>
                </View>
                <View style={{ flex: 1 }}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Type to search..."
                        value={searchInput}
                        onChangeText={(text) => setSearchInput(text)}
                    />
                </View>
            </View>
            <View style={{ alignItems: 'center', paddingVertical: 10, paddingHorizontal: 2 }}>
                <Text style={{ fontSize: 25 }}>Expense List</Text>
            </View>

            <FlatList
                data={filteredExpenses}
                keyExtractor={(item) => item._id}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                renderItem={renderRow} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    row: {
        flexDirection: 'row',
        borderWidth: 1,
        marginBottom: 5,
        flex: 1,
        paddingHorizontal: 3,
        paddingVertical: 8,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: 'white',
    },
    cell1: {
        flex: 1,
    },
    cell2: {
        flex: 6,
    },
    addButton: {
        marginBottom: 16,
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
    },
    addText: {
        color: 'white',
        textAlign: 'center',
    },
    ledgerSelector: {
        width: 120,
        margin: 5,
        height: 30,
    },
    head: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 8,
        flex: 1,
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    editButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: '80%',
    },
    deleteButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: '80%',
    },
    actionText: {
        color: 'white',
        fontSize: 12,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '90%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 8,
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
    },
    modalInput1: {
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 15,
        borderRadius: 5,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    submitButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 5,
    },
    cancelButton: {
        backgroundColor: '#F44336',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginLeft: 5,
    },
});

export default AddExpenses;
