import './App.css';
import { useRef, useState, useEffect } from 'react';
import { Grid } from '@material-ui/core'

function App() {

  const audioRef = useRef()
  const recordedAudioRef = useRef()
  const stopRec = useRef()

  const holdAudio = (e) => {
    console.log(e.target.files[0])
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    audioRef.current.src = url
  }

  const record = () => {

    window.navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then((stream) => {
        console.log(stream)
        const options = { mimeType: 'audio/webm' };
        const mediaRecorder = new MediaRecorder(stream, options);
        let data = [];

        mediaRecorder.start()
        console.log("from start", mediaRecorder.state)

        stopRec.current.addEventListener('click', () => {
          if (mediaRecorder.state != "inactive") {
            mediaRecorder.stop()
            console.log("stopped", mediaRecorder.state)
          }
        })

        mediaRecorder.addEventListener('dataavailable', function (e) {
          if (e.data.size > 0) {
            data.push(e.data)
          }
        })

        mediaRecorder.addEventListener('stop', function () {
          const blob = new Blob(data, { 'type': 'audio/mp3' })
          data = []
          const videoUrl = window.URL.createObjectURL(blob)
          recordedAudioRef.current.src = videoUrl
        })

      }).catch((err) => {
        console.log(err.name, err.message)
      })
  }

  return (
    <Grid className="App">
      <header className="App-header">
        <Grid container direction="column">

          <Grid item>
            <button onClick={record}> Start singing</button>
            &nbsp;
            <button ref={stopRec}>Stop singing</button>
          </Grid>
          <br />
          <Grid item>
            <p>Play recorded file</p>
            <audio ref={recordedAudioRef} id="recorded" controls></audio>
          </Grid>
        </Grid>
        <br />
        <br />
        <Grid container direction="column">
          <Grid item>
            <input type="file" accept="audio/*" capture onChange={(event) => holdAudio(event)}></input>
            <br />
          </Grid>
          <Grid item>
            <p>Play uploaded file</p>
            <audio ref={audioRef} id="player" controls></audio>
          </Grid>
        </Grid>
      </header>
    </Grid >
  );
}

export default App;
