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
import PromptChip from "./components/PromptChip";
import { getCareerAdvice } from "./services/openai";

const examplePrompts = [
  "How do I become a cybersecurity analyst in Georgia?",
  "What certifications are valued in Atlanta tech jobs?",
  "What Georgia schools are best for software development?",
  "What entry-level cloud jobs are hiring in Atlanta?",
];

const formatResponse = (text: string) => {
  return text
    .replace(/\*\*/g, "")
    .replace(/^- /gm, "• ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

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
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroTopRow}>
            <View style={styles.brandBadge}>
              <Text style={styles.brandBadgeText}>GA</Text>
            </View>
            <View style={styles.heroTag}>
              <Text style={styles.heroTagText}>Career Advisor</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>TechPath GA</Text>
          <Text style={styles.heroSubtitle}>
            Georgia-focused guidance for tech careers, certifications, degree
            paths, and employer-aligned next steps.
          </Text>

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatCard}>
              <Text style={styles.heroStatValue}>Georgia</Text>
              <Text style={styles.heroStatLabel}>Scope Locked</Text>
            </View>
            <View style={styles.heroStatCard}>
              <Text style={styles.heroStatValue}>CS + Tech</Text>
              <Text style={styles.heroStatLabel}>Career Focus</Text>
            </View>
          </View>
        </View>

        <SectionCard
          title="Build Your Path"
          subtitle="Choose your background and ask a Georgia-specific tech career question."
        >
          <Text style={styles.label}>Profile Type</Text>
          <View style={styles.pickerWrap}>
            <Picker
              selectedValue={profileType}
              onValueChange={(itemValue) => setProfileType(itemValue)}
              dropdownIconColor="#1f2937"
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
              dropdownIconColor="#1f2937"
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

          <Text style={styles.label}>Question</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: How do I become a cybersecurity analyst in Georgia?"
            placeholderTextColor="#94a3b8"
            value={question}
            onChangeText={setQuestion}
            multiline
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.primaryButton,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>Get Advice</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.secondaryButton,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleClear}
              disabled={loading}
            >
              <Text style={styles.secondaryButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </SectionCard>

        <SectionCard
          title="Quick Prompts"
          subtitle="Tap a suggested question to fill the input instantly."
        >
          <View style={styles.promptGrid}>
            {examplePrompts.map((item, index) => (
              <PromptChip
                key={index}
                label={item}
                onPress={() => handleExamplePress(item)}
              />
            ))}
          </View>
        </SectionCard>

        <SectionCard
          title="Career Insight"
          subtitle="Your response will appear here in a clean, readable format."
        >
          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color="#2563eb" />
              <Text style={styles.loadingText}>Generating advice...</Text>
            </View>
          ) : !response ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Text style={styles.emptyIconText}>↗</Text>
              </View>
              <Text style={styles.emptyTitle}>Ready when you are</Text>
              <Text style={styles.emptySubtitle}>
                Select a profile, choose an interest area, and ask a question to
                get started.
              </Text>
            </View>
          ) : (
            <View style={styles.responseCard}>
              <View style={styles.responseHeader}>
                <View style={styles.responseHeaderBadge}>
                  <Text style={styles.responseHeaderBadgeText}>AI</Text>
                </View>
                <Text style={styles.responseTitle}>Career Insight</Text>
              </View>

              <Text style={styles.responseText}>
                {formatResponse(response)}
              </Text>
            </View>
          )}
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#edf2f7",
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 18,
    paddingBottom: 36,
  },
  hero: {
    backgroundColor: "#0f172a",
    borderRadius: 24,
    padding: 22,
    marginBottom: 16,
    shadowColor: "#0f172a",
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brandBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },
  brandBadgeText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 16,
  },
  heroTag: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  heroTagText: {
    color: "#e2e8f0",
    fontWeight: "700",
    fontSize: 12,
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "800",
    marginTop: 18,
  },
  heroSubtitle: {
    color: "#cbd5e1",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  heroStatsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
  heroStatCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  heroStatValue: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
  heroStatLabel: {
    color: "#94a3b8",
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
    marginTop: 12,
  },
  pickerWrap: {
    borderWidth: 1,
    borderColor: "#dbe3ef",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#f8fafc",
  },
  input: {
    minHeight: 130,
    borderWidth: 1,
    borderColor: "#dbe3ef",
    borderRadius: 14,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 14,
    paddingVertical: 14,
    textAlignVertical: "top",
    fontSize: 15,
    color: "#0f172a",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: "#2563eb",
  },
  secondaryButton: {
    backgroundColor: "#e2e8f0",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
  },
  secondaryButtonText: {
    color: "#0f172a",
    fontWeight: "800",
    fontSize: 15,
  },
  promptGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  loadingWrap: {
    paddingVertical: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#475569",
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 26,
    paddingHorizontal: 12,
  },
  emptyIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#e0ecff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyIconText: {
    fontSize: 24,
    color: "#2563eb",
    fontWeight: "800",
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0f172a",
  },
  emptySubtitle: {
    marginTop: 8,
    textAlign: "center",
    color: "#64748b",
    lineHeight: 21,
  },
  responseCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#dbe3ef",
  },
  responseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  responseHeaderBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  responseHeaderBadgeText: {
    color: "#2563eb",
    fontSize: 12,
    fontWeight: "800",
  },
  responseTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0f172a",
  },
  responseText: {
    fontSize: 15,
    lineHeight: 26,
    color: "#334155",
    letterSpacing: 0.2,
  },
});
