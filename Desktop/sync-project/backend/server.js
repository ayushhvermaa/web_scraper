const express = require('express');
const multer = require('multer');
const cors = require('cors');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const speech = require('@google-cloud/speech');
const client = new speech.SpeechClient({ keyFilename: './sync-402523-7756bbbcc584.json' });

const port = 3001;
const app = express();
const upload = multer({ storage: multer.memoryStorage() });
app.use(cors());

app.post('/transcribe', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  try {
    const audioFileName = 'temp_audio.raw';
    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(req.file.buffer)
        .toFormat('wav')
        .on('end', resolve)
        .on('error', reject)
        .save(audioFileName);
    });
    const audioBytes = (await fs.promises.readFile(audioFileName)).toString('base64');
    await fs.promises.unlink(audioFileName);

    const audio = { content: audioBytes };
    const config = { encoding: 'LINEAR16', sampleRateHertz: 16000, languageCode: 'en-US' };
    const request = { audio: audio, config: config };

    const [response] = await client.recognize(request);
    const transcription = response.results.map(result => result.alternatives[0].transcript).join('\n');
    res.json({ transcription: transcription });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing file.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
