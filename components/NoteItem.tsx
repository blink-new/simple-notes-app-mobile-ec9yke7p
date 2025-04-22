
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: Date;
}

interface NoteItemProps {
  note: Note;
}

export const NoteItem: React.FC<NoteItemProps> = ({ note }) => {
  const formattedDate = formatDate(note.updatedAt);
  
  const handlePress = () => {
    router.push(`/note/${note.id}`);
  };
  
  return (
    <Pressable 
      style={({ pressed }) => [styles.container, pressed && styles.pressed]} 
      onPress={handlePress}
    >
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{note.title || 'Untitled Note'}</Text>
        <View style={styles.details}>
          <Text style={styles.date}>{formattedDate}</Text>
          <Text style={styles.preview} numberOfLines={1}>{note.content}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const formatDate = (date: Date): string => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const noteDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (noteDate.getTime() === today.getTime()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  pressed: {
    backgroundColor: '#F2F2F7',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
    color: '#8E8E93',
    marginRight: 8,
  },
  preview: {
    fontSize: 14,
    color: '#8E8E93',
    flex: 1,
  },
});