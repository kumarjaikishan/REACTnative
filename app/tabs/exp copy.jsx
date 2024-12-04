import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { FontAwesome5, MaterialIcons } from 'react-native-vector-icons';

const AddExpenses = ({ navigation }) => {
    const dispatch = useDispatch();
    const userAllDetails = useSelector((state) => state.userexplist);
    const [searchInput, setSearchInput] = useState('');
    const [finalsearch, setfinalserach] = useState('');
    const [expenseInput, setExpenseInput] = useState({
        _id: '',
        ledger: '',
        date: '',
        amount: '',
        narration: '',
    });
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setfinalserach(searchInput.toLowerCase());
        }, 1300);

        return () => {
            clearTimeout(timerId);
        };
    }, [searchInput]);

    const handleInputChange = (e, field) => {
        setExpenseInput({
            ...expenseInput, [field]: e,
        });
    };

    const setDataForEdit = async (expense) => {
        setExpenseInput({
            _id: expense._id,
            ledger: expense.ledger._id,
            date: expense.date,
            amount: expense.amount,
            narration: expense.narration,
        });
        setIsUpdateMode(true);
        setIsModalOpen(true);
    };

    const deleteExpense = async (expenseId) => {
        // Logic for delete
    };

    const deletemanyExpense = async () => {
        // Logic for delete many
    };

    const selectAllCheckbox = () => {
        // Logic to select all checkboxes
    };

    const handlePageSizeChange = (e) => {
        // setPostsPerPage(e);
        // setCurrentPage(1);
        // setSortedList();
    };

    const changePageNumber = (pageNumber) => {
        setSortedList();
        setCurrentPage(pageNumber);
    };

    const highlight = () => {
        // Highlight checked items
    };

    const sortPosts = (column) => {
        // Sorting logic
    };

    const voucherpage = (expid) => {
        navigation.navigate(`/print/${expid}`);
    };

    const renderHeader = () => {
        return (
            <View style={[styles.row,{backgroundColor:'white'}]}>
                <Text style={styles.cell1}>S.no</Text>
                <Text style={styles.cell2}>Ledger</Text>
                <Text style={styles.cell3}>Amount</Text>
                <Text style={styles.cell4}>Narration</Text>
                <Text style={styles.cell5}>Date</Text>
                <Text style={styles.cell6}>Edit</Text>
                <Text style={styles.cell6}>Del</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.addButton} onPress={() => setIsModalOpen(true)}>
                <Text style={styles.addText}>Add Expense</Text>
            </TouchableOpacity>
            <View style={{ alignItems: 'center', paddingVertical: 10, paddingHorizontal: 2 }}>
                <Text style={{ fontSize: 25 }}>Expense List</Text>
            </View>

            <View style={styles.head}>
                <View style={styles.ledgerSelector}>
                    <Picker
                        style={{ borderWidth: 1 }}
                        selectedValue={postsPerPage}
                        onValueChange={handlePageSizeChange}
                    >
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

            <ScrollView horizontal>
                <FlatList
                    data={userAllDetails.explist}
                    keyExtractor={(item) => item._id}
                    ListHeaderComponent={renderHeader}
                    stickyHeaderIndices={[0]}  // This keeps the header row sticky
                    renderItem={({ item, index }) => (
                        <View style={styles.row}>
                            <Text style={styles.cell1}>{index + 1}</Text>
                            <Text style={styles.cell2}>{item.ledger.ledger}</Text>
                            <Text style={styles.cell3}>{item.amount}</Text>
                            <Text style={styles.cell4}>{item.narration}</Text>
                            <Text style={styles.cell5}>{dayjs(item.date).format('DD MMM, YYYY')}</Text>
                            <TouchableOpacity style={styles.cell6} onPress={() => setDataForEdit(item)}>
                                <FontAwesome5 name="edit" size={20} color="green" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cell6} onPress={() => deleteExpense(item._id)}>
                                <MaterialIcons name="delete" size={20} color="red" />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    cell1: {
        width: 32,
        textAlign: 'center',
    },
    cell2: {
        width: 80,
        textAlign: 'center',
        textTransform: 'capitalize',
    },
    cell3: {
        width: 50,
        textAlign: 'center',
    },
    cell4: {
        width: 240,
    },
    cell5: {
        width: 80,
        fontSize: 12,
        textAlign: 'center',
    },
    cell6: {
        // borderWidth: 1,
        width: 35,
        alignItems: 'center',
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
});

export default AddExpenses;
