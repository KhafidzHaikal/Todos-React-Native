import React from "react";
import {
  StyleSheet,
  View,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Task from "@/components/Task";

export default function HomeScreen() {
  return (
    <View style={{ padding: 20 }}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Todos</ThemedText>
      </ThemedView>
      <Task />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    textAlign: "center",
    marginTop: 50,
    padding: 20,
  },
});
