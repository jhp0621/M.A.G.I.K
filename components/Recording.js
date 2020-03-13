import { Audio } from "expo-av";
import * as Permissions from "expo-permissions";
import * as FileSystem from "expo-file-system";
import { FontAwesome } from "@expo/vector-icons";
import config from "../config.json";
import Icon from "react-native-vector-icons/Ionicons";
import React from "react";
import Modal from "react-native-modal";
import Speech from "./Speech";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
  ActivityIndicator
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
class Recording extends React.Component {
  constructor() {
    super();
    this.state = {
      isRecording: false,
      isFetching: false,
      affirmations: "",
      modal: false
    };
  }

  startRecording = async () => {
    console.log("start recording");
    const { status } = await Permissions.getAsync(Permissions.AUDIO_RECORDING);
    if (status !== "granted") return;

    this.setState({ isRecording: true });
    this.setState({ affirmations: "" });
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
    console.log(this.recording.getURI());
  };

  playSound = async () => {
    const audioFile = this.recording.getURI();
    const info = await FileSystem.getInfoAsync(audioFile);
    console.log("file", audioFile, "info", info);

    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync({ uri: audioFile });
      await soundObject.playAsync();
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
  };

  getTranscription = async () => {
    this.setState({ isFetching: true });
    try {
      console.log("get transcription try");
      const info = await FileSystem.getInfoAsync(this.recording.getURI());
      console.log(`FILE INFO: ${JSON.stringify(info)}`);
      const formData = new FormData();
      formData.append("audioFile", {
        uri: info.uri,
        type: "audio/x-wav",
        // could be anything
        name: "speech2text"
      });
      console.log("formData: ", formData);
      console.log("config cloud: ", config.CLOUD_FUNCTION_URL);
      const response = await fetch(config.CLOUD_FUNCTION_URL, {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      console.log("data", data);
      this.setState({ affirmations: data.transcript, modal: true });
    } catch (error) {
      console.log("There was an error", error);
      console.log("transcription error");
      this.stopRecording();
      this.deleteRecordingFile();
      this.recording = null;
    }
    this.setState({ isFetching: false });
  };

  deleteRecordingFile = async () => {
    try {
      console.log(this.recording);
      const { uri } = await FileSystem.getInfoAsync(this.recording.getURI());
      await FileSystem.deleteAsync(uri);
      console.log("Deletied file");
    } catch (error) {
      console.log("There was an error deleting recording file", error);
    }
  };

  render() {
    const { isRecording, isFetching, affirmations, modal, speech} = this.state;

    return (
      !speech ?
      <View style={styles.container}>
        <Text style={styles.title}>
          Let's start recording your affirmations
        </Text>

        {isRecording && (
          <FontAwesome name="microphone" size={32} color="#48C9B0" />
        )}
        <TouchableOpacity
          style={styles.startButton}
          onPress={this.startRecording}
        >
          <Text>Press to start </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.stopButton}
          onPress={this.stopRecording}
        >
          <Text>Press to stop</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.playButton} onPress={this.playSound}>
          <Text>Play your sound</Text>
        </TouchableOpacity>

        {isFetching && <ActivityIndicator size={32} color="#48C9B0" />}
        <TouchableOpacity
          style={styles.transcribeButton}
          onPress={this.getTranscription}
        >
          <Text>Transcribe your sound</Text>
        </TouchableOpacity>
        {modal && (
          <Modal isVisible={modal} animationType="slide" style={styles.modal}>
            <Text>{affirmations}</Text>
            <Button
            title="Looks good!"
            onPress={() => this.setState({ speech: true })}
          />
          <Button
            title="Try again"
            onPress={() => this.setState({ modal: false })}
          />
          </Modal>
        )}
      </View>
      :
      <Speech />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3A2E39",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    color: "#E5989B",
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
  playButton: {
    backgroundColor: "pink",
    paddingVertical: 20,
    width: "90%",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20
  },
  transcribeButton: {
    backgroundColor: "#A6A6A6",
    paddingVertical: 20,
    width: "90%",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20
  },
  modal: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ede3f2",
    padding: 100
  }
});

export default Recording;
