import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandLogo } from '../brand';
import { colors, radius } from '../theme';
import { PrimaryButton, ScreenTitle } from '../ui';
import { useAppState } from '../state';

export function LoginScreen() {
  const { signIn } = useAppState();
  const [memberId, setMemberId] = useState('');
  const [password, setPassword] = useState('');

  const submit = () => {
    if (!memberId.trim() || !password) {
      Alert.alert('Dados em falta', 'Introduz o teu número de membro e palavra-passe.');
      return;
    }
    signIn();
  };

  return <SafeAreaView style={styles.screen}>
    <View style={styles.brand}><BrandLogo width={220} /></View>
    <View style={styles.body}>
      <ScreenTitle eyebrow="Área de membro" title="Entrar" subtitle="Acede ao teu cartão, treinos, aulas, progresso e recompensas." />
      <Text style={styles.label}>NÚMERO DE MEMBRO</Text>
      <TextInput accessibilityLabel="Número de membro" value={memberId} onChangeText={setMemberId} autoCapitalize="characters" autoCorrect={false} placeholder="KSG-00000" placeholderTextColor={colors.slate} style={styles.input} />
      <Text style={styles.label}>PALAVRA-PASSE</Text>
      <TextInput accessibilityLabel="Palavra-passe" value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" placeholderTextColor={colors.slate} style={styles.input} returnKeyType="done" onSubmitEditing={submit} />
      <PrimaryButton label="Entrar" onPress={submit} />
      <Text style={styles.help}>Problemas para entrar? Contacta o suporte Kissonde através da receção do teu clube.</Text>
    </View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, padding: 22, justifyContent: 'space-between' },
  brand: { paddingTop: 18, alignItems: 'center' },
  body: { paddingBottom: 30 },
  label: { color: colors.muted, fontSize: 12, fontWeight: '900', letterSpacing: .8, marginBottom: 7, marginTop: 8 },
  input: { height: 52, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.panel, borderRadius: radius.md, color: colors.text, paddingHorizontal: 15, marginBottom: 13, fontSize: 15 },
  help: { color: colors.muted, fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 14 },
});
