import { Audio } from "expo-av";
import * as Permissions from "expo-permissions";
import * as FileSystem from "expo-file-system";
import { FontAwesome } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/Ionicons";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity
} from "react-native";

const recordingOptions = {
  // android not currently in use, but parameters are required
  android: {
    extension: ".m4a",
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000
  },
  ios: {
    extension: ".wav",
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false
  }
};
class Record extends React.Component {
  constructor() {
    super();
    this.state = {
      isRecording: false,
      isFetching: false,
      affirmations: ""
    };
  }

  startRecording = async () => {
    console.log("start recording");
    const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    if (status !== "granted") return;

    this.setState({ isRecording: true });
    // some of these are not applicable, but are required
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: true
    });
    const recording = new Audio.Recording();
    try {
      console.log("recording try");
      await recording.prepareToRecordAsync(recordingOptions);
      await recording.startAsync();
      // You are now recording!
    } catch (error) {
      console.log("recording catch");
      console.log(error);
      this.stopRecording();
    }
    this.recording = recording;
  };

  stopRecording = async () => {
    console.log("stop recording");
    this.setState({ isRecording: false });
    try {
      await this.recording.stopAndUnloadAsync();
    } catch (error) {}
  };

  playSound = async () => {
    const file = this.recording.getURI();
    const info = await FileSystem.getInfoAsync(file);
    console.log("file", file, "info", info);

    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync({ uri: file });
      await soundObject.playAsync();
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
  };

  getTranscription = async () => {
    this.setState({ isFetching: true });
    try {
      const info = await FileSystem.getInfoAsync(this.recording.getURI());
      console.log(`FILE INFO: ${JSON.stringify(info)}`);
      const uri = info.uri;
      const formData = new FormData();
      formData.append("file", {
        uri,
        type: "audio/x-wav",
        // could be anything
        name: "speech2text"
      });
      const response = await fetch(config.CLOUD_FUNCTION_URL, {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      this.setState({ affirmations: data.transcript });
    } catch (error) {
      console.log("There was an error", error);
      console.log("transcription error")
      this.stopRecording();
      this.resetRecording();
    }
    this.setState({ isFetching: false });
  };

  deleteRecordingFile = async () => {
    console.log("Deleting file");
    try {
      const info = await FileSystem.getInfoAsync(this.recording.getURI());
      await FileSystem.deleteAsync(info.uri);
    } catch (error) {
      console.log("There was an error deleting recording file", error);
      ƒ;
    }
  };

  resetRecording = () => {
    this.recording = null;
    this.deleteRecordingFile();
  };

  handlePressStart = () => {
    this.startRecording();
  };

  handlePressStop = () => {
    this.stopRecording();
    this.getTranscription();
  };

  render() {
    const { isRecording, isFetching, affirmations } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Let's start recording your affirmations
        </Text>

        {isRecording && (
          <FontAwesome name="microphone" size={32} color="#48C9B0" />
        )}
        <TouchableOpacity
          style={styles.startButton}
          onPress={this.handlePressStart}
        >
          <Text>Press to Start </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.stopButton}
          onPress={this.handlePressStop}
        >
          <Text>Press to Stop</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={this.playSound}>
          <Text>Play your sound</Text>
        </TouchableOpacity>

        {this.affirmations && <Text>{this.affirmations}</Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    color: "purple",
    fontWeight: "bold",
    fontSize: 20
  },
  startButton: {
    backgroundColor: "#48C9B0",
    paddingVertical: 20,
    width: "90%",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20
  },
  stopButton: {
    backgroundColor: "red",
    paddingVertical: 20,
    width: "90%",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20
  },
  button: {
    backgroundColor: "pink",
    paddingVertical: 20,
    width: "90%",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20
  }
});

export default Record;
