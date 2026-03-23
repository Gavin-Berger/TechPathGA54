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
      activeOpacity={0.88}
    >
      <Text style={styles.chipText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: "#E0ECFF",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#93C5FD",
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    color: "#1D4ED8",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
});
