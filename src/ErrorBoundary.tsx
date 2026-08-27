import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from './theme';

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Kissonde app error', error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return <View style={styles.screen}>
      <Text style={styles.title}>Não foi possível abrir esta área.</Text>
      <Text style={styles.text}>Os teus dados locais foram preservados. Tenta novamente.</Text>
      <Pressable accessibilityRole="button" onPress={() => this.setState({ hasError: false })} style={styles.button}><Text style={styles.buttonText}>Tentar novamente</Text></Pressable>
    </View>;
  }
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, padding: 28, alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.text, fontSize: 22, fontWeight: '900', textAlign: 'center' },
  text: { color: colors.muted, fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 8, marginBottom: 20 },
  button: { minHeight: 48, paddingHorizontal: 22, borderRadius: radius.md, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
});
