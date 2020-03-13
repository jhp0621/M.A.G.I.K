class Transcript extends React.Component {
  constructor() {
    super();
    this.state = {
      isRecording: false,
      isFetching: false,
      affirmations: ""
    };
  }

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


}

export default Transcript

