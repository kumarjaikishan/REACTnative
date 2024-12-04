import { View, Text } from 'react-native'
import React from 'react'
import { createNotifications } from 'react-native-notificated';

const Toast = (type,title,description) => {
    const { useNotifications } = createNotifications();
    const { notify } = useNotifications();
    
    notify(type, {
        params: {
            title: title,
            description: description,
        },
    });
}

export default Toast