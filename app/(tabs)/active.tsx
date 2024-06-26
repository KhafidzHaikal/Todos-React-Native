import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Button,
  View,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { supabase } from "@/utils/supabase";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function ActiveScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const getTodos = async () => {
      try {
        const { data: todos, error } = await supabase.from("todos").select("*").eq('completed', false);

        if (todos && todos.length > 0) {
          setTodos(todos);
        }
      } catch (error: any) {
        console.error("Error fetching todos:", error.message);
      }
    };

    getTodos();
  }, []);

  const onDelete = async (id: number) => {
    try {
      await supabase.from("todos").delete().eq("id", id);
    } catch (error: any) {
      console.error("Error updating todo:", error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Todos Active</ThemedText>
      </ThemedView>
      {todos.map((index, item) => (
        <View style={styles.todoList}>
          <ThemedText style={styles.textItem} key={item}>
            {index.title}
          </ThemedText>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}>
            <View
              style={{
                backgroundColor: "green",
                borderRadius: 5,
                marginRight: 5,
              }}>
              <Button
                title={index.completed ? "Selesai" : "Complete"}
                color={index.completed ? "green" : "orange"}
                accessibilityLabel={
                  index.completed ? "Todo already completed" : "Finish Todo"
                }
              />
            </View>
            <View style={{ backgroundColor: "red", borderRadius: 5 }}>
              <Button
                onPress={() => onDelete(index.id)}
                title="Delete"
                color="red"
                accessibilityLabel="Delete Todo"
              />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    textAlign: "center",
    marginTop: 50,
    padding: 20,
  },
  todoList: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  textItem: {
    textTransform: "capitalize",
  },
});
