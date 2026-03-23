import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type PromptChipProps = {
  label: string;
  onPress: () => void;
};

export default function PromptChip({ label, onPress }: PromptChipProps) {
  return (
    <TouchableOpacity
      style={styles.chip}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={styles.chipText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#dbe3ef",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minWidth: "48%",
    flexGrow: 1,
  },
  chipText: {
    color: "#1e293b",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
});
