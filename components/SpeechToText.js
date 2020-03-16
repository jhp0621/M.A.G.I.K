import { Audio } from "expo-av";
import * as Permissions from "expo-permissions";
import * as FileSystem from "expo-file-system";
import { FontAwesome } from "@expo/vector-icons";
import config from "../config.json";
import Icon from "react-native-vector-icons/Ionicons";
import React, { Component } from "react";
import Modal from "react-native-modal";
import VoiceForm from "./VoiceForm";
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

export default class SpeechToText extends Component {
  constructor() {
    super();
    this.state = {
      isRecording: false,
      isFetching: false,
      affirmations: "",
      modal: false,
      speech: false
    };
  }

  startRecording = async () => {
    console.log("start recording");
    const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
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
  };

  playSound = async () => {
    const audioFile = this.recording.getURI();
    const info = await FileSystem.getInfoAsync(audioFile);
    console.log("file", audioFile, "info", info);

    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync({ uri: audioFile }); await soundObject.setVolumeAsync(1)
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

      const response = await fetch(config.CLOUD_FUNCTION_URL1, {
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
    const { isRecording, isFetching, affirmations, modal, speech } = this.state;

    return !speech ? (
      <View style={styles.container}>
        <Text style={styles.title}>Let's get started!</Text>
        <Text style={styles.paragraph}>
          Please record affirmations you would like to meditate to. For example:{" "}
        </Text>
        <Text style={styles.example}>
          𝚃𝚘𝚍𝚊𝚢 𝚒𝚜 𝚐𝚘𝚒𝚗𝚐 𝚝𝚘 𝚋𝚎 𝚊𝚗 𝚊𝚠𝚎𝚜𝚘𝚖𝚎 𝚍𝚊𝚢. 𝙸'𝚖 𝚐𝚘𝚒𝚗𝚐 𝚝𝚘 𝚜𝚝𝚊𝚢 𝚌𝚘𝚖𝚖𝚒𝚝𝚝𝚎𝚍 𝚝𝚘 𝚖𝚢
          𝚐𝚘𝚊𝚕𝚜 𝚊𝚗𝚍 𝚛𝚎𝚖𝚊𝚒𝚗 𝚙𝚘𝚜𝚒𝚝𝚒𝚟𝚎. 𝙸 𝚊𝚖 𝚝𝚛𝚞𝚕𝚢 #𝚋𝚕𝚎𝚜𝚜𝚎𝚍 ʚ(´◡`)ɞ
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
            <Text style={styles.transcription}>{affirmations}</Text>
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
    ) : (
      <VoiceForm text={affirmations} playSound={this.playSound}/>
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
    color: "#FFE5D9",
    fontWeight: "bold",
    fontSize: 20,
    paddingBottom: 40
  },
  paragraph: {
    fontSize: 18,
    marginTop: 15,
    marginBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    color: "#FFCAD4"
  },
  example: {
    fontWeight: "bold",
    opacity: 0.8,
    fontSize: 20,
    marginTop: 15,
    marginBottom: 10,
    color: "#FFD3DB",
    borderWidth: 1
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
    backgroundColor: "#FF1654",
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
    backgroundColor: "#FFE273",
    paddingVertical: 20,
    width: "90%",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20
  },
  modal: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFD9DE",
  },
  transcription: {
    fontWeight: "bold",
    fontSize: 18,
    margin: 30,
    padding: 30,
    color: "#3A2F32",
    borderWidth: 1
  }
});
