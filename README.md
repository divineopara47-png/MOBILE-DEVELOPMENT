# audio 101

This is a simple Expo React Native app for Lab 6: Audio Recorder.

## What it includes

- `App.js` — the audio recorder + playback UI using `expo-av`
- `package.json` and `app.json`
- simple README and .gitignore

## Run locally

1. Install Expo CLI (if you don't have it): `npm install -g expo-cli` (or use `npx`)
2. Install dependencies: `npm install`
3. Start the project: `npx expo start`
4. Use Expo Go on your device or an emulator to run the app.

## Notes

- The app requests audio recording permissions at startup.
- Works on Android and iOS (with Expo).
- Recording is stored temporarily on the device and not uploaded anywhere.
