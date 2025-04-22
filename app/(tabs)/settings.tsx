
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Moon, Sun } from 'lucide-react-native';

export default function SettingsScreen() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const handleClearAllNotes = () => {
    Alert.alert(
      'Clear All Notes',
      'Are you sure you want to delete all notes? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete All', 
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('notes_app_data');
              Alert.alert('Success', 'All notes have been deleted');
            } catch (error) {
              console.error('Failed to clear notes:', error);
              Alert.alert('Error', 'Failed to clear notes');
            }
          }
        },
      ]
    );
  };

  const toggleDarkMode = () => {
    // This is just a placeholder for now
    // In a real app, we would implement dark mode
    setIsDarkMode(!isDarkMode);
    Alert.alert('Coming Soon', 'Dark mode will be available in a future update');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              {isDarkMode ? (
                <Moon size={20} color="#8E8E93" style={styles.settingIcon} />
              ) : (
                <Sun size={20} color="#8E8E93" style={styles.settingIcon} />
              )}
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#D1D1D6', true: '#FF9500' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <Pressable 
            style={({ pressed }) => [styles.dangerButton, pressed && styles.buttonPressed]}
            onPress={handleClearAllNotes}
          >
            <Text style={styles.dangerButtonText}>Clear All Notes</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Version</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#000000',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  dangerButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  aboutLabel: {
    fontSize: 16,
    color: '#000000',
  },
  aboutValue: {
    fontSize: 16,
    color: '#8E8E93',
  },
});