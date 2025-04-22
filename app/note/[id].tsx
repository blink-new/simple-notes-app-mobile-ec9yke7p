
import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Pressable, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Trash2, Check } from 'lucide-react-native';
import { useNotes } from '@/hooks/useNotes';

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNewNote = id === 'new';
  const { getNote, addNote, updateNote, deleteNote } = useNotes();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!isNewNote);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!isNewNote) {
      const note = getNote(id);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
      }
      setIsLoading(false);
    }
  }, [id, isNewNote, getNote]);

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Cannot Save', 'Note cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      if (isNewNote) {
        await addNote(title.trim(), content.trim());
      } else {
        await updateNote(id, title.trim(), content.trim());
      }
      router.back();
    } catch (error) {
      console.error('Failed to save note:', error);
      Alert.alert('Error', 'Failed to save note');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNote(id);
              router.back();
            } catch (error) {
              console.error('Failed to delete note:', error);
              Alert.alert('Error', 'Failed to delete note');
            }
          }
        },
      ]
    );
  };

  const handleBack = () => {
    if (hasChanges) {
      Alert.alert(
        'Unsaved Changes',
        'Do you want to save your changes?',
        [
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => router.back(),
          },
          {
            text: 'Save',
            style: 'default',
            onPress: handleSave,
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } else {
      router.back();
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9500" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: isNewNote ? 'New Note' : 'Edit Note',
          headerLeft: () => (
            <Pressable onPress={handleBack} style={styles.headerButton}>
              <ArrowLeft size={24} color="#FF9500" />
            </Pressable>
          ),
          headerRight: () => (
            <View style={styles.headerButtons}>
              <Pressable onPress={handleSave} style={styles.headerButton}>
                <Check size={24} color="#FF9500" />
              </Pressable>
              {!isNewNote && (
                <Pressable onPress={handleDelete} style={[styles.headerButton, styles.deleteButton]}>
                  <Trash2 size={24} color="#FF3B30" />
                </Pressable>
              )}
            </View>
          ),
        }}
      />
      
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        {isSaving && (
          <View style={styles.savingOverlay}>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        )}
        
        <TextInput
          style={styles.titleInput}
          placeholder="Title"
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            setHasChanges(true);
          }}
          placeholderTextColor="#8E8E93"
          autoFocus={isNewNote}
          selectTextOnFocus={isNewNote}
        />
        
        <TextInput
          style={styles.contentInput}
          placeholder="Note"
          value={content}
          onChangeText={(text) => {
            setContent(text);
            setHasChanges(true);
          }}
          placeholderTextColor="#8E8E93"
          multiline
          textAlignVertical="top"
        />
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginHorizontal: 4,
  },
  deleteButton: {
    marginLeft: 8,
  },
  titleInput: {
    fontSize: 22,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  contentInput: {
    flex: 1,
    fontSize: 17,
    lineHeight: 24,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  savingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});