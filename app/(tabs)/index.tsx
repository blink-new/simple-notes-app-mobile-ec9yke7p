
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Plus, Search, X } from 'lucide-react-native';
import { NoteItem, Note } from '@/components/NoteItem';
import { EmptyState } from '@/components/EmptyState';
import { useNotes } from '@/hooks/useNotes';

export default function NotesScreen() {
  const { notes, loading, error } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const filteredNotes = searchQuery
    ? notes.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notes;

  const handleCreateNote = () => {
    router.push('/note/new');
  };

  const toggleSearch = () => {
    setIsSearching(!isSearching);
    if (isSearching) {
      setSearchQuery('');
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {isSearching ? (
        <View style={styles.searchContainer}>
          <Search size={20} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            clearButtonMode="while-editing"
          />
          <Pressable onPress={toggleSearch} style={styles.cancelButton}>
            <X size={20} color="#FF9500" />
          </Pressable>
        </View>
      ) : (
        <>
          <Text style={styles.noteCount}>
            {notes.length} {notes.length === 1 ? 'Note' : 'Notes'}
          </Text>
          <View style={styles.headerButtons}>
            <Pressable onPress={toggleSearch} style={styles.iconButton}>
              <Search size={22} color="#FF9500" />
            </Pressable>
            <Pressable onPress={handleCreateNote} style={styles.iconButton}>
              <Plus size={22} color="#FF9500" />
            </Pressable>
          </View>
        </>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF9500" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {renderHeader()}
      
      {notes.length === 0 ? (
        <EmptyState message="No Notes Yet\nTap + to create a new note" />
      ) : filteredNotes.length === 0 ? (
        <EmptyState message={`No results for "${searchQuery}"`} />
      ) : (
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NoteItem note={item} />}
          contentContainerStyle={styles.listContent}
        />
      )}
      
      {!isSearching && (
        <Pressable 
          style={styles.fab} 
          onPress={handleCreateNote}
        >
          <Plus size={24} color="#FFFFFF" />
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  noteCount: {
    fontSize: 16,
    color: '#8E8E93',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 36,
    fontSize: 16,
  },
  cancelButton: {
    padding: 8,
  },
  listContent: {
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF9500',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});