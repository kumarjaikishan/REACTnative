import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    TouchableOpacity,
    StyleSheet,
    Alert, ScrollView
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DataTable } from 'react-native-paper';

const Report = () => {
    const dispatch = useDispatch();
    const useralldetail = useSelector((state) => state.userexplist);
    const [issearch, setissearch] = useState(false);
    const [pious, setpious] = useState([]);
    const [inp, setinp] = useState({
        from: new Date().toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0],
        ledger: "all",
    });

    const [showFromDate, setShowFromDate] = useState(false);
    const [showToDate, setShowToDate] = useState(false);

    // Pagination state
    const [page, setPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const handler = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setinp((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const search = () => {
        setissearch(true);
        let searchitem = [];
        if (inp.ledger === "all") {
            searchitem = useralldetail.explist.filter((val) => {
                return val.date >= inp.from && val.date <= inp.to;
            });
        } else {
            searchitem = useralldetail.explist.filter((val) => {
                return val.date >= inp.from && val.date <= inp.to && val.ledger.ledger === inp.ledger;
            });
        }
        setpious(searchitem);
    };

    const clearsearch = () => {
        setissearch(false);
        setinp({
            from: new Date().toISOString().split('T')[0],
            to: new Date().toISOString().split('T')[0],
            ledger: "all",
        });
    };

    const print = () => {
        Alert.alert('Print functionality not implemented');
    };

    useEffect(() => {
        search();
    }, [inp]);

    const handleMonthChange = (value) => {
        setinp((prev) => ({ ...prev, ledger: value }));
    };

    const formatDate = (date) => {
        let daten = new Date(date);
        return `${String(daten.getDate()).padStart(2, '0')} ${daten.toLocaleString('default', { month: 'short' })}, ${daten.getFullYear().toString().substr(-2)}`;
    };

    const onDateChange = (event, selectedDate, type) => {
        const currentDate = selectedDate || inp[type];
        if (type === 'from') {
            setinp((prev) => ({ ...prev, from: currentDate.toISOString().split('T')[0] }));
            setShowFromDate(false);
        } else if (type === 'to') {
            setinp((prev) => ({ ...prev, to: currentDate.toISOString().split('T')[0] }));
            setShowToDate(false);
        }
    };

    // Pagination logic
    const paginatedData = pious.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

    return (
        <View style={styles.report}>
            <View style={styles.cont}>
                <View style={styles.filterContainer}>
                    <Text>From:</Text>
                    <TouchableOpacity onPress={() => setShowFromDate(true)}>
                        <TextInput
                            style={styles.input}
                            value={inp.from}
                            placeholder="YYYY-MM-DD"
                            editable={false}
                        />
                    </TouchableOpacity>
                    {showFromDate && (
                        <DateTimePicker
                            testID="dateTimePickerFrom"
                            value={new Date(inp.from)}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => onDateChange(event, selectedDate, 'from')}
                        />
                    )}

                    <Text>To:</Text>
                    <TouchableOpacity onPress={() => setShowToDate(true)}>
                        <TextInput
                            style={styles.input}
                            value={inp.to}
                            placeholder="YYYY-MM-DD"
                            editable={false}
                        />
                    </TouchableOpacity>
                    {showToDate && (
                        <DateTimePicker
                            testID="dateTimePickerTo"
                            value={new Date(inp.to)}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => onDateChange(event, selectedDate, 'to')}
                        />
                    )}

                    <View style={styles.ledgerSelector}>
                        <Text>Ledger</Text>
                        <Picker
                            selectedValue={inp.ledger}
                            onValueChange={(itemValue) => handleMonthChange(itemValue)}
                        >
                            <Picker.Item label="All" value="all" />
                            {useralldetail.ledgerlist.map((val, ind) => (
                                <Picker.Item label={val.ledger} value={val.ledger} key={ind} />
                            ))}
                        </Picker>
                    </View>
                    <Button title="Clear Search" onPress={clearsearch} disabled={!issearch} />

                </View>
                <View style={styles.buttonContainer}>
                    {/* <CSVLink data={pious} filename="expense-record.csv"> */}
                    <Button title="Download CSV" onPress={() => { }} />
                    {/* </CSVLink> */}
                    <Button title="Print" onPress={print} />
                </View>
            </View>

            <View style={styles.table}>
                <Text style={styles.head}>Report from {formatDate(inp.from)} to {formatDate(inp.to)}</Text>

                {/* Horizontal and Vertical ScrollView */}
                <ScrollView horizontal>
                    <ScrollView style={styles.verticalScroll} nestedScrollEnabled>
                        <DataTable>
                            {/* Table Header */}
                            <DataTable.Header>
                                <DataTable.Title style={styles.cell1}>S.No</DataTable.Title>
                                <DataTable.Title style={styles.cell2}>Ledger</DataTable.Title>
                                <DataTable.Title style={styles.cell3}>Amount</DataTable.Title>
                                <DataTable.Title style={styles.cell4}>Narration</DataTable.Title>
                                <DataTable.Title style={styles.cell5}>Date</DataTable.Title>
                            </DataTable.Header>

                            {/* Table Rows */}
                            {pious.map((item, index) => (
                                <DataTable.Row key={index} style={styles.row}>
                                    <DataTable.Cell style={styles.cell1}>{index + 1}</DataTable.Cell>
                                    <DataTable.Cell style={styles.cell2}>{item.ledger.ledger}</DataTable.Cell>
                                    <DataTable.Cell style={styles.cell3}>{item.amount}</DataTable.Cell>
                                    <DataTable.Cell style={styles.cell4}>
                                        <Text>{item.narration}</Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell style={styles.cell5}>{formatDate(item.date)}</DataTable.Cell>
                                </DataTable.Row>
                            ))}
                        </DataTable>
                    </ScrollView>
                </ScrollView>

                {/* Table Footer */}
                <View style={styles.footer}>
                    <Text>Total: {pious.reduce((acc, item) => acc + item.amount, 0)}</Text>
                </View>
            </View>


        </View>
    );
};

const styles = StyleSheet.create({
    report: { flex: 1, padding: 10 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 5, margin: 5, borderRadius: 5, width: 120 },
    cont: {
        position: 'relative',
        paddingBottom: 10,
    },
    filterContainer: {
        borderWidth: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginBottom: 10,
        height: "auto"
    },
    ledgerSelector: {
        width: 200,
        margin: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10
    },
    table: {
        borderWidth: 1,
        marginTop: 10,
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        // height: 80,
    },
    cell1: {
        width: 32,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    cell2: {
        width: 80,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    cell3: {
        width: 50,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    cell4: {
        width: 240,
        // borderWidth: 1,
        flexWrap: 'wrap', 
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    cell5: {
        justifyContent: 'center',
        width: 75,
        alignItems: 'flex-start',
    },
    verticalScroll: {
        maxHeight: 500,
    },
    head: {
        fontWeight: 'bold',
        marginBottom: 10,
    },
    footer: {
        marginTop: 20,
        textAlign: 'right',
    },
});


export default Report;
