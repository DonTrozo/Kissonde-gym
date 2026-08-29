import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandLogo } from '../brand';
import { colors, radius } from '../theme';
import { PrimaryButton } from '../ui';
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
    <View style={styles.hero}>
      <View style={styles.orbOne} /><View style={styles.orbTwo} />
      <View style={styles.logoPlate}><BrandLogo width={190} /></View>
      <View style={styles.heroCopy}>
        <Text style={styles.heroEyebrow}>ÁREA DE MEMBRO</Text>
        <Text style={styles.heroTitle}>Treino, acesso e progresso. Tudo ligado.</Text>
        <Text style={styles.heroText}>A tua experiência Kissonde acompanha-te antes, durante e depois do treino.</Text>
      </View>
    </View>

    <View style={styles.formPanel}>
      <Text style={styles.formTitle}>Entrar</Text>
      <Text style={styles.formSubtitle}>Usa os dados associados à tua adesão.</Text>

      <Text style={styles.label}>NÚMERO DE MEMBRO</Text>
      <TextInput accessibilityLabel="Número de membro" value={memberId} onChangeText={setMemberId} autoCapitalize="characters" autoCorrect={false} placeholder="KSG-00000" placeholderTextColor={colors.slate} style={styles.input} />
      <Text style={styles.label}>PALAVRA-PASSE</Text>
      <TextInput accessibilityLabel="Palavra-passe" value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" placeholderTextColor={colors.slate} style={styles.input} returnKeyType="done" onSubmitEditing={submit} />

      <View style={{ height: 6 }} /><PrimaryButton label="Entrar na minha conta" onPress={submit} />
      <Text style={styles.help}>Problemas para entrar? A receção do teu clube pode confirmar os teus dados de membro.</Text>
    </View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.accentDeep },
  hero: { flex: 1, minHeight: 310, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 34, justifyContent: 'space-between', overflow: 'hidden' },
  orbOne: { position: 'absolute', width: 260, height: 260, borderRadius: 130, backgroundColor: '#246FA7', right: -90, top: -70, opacity: .48 },
  orbTwo: { position: 'absolute', width: 190, height: 190, borderRadius: 95, borderWidth: 34, borderColor: '#2D78AE', left: -80, bottom: -100, opacity: .28 },
  logoPlate: { alignSelf: 'flex-start', backgroundColor: colors.white, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 9, shadowColor: '#082A45', shadowOpacity: .18, shadowRadius: 16, shadowOffset: { width: 0, height: 7 }, elevation: 3 },
  heroCopy: { maxWidth: 360, gap: 8 },
  heroEyebrow: { color: '#A9D0ED', fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  heroTitle: { color: colors.inkOnBrand, fontSize: 30, lineHeight: 34, fontWeight: '900', letterSpacing: -1 },
  heroText: { color: '#D2E6F5', fontSize: 13, lineHeight: 20, maxWidth: 330 },
  formPanel: { backgroundColor: colors.bg, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 22, paddingTop: 26, paddingBottom: 28, marginTop: -8 },
  formTitle: { color: colors.text, fontSize: 27, fontWeight: '900', letterSpacing: -.8 },
  formSubtitle: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 4, marginBottom: 20 },
  label: { color: colors.slateDark, fontSize: 10, fontWeight: '900', letterSpacing: .8, marginBottom: 7, marginTop: 10 },
  input: { height: 54, borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.panel, borderRadius: radius.md, color: colors.text, paddingHorizontal: 15, marginBottom: 10, fontSize: 15 },
  help: { color: colors.muted, fontSize: 11, lineHeight: 17, textAlign: 'center', marginTop: 15, paddingHorizontal: 10 },
});
