import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [recordingURI, setRecordingURI] = useState(null);

  const [isRecordingDone, setIsRecordingDone] = useState(false);

  // ───────────────────────────────────────────────
  // 🔐 Ask for permission when app loads
  // ───────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        alert("Permission required to record audio");
      }
    })();
  }, []);

  // ───────────────────────────────────────────────
  // 🎙 Start Recording
  // ───────────────────────────────────────────────
  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await newRecording.startAsync();

      console.log("Recording started");
      setRecording(newRecording);

    } catch (error) {
      console.log("Error starting recording:", error);
    }
  };

  // ───────────────────────────────────────────────
  // ⏹ Stop Recording
  // ───────────────────────────────────────────────
  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      console.log("Recording saved at:", uri);

      setRecordingURI(uri);
      setRecording(null);
      setIsRecordingDone(true); // Show playback buttons

    } catch (error) {
      console.log("Error stopping recording:", error);
    }
  };

  // ───────────────────────────────────────────────
  // ▶️ Play Recording
  // ───────────────────────────────────────────────
  const playRecording = async () => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: recordingURI }
      );
      setSound(newSound);

      await newSound.playAsync();
      console.log("Playing audio");

    } catch (error) {
      console.log("Error playing sound:", error);
    }
  };

  // ⏸ Pause Playback
  const pausePlayback = async () => {
    if (sound) await sound.pauseAsync();
  };

  // 🛑 Stop + Unload Playback
  const stopPlayback = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  };

  // 🔄 Restart Playback (rewind to 0)
  const restartPlayback = async () => {
    if (sound) {
      await sound.setPositionAsync(0);
      await sound.playAsync();
    }
  };

  // ───────────────────────────────────────────────
  // UI Layout
  // ───────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lab 6 – Audio Recorder (ikenna)</Text>

      {!isRecordingDone && (
        <View style={styles.buttonRow}>
          <Button title="Start Recording" color="red" onPress={startRecording} />
          <Button title="Stop Recording" color="red" onPress={stopRecording} />
        </View>
      )}

      {isRecordingDone && (
        <View style={styles.buttonColumn}>
          <Button title="Play" onPress={playRecording} />
          <Button title="Pause" onPress={pausePlayback} />
          <Button title="Stop" onPress={stopPlayback} />
          <Button title="Restart" onPress={restartPlayback} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    justifyContent: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonColumn: {
    gap: 20,
  },
});
