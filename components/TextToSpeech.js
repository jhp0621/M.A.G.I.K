import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  AsyncStorage,
  ImageBackground,
  SafeAreaView,
  ScrollView
} from "react-native";
import config from "../config.json";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import { Audio, Video } from "expo-av";
import SpeechToText from "./SpeechToText";
import { Asset } from "expo-asset";
import { FontAwesome } from "@expo/vector-icons";

class TextToSpeech extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching_A: false,
      isFetching_V: false,
      donePlaying_A: false,
      showVideo: false,
      backToAudio: false,
      isLooping_A: false
    };
  }

  getSpeech = async () => {
    const { text, name, pitch, speed } = this.props;

    let request = {
      input: { text },
      voice: {
        languageCode: "en-US",
        name
      },
      audioConfig: {
        audioEncoding: "MP3",
        pitch,
        speakingRate: speed
      }
    };

    const key =
      Platform.OS === "ios" ? config.API_KEY_IOS : config.API_KEY_ANDROID;
    const address = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${key}`;
    const audioUri = `${FileSystem.cacheDirectory}/voice.mp3`;

    try {
      this.setState({ isFetching_A: true });
      const response = await fetch(`${address}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(request),
        method: "POST"
      });
      const { audioContent } = await response.json();

      await FileSystem.writeAsStringAsync(audioUri, audioContent, {
        encoding: FileSystem.EncodingType.Base64
      });
      this.audioUri = audioUri;
    } catch (err) {
      console.warn(err);
    }
    this.setState({ isFetching_A: false });
  };

  componentDidMount() {
    this.getSpeech();
  }

  componentWillUnmount() {
    this.setState({ isLooping_A: false });
  }

  onPlaybackStatusUpdate = playbackStatus => {
    if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
      this.setState({ donePlaying_A: true });
    }
  };

  playSound = async () => {
    const soundObject = new Audio.Sound();
    try {
      soundObject.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);

      await soundObject.loadAsync({ uri: this.audioUri });
      await soundObject.setVolumeAsync(1);
      if (this.state.isLooping_A) {
        await soundObject.setIsLoopingAsync(true);
      }
      await soundObject.playAsync();
    } catch (error) {
      // An error occurred!
    }
    this.sound = soundObject;
  };

  backToAudio = async () => {
    await this.sound.setIsLoopingAsync(false);
    this.setState({ backToAudio: true });
  };

  onRepeatToggle = async () => {
    const { isLooping_A } = this.state;
    this.setState({ isLooping_A: !isLooping_A });
    if (isLooping_A) {
      await this.sound.setIsLoopingAsync(false);
      await this.sound.stopAsync();
    }
  };

  render() {
    const {
      isFetching_A,
      isFetching_V,
      donePlaying_A,
      backToAudio,
      isLooping_A
    } = this.state;

    return !backToAudio ? (
      <ImageBackground
        source={pic}
        style={{ width: "100%", height: "110%", top: -60 }}
      >
        <SafeAreaView>
          <ScrollView>
            <View style={styles.container}>
              <Text style={styles.title}>Time to meditate</Text>
              <Text style={styles.mini}>...aka feel the 𝕞.𝕒.𝕘.𝕚.𝕜...</Text>
              <Video
                source={require("../assets/meditation.mp4")}
                onLoadStart={() => this.setState({ isFetching_V: true })}
                onLoad={() => this.setState({ isFetching_V: false })}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                shouldPlay
                isLooping
                style={{ width: 365, height: 500 }}
              />
              {isFetching_V && <Text>Video is loading...</Text>}
              <View style={styles.container2}>
                {isFetching_A && (
                  <ActivityIndicator size={32} color="#48C9B0" />
                )}
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={this.playSound}
                >
                  <Text>Play affirmations</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.playButton2}
                  onPress={this.props.playSound}
                >
                  <Text>Play your own sound</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={this.onRepeatToggle}>
                <Text style={styles.onRepeat}>𝚘𝚗 𝚛𝚎𝚙𝚎𝚊𝚝</Text>
              </TouchableOpacity>
              {isLooping_A && (
                <FontAwesome name="retweet" size={32} color="#48C9B0" />
              )}
            </View>
            {donePlaying_A && (
              <View>
                <Text style={styles.paragraph}>
                  𝚆𝚎𝚕𝚕 𝚍𝚘𝚗𝚎! 𝙻𝚒𝚜𝚝𝚎𝚗 𝚝𝚘 𝚢𝚘𝚞𝚛 𝚊𝚏𝚏𝚒𝚛𝚖𝚊𝚝𝚒𝚘𝚗𝚜 𝚊𝚜 𝚖𝚊𝚗𝚢 𝚝𝚒𝚖𝚎𝚜 𝚊𝚜 𝚢𝚘𝚞
                  𝚠𝚊𝚗𝚝 𝚘𝚛 𝚜𝚎𝚝 𝚒𝚝 𝚘𝚗 𝚛𝚎𝚙𝚎𝚊𝚝 ↑. 𝙸𝚏 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚛𝚎𝚌𝚘𝚛𝚍 𝚗𝚎𝚠 𝚘𝚗𝚎𝚜,
                  𝚌𝚕𝚒𝚌𝚔:
                </Text>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={this.backToAudio}
                >
                  <Text style={this.backButton}>💝</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    ) : (
      <SpeechToText />
    );
  }
}

let pic = {
  uri:
    "https://ctl.s6img.com/society6/img/Q_KUOWzLa5ga0epJdrd0SrI6xfc/w_700/canvas/~artwork/s6-original-art-uploads/society6/uploads/misc/7e562636347f4bcda77ff4a5bf1a6f5c/~~/balancing-stones-21-canvas.jpg?wait=0&attempt=0"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    marginBottom: 30
  },
  container2: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row"
  },
  title: {
    color: "black",
    fontWeight: "500",
    fontSize: 18,
    paddingBottom: 10
  },
  mini: {
    alignSelf: "center",
    backgroundColor: "rgba(244, 172, 183, 0.2)",
    marginBottom: 15
  },
  playButton: {
    backgroundColor: "#48C9B0",
    paddingVertical: 20,
    width: 150,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20
  },
  playButton2: {
    backgroundColor: "#FBF6EF",
    paddingVertical: 20,
    width: 150,
    alignItems: "center",
    marginLeft: 10,
    borderRadius: 5,
    marginTop: 20
  },
  onRepeat: {
    fontWeight: "300",
    fontSize: 18,
    paddingTop: 10,
    color: "#C9E3E3"
  },
  backButton: {
    backgroundColor: "#FF1654",
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 50
  },
  paragraph: {
    fontSize: 18,
    marginBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    color: "#E6ECE8",
    backgroundColor: "rgba(38, 22, 68, 0.6)"
  }
});

export default TextToSpeech;
