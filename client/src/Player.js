import React from "react";
import SpotifyPlayer from "react-spotify-web-playback";

export default function Player({ accessToken, trackUri }) {
  const [play, setPlay] = React.useState(false);

  React.useEffect(() => setPlay(true), [trackUri]);

  if (!accessToken) {
    console.error("Access token is missing");
    return null;
  }

  if (!trackUri) {
    console.warn("Track URI is missing or invalid");
  }

  return (
    <SpotifyPlayer
      token={accessToken}
      showSaveIcon
      callback={(state) => {
        if (!state.isPlaying) {
          setPlay(false);
        }
      }}
      play={play}
      uris={trackUri ? [trackUri] : []}
    />
  );
}
