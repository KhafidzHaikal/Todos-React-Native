import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Button,
  View,
  TextInput,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  useRoute,
  useNavigation,
} from "@react-navigation/native";
import { supabase } from "../utils/supabase";
import { useRouter } from "expo-router";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const Task = () => {
  const [title, setTitle] = useState("");
  const [completed, setCompleted] = useState(true);
  const [todoList, setTodoList] = useState([{ title: "", completed: false }]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const { data, error } = await supabase.from("todos").select("*");
    setRefreshing(false);
    if (error) {
      console.error(error);
    } else {
      setTodos(data);
    }
  };

  const route = useRoute();
  const currentTab = route.name;

  const routes = useRouter();
  const onHandleTodos = async () => {
    const newTodo = { title, completed };
    try {
      const { data, error } = await supabase.from("todos").insert([newTodo]);
      if (error) {
        console.error(error);
      } else {
        setTodoList([...todos, newTodo]);
        setTitle("");
        setCompleted(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onComplete = React.useCallback(
    async (id: number) => {
      setRefreshing(true);
      await supabase.from("todos").update({ completed: true }).eq("id", id);
      setRefreshing(false);
    },
    [todos]
  );

  const onDelete = async (id: number) => {
    try {
      await supabase.from("todos").delete().eq("id", id);
    } catch (error: any) {
      console.error("Error updating todo:", error.message);
    }
  };

  return (
    <View>
      {currentTab === "index" && (
        <>
          <ThemedView style={styles.stepContainer}>
            <View style={styles.formTable}>
              <TextInput
                style={{ height: 40, width: 200 }}
                placeholder="Masukkan Title"
                value={title}
                onChangeText={(text) => (setTitle(text), setCompleted(false))}
              />
              <Button
                onPress={() => onHandleTodos()}
                title="Add"
                color="black"
                accessibilityLabel="Tambah Todo"
              />
            </View>
          </ThemedView>
        </>
      )}
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
                backgroundColor: index.completed ? "green" : "yellow",
                borderRadius: 5,
                marginRight: 5,
              }}>
              <Button
                onPress={() => (index.completed ? null : onComplete(index.id))}
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
};

export default Task;

const styles = StyleSheet.create({
  titleContainer: {
    textAlign: "center",
    marginTop: 100,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
  },
  dataList: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  formTable: {
    flexDirection: "row",
    justifyContent: "space-between",
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
