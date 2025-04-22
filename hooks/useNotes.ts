
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '@/components/NoteItem';

const STORAGE_KEY = 'notes_app_data';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load notes from storage
  const loadNotes = async () => {
    try {
      setLoading(true);
      const storedNotes = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        // Convert string dates back to Date objects
        const notesWithDates = parsedNotes.map((note: any) => ({
          ...note,
          updatedAt: new Date(note.updatedAt)
        }));
        setNotes(notesWithDates);
      }
    } catch (err) {
      setError('Failed to load notes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Save notes to storage
  const saveNotes = async (updatedNotes: Note[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
    } catch (err) {
      setError('Failed to save notes');
      console.error(err);
    }
  };

  // Add a new note
  const addNote = async (title: string, content: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      updatedAt: new Date()
    };
    
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    await saveNotes(updatedNotes);
    return newNote;
  };

  // Update an existing note
  const updateNote = async (id: string, title: string, content: string) => {
    const updatedNotes = notes.map(note => 
      note.id === id 
        ? { ...note, title, content, updatedAt: new Date() } 
        : note
    );
    
    // Sort notes by updatedAt (most recent first)
    updatedNotes.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    
    setNotes(updatedNotes);
    await saveNotes(updatedNotes);
  };

  // Delete a note
  const deleteNote = async (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    await saveNotes(updatedNotes);
  };

  // Get a single note by ID
  const getNote = (id: string) => {
    return notes.find(note => note.id === id);
  };

  // Load notes on initial render
  useEffect(() => {
    loadNotes();
  }, []);

  return {
    notes,
    loading,
    error,
    addNote,
    updateNote,
    deleteNote,
    getNote,
    refreshNotes: loadNotes
  };
}