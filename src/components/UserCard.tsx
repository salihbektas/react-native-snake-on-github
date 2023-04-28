import React from "react"
import { Image, StyleSheet, Text, View } from "react-native"

function UserCard({ userName, nickName, avatar }: { userName: string, nickName: string, avatar: string }) {

  return (
    <View style={styles.main}>
      <View style={{}}>
        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.nickName}>{nickName}</Text>
      </View>
      <Image src={avatar} style={styles.avatar} />
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    marginLeft: 'auto',
    marginVertical: 16
  },

  name: {
    color: 'white',
    fontSize: 24
  },

  nickName: {
    color: 'gray',
    fontSize: 20
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginLeft: 16
  }
});

export default UserCard;