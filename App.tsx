import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import SectionCard from "./components/SectionCard";
import PromptChip from "./components/PromptChip";
import { getCareerAdvice } from "./services/openai";

const COLORS = {
  bg: "#0B1020",
  surface: "#121A2F",
  surfaceSoft: "#19233D",
  card: "#F8FAFC",
  text: "#0F172A",
  muted: "#64748B",
  white: "#FFFFFF",
  primary: "#3B82F6",
  primarySoft: "#DBEAFE",
  accent: "#F59E0B",
  accentSoft: "#FEF3C7",
  border: "#D6E0EA",
  success: "#10B981",
  danger: "#EF4444",
};

const examplePrompts = [
  "How do I become a cybersecurity analyst in Georgia?",
  "What certifications matter most for cloud jobs in Atlanta?",
  "What schools in Georgia are good for software development?",
  "What should a beginner in data analytics learn first in Georgia?",
];

const MAX_QUESTION_LENGTH = 280;

const formatResponse = (text: string) => {
  return text
    .replace(/\*\*/g, "")
    .replace(/^-\s+/gm, "• ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

type FormattedLine =
  | { type: "heading"; text: string }
  | { type: "bullet"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "spacer"; text: string };

const structureResponse = (text: string): FormattedLine[] => {
  const lines = formatResponse(text).split("\n");

  const knownHeadings = [
    "Recommended Path",
    "Georgia Employers",
    "Education or Certifications",
    "Salary Outlook",
    "Next Steps",
  ];

  return lines.map((raw) => {
    const line = raw.trim();

    if (!line) {
      return { type: "spacer", text: "" };
    }

    if (knownHeadings.includes(line)) {
      return { type: "heading", text: line };
    }

    if (line.startsWith("•")) {
      return { type: "bullet", text: line.replace(/^•\s*/, "") };
    }

    return { type: "paragraph", text: line };
  });
};

export default function App() {
  const [profileType, setProfileType] = useState<string>("Beginner");
  const [interestArea, setInterestArea] = useState<string>("Cybersecurity");
  const [question, setQuestion] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");

  const formattedResponse = useMemo(
    () => structureResponse(response),
    [response],
  );

  const handleSubmit = async () => {
    Keyboard.dismiss();

    if (!question.trim()) {
      setErrorText("Enter a question to get Georgia-specific career advice.");
      return;
    }

    setErrorText("");
    setLoading(true);
    setResponse("");

    try {
      const result = await getCareerAdvice({
        profileType,
        interestArea,
        question: question.trim(),
      });

      setResponse(result);
    } catch (error) {
      console.log(error);
      setResponse(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExamplePress = (prompt: string) => {
    setQuestion(prompt);
    setErrorText("");
  };

  const handleClear = () => {
    Keyboard.dismiss();
    setQuestion("");
    setResponse("");
    setErrorText("");
  };

  const responseHasContent = response.trim().length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.keyboardWrap}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.hero}>
              <View style={styles.heroTopRow}>
                <View style={styles.logoBadge}>
                  <Text style={styles.logoBadgeText}>GA</Text>
                </View>

                <View style={styles.heroPill}>
                  <Text style={styles.heroPillText}>
                    Georgia Tech Career Navigator
                  </Text>
                </View>
              </View>

              <Text style={styles.heroTitle}>TechPath GA</Text>

              <Text style={styles.heroSubtitle}>
                Personalized guidance for software, cyber, cloud, networking,
                and data careers across Georgia.
              </Text>

              <Text style={styles.heroCaption}>
                Built for Atlanta, built for growth.
              </Text>

              <View style={styles.heroStatsRow}>
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatValue}>Georgia</Text>
                  <Text style={styles.heroStatLabel}>Location Scope</Text>
                </View>
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatValue}>Tech Only</Text>
                  <Text style={styles.heroStatLabel}>Career Scope</Text>
                </View>
              </View>
            </View>

            <SectionCard
              title="Build Your Path"
              subtitle="Choose your background, pick an area of interest, and ask a Georgia-focused tech career question."
            >
              <Text style={styles.label}>Profile Type</Text>
              <View style={styles.pickerWrap}>
                <Picker
                  selectedValue={profileType}
                  onValueChange={(itemValue) => setProfileType(itemValue)}
                  dropdownIconColor={COLORS.text}
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
                  dropdownIconColor={COLORS.text}
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

              <View style={styles.labelRow}>
                <Text style={styles.label}>Question</Text>
                <Text style={styles.counter}>
                  {question.length}/{MAX_QUESTION_LENGTH}
                </Text>
              </View>

              <TextInput
                style={[styles.input, errorText ? styles.inputError : null]}
                placeholder="Ex: How do I become a cybersecurity analyst in Georgia?"
                placeholderTextColor="#94A3B8"
                value={question}
                onChangeText={(text) =>
                  setQuestion(text.slice(0, MAX_QUESTION_LENGTH))
                }
                multiline
                returnKeyType="done"
                textAlignVertical="top"
              />

              {errorText ? (
                <Text style={styles.errorText}>{errorText}</Text>
              ) : null}

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    loading ? styles.buttonDisabled : null,
                  ]}
                  onPress={handleSubmit}
                  disabled={loading}
                  activeOpacity={0.9}
                >
                  {loading ? (
                    <ActivityIndicator color={COLORS.white} />
                  ) : (
                    <Text style={styles.primaryButtonText}>Get Advice</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.secondaryButton,
                    loading ? styles.buttonDisabled : null,
                  ]}
                  onPress={handleClear}
                  disabled={loading}
                  activeOpacity={0.9}
                >
                  <Text style={styles.secondaryButtonText}>Clear</Text>
                </TouchableOpacity>
              </View>
            </SectionCard>

            <SectionCard
              title="Quick Prompts"
              subtitle="Tap a suggestion to instantly load a sample question."
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
              subtitle="Your answer appears here in a cleaner, phone-friendly format."
            >
              {loading ? (
                <View style={styles.loadingWrap}>
                  <View style={styles.loadingOrb}>
                    <ActivityIndicator size="large" color={COLORS.accent} />
                  </View>
                  <Text style={styles.loadingTitle}>Generating guidance</Text>
                  <Text style={styles.loadingText}>
                    Building a Georgia-specific response for your selected path.
                  </Text>
                </View>
              ) : !responseHasContent ? (
                <View style={styles.emptyState}>
                  <View style={styles.emptyIcon}>
                    <Text style={styles.emptyIconText}>↗</Text>
                  </View>
                  <Text style={styles.emptyTitle}>Ready when you are</Text>
                  <Text style={styles.emptySubtitle}>
                    Ask a question about a Georgia technology career path to get
                    started.
                  </Text>
                </View>
              ) : (
                <View style={styles.responseCard}>
                  <View style={styles.responseHeader}>
                    <View style={styles.responseHeaderBadge}>
                      <Text style={styles.responseHeaderBadgeText}>AI</Text>
                    </View>
                    <View>
                      <Text style={styles.responseTitle}>Career Insight</Text>
                      <Text style={styles.responseSubtitle}>
                        Tailored to your profile and interest area
                      </Text>
                    </View>
                  </View>

                  <View style={styles.responseBody}>
                    {formattedResponse.map((line, index) => {
                      if (line.type === "heading") {
                        return (
                          <Text key={index} style={styles.responseHeading}>
                            {line.text}
                          </Text>
                        );
                      }

                      if (line.type === "bullet") {
                        return (
                          <View key={index} style={styles.bulletRow}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>{line.text}</Text>
                          </View>
                        );
                      }

                      if (line.type === "spacer") {
                        return (
                          <View key={index} style={styles.responseSpacer} />
                        );
                      }

                      return (
                        <Text key={index} style={styles.responseText}>
                          {line.text}
                        </Text>
                      );
                    })}
                  </View>
                </View>
              )}
            </SectionCard>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  keyboardWrap: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 18,
    paddingBottom: 36,
  },

  hero: {
    backgroundColor: COLORS.surface,
    borderRadius: 28,
    padding: 22,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoBadge: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  logoBadgeText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
  },
  heroPill: {
    backgroundColor: "rgba(245, 158, 11, 0.14)",
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.35)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  heroPillText: {
    color: "#FCD34D",
    fontSize: 12,
    fontWeight: "700",
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: 31,
    fontWeight: "800",
    marginTop: 18,
  },
  heroSubtitle: {
    color: "#BFDBFE",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 23,
    marginTop: 10,
  },
  heroCaption: {
    color: "#CBD5E1",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
  },
  heroStatsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  heroStat: {
    flex: 1,
    backgroundColor: COLORS.surfaceSoft,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  heroStatValue: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
  },
  heroStatLabel: {
    color: "#94A3B8",
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 12,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  counter: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.muted,
  },
  pickerWrap: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#F8FAFC",
  },
  input: {
    minHeight: 132,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.text,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 8,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
  primaryButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.accentSoft,
    borderWidth: 1,
    borderColor: "#FCD34D",
  },
  buttonDisabled: {
    opacity: 0.75,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 15,
  },
  secondaryButtonText: {
    color: "#92400E",
    fontWeight: "800",
    fontSize: 15,
  },

  promptGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  loadingWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  loadingOrb: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: COLORS.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  loadingTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.text,
  },
  loadingText: {
    marginTop: 8,
    textAlign: "center",
    color: COLORS.muted,
    lineHeight: 21,
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 28,
    paddingHorizontal: 14,
  },
  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  emptyIconText: {
    fontSize: 24,
    color: COLORS.primary,
    fontWeight: "800",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },
  emptySubtitle: {
    marginTop: 8,
    textAlign: "center",
    color: COLORS.muted,
    lineHeight: 22,
  },

  responseCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  responseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  responseHeaderBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  responseHeaderBadgeText: {
    color: "#B45309",
    fontSize: 12,
    fontWeight: "800",
  },
  responseTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.text,
  },
  responseSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "600",
  },
  responseBody: {
    marginTop: 4,
  },
  responseHeading: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 8,
  },
  responseText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#334155",
    marginBottom: 8,
  },
  responseSpacer: {
    height: 6,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    paddingRight: 6,
  },
  bulletDot: {
    fontSize: 16,
    lineHeight: 23,
    color: COLORS.primary,
    marginRight: 8,
    fontWeight: "800",
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 23,
    color: "#334155",
  },
});
