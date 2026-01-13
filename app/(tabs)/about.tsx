import { StyleSheet, Text, View } from 'react-native';


export default function About() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acerca de mi </Text>
      <Text style={styles.subtitle}>Vamos a por todo!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#F2F6FF",
    padding: 24,
    gap: 8,  
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 14,
    color: '#334155',
  }
});
