import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import SectionCard from "./components/SectionCard";
import { getCareerAdvice } from "./services/openai";

const examplePrompts = [
  "How do I become a cybersecurity analyst in Georgia?",
  "What certifications are valued in Atlanta tech jobs?",
  "What Georgia schools are good for software development?",
  "What is the best nursing career in Florida?",
];

export default function App() {
  const [profileType, setProfileType] = useState<string>("Beginner");
  const [interestArea, setInterestArea] = useState<string>("Cybersecurity");
  const [question, setQuestion] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!question.trim()) {
      Alert.alert("Missing question", "Please enter a question first.");
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      const result = await getCareerAdvice({
        profileType,
        interestArea,
        question,
      });

      setResponse(result);
    } catch (error) {
      console.log(error);
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      setResponse(message);
    } finally {
      setLoading(false);
    }
  };

  const handleExamplePress = (prompt: string) => {
    setQuestion(prompt);
  };

  const handleClear = () => {
    setQuestion("");
    setResponse("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>TechPath GA</Text>
        <Text style={styles.subtitle}>Georgia Tech Career Advisor</Text>

        <SectionCard>
          <Text style={styles.label}>Profile Type</Text>
          <View style={styles.pickerWrap}>
            <Picker
              selectedValue={profileType}
              onValueChange={(itemValue) => setProfileType(itemValue)}
            >
              <Picker.Item label="Beginner" value="Beginner" />
              <Picker.Item label="Career-changer" value="Career-changer" />
              <Picker.Item
                label="Experienced professional"
                value="Experienced professional"
              />
            </Picker>
          </View>

          <Text style={styles.label}>Interest Area</Text>
          <View style={styles.pickerWrap}>
            <Picker
              selectedValue={interestArea}
              onValueChange={(itemValue) => setInterestArea(itemValue)}
            >
              <Picker.Item
                label="Software Development"
                value="Software Development"
              />
              <Picker.Item label="Cybersecurity" value="Cybersecurity" />
              <Picker.Item label="Data / AI" value="Data / AI" />
              <Picker.Item label="Cloud / IT" value="Cloud / IT" />
              <Picker.Item label="Networking" value="Networking" />
            </Picker>
          </View>

          <Text style={styles.label}>Ask a Georgia tech career question</Text>
          <TextInput
            style={styles.input}
            placeholder="Example: How do I become a cybersecurity analyst in Georgia?"
            placeholderTextColor="#888"
            value={question}
            onChangeText={setQuestion}
            multiline
          />

          <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
            <Text style={styles.primaryButtonText}>Get Advice</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleClear}
          >
            <Text style={styles.secondaryButtonText}>Clear</Text>
          </TouchableOpacity>
        </SectionCard>

        <SectionCard>
          <Text style={styles.sectionTitle}>Quick Examples</Text>
          {examplePrompts.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.exampleButton}
              onPress={() => handleExamplePress(item)}
            >
              <Text style={styles.exampleText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </SectionCard>

        <SectionCard>
          <Text style={styles.sectionTitle}>Response</Text>
          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" />
              <Text style={styles.loadingText}>Generating advice...</Text>
            </View>
          ) : (
            <Text style={styles.responseText}>
              {response || "Your Georgia career guidance will appear here."}
            </Text>
          )}
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7fb",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 8,
    color: "#111827",
  },
  subtitle: {
    textAlign: "center",
    color: "#4b5563",
    marginBottom: 20,
    fontSize: 15,
  },
  label: {
    fontWeight: "700",
    marginBottom: 6,
    marginTop: 10,
    color: "#111827",
  },
  pickerWrap: {
    borderWidth: 1,
    borderColor: "#d9dfe8",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fafafa",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d9dfe8",
    borderRadius: 10,
    padding: 12,
    minHeight: 120,
    textAlignVertical: "top",
    backgroundColor: "#fafafa",
    color: "#111827",
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: "#1f6feb",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 16,
  },
  secondaryButton: {
    marginTop: 10,
    backgroundColor: "#6b7280",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
    color: "#111827",
  },
  exampleButton: {
    padding: 12,
    backgroundColor: "#eef4ff",
    borderRadius: 10,
    marginBottom: 10,
  },
  exampleText: {
    color: "#1e3a5f",
    fontWeight: "600",
  },
  loadingWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#4b5563",
  },
  responseText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#222222",
  },
});
