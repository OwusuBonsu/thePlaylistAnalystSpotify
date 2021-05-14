import React, { useEffect, useState, useCallback, useRef } from "react";
import useAuth from "./useAuth";
import SpotifyWebApi from "spotify-web-api-node";
import PlaylistList from "./PlaylistList";
import "./Dashboard.css";
import Analysis from "./Analysis";

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [playlistProps, getPlaylistProps] = useState(["emptyarray"]);
  const [showHide, setShowHide] = useState(false);
  localStorage.setItem("access", accessToken);
  const spotifyApi = new SpotifyWebApi({
    clientId: "a3296c7d32264744a2a198e3ef62a255",
  });
  const [artistCounts, getArtistCounts] = useState([]);
  const [albumCounts, getAlbumCounts] = useState([]);
  const [tagCounts, getTagCounts] = useState([]);
  const isInitialMount = useRef(true);

  //Get Access Token
  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  //Get users playlists
  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.getUserPlaylists().then((data) => {
      getPlaylistProps(
        data.body.items.map((playlist) => {
          return {
            name: playlist.name,
            id: playlist.id,
            url: playlist.href,
            trackNum: playlist.tracks.total,
          };
        })
      );
    });
  }, [accessToken]);

  const toggleShowHide = () => {
    setShowHide(true);
  };

  return (
    <div className="parent">
      Select a playlist to analyze
      {playlistProps.map((playlist) => (
        <div className="listCard" onClick={toggleShowHide}>
          <PlaylistList
            playlist={playlist}
            key={playlist.id}
            code={code}
            getArtistCounts={getArtistCounts}
            getAlbumCounts={getAlbumCounts}
            getTagCounts={getTagCounts}
            showHide={showHide}
          />
        </div>
      ))}
      {showHide ? (
        <Analysis
          artistCounts={artistCounts}
          albumCounts={albumCounts}
          tagCounts={tagCounts}
        />
      ) : null}
    </div>
  );
}
