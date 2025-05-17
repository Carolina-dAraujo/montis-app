import {View, Text} from 'react-native';
import React from 'react';
import {Link} from "expo-router";

const crise = () => {
    return (
        <View>
            <Link href="/login">login</Link>
            <Link href="/cadastro">cadastro</Link>
        </View>
    )
}

export default crise;