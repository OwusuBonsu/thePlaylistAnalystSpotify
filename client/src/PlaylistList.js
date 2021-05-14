import React, { useCallback, useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import "./PlaylistList.css";
import { Card } from "react-bootstrap";
import axios from "axios";

export default function PlaylistList({
  playlist,
  getArtistCounts,
  getAlbumCounts,
  getTagCounts,
  showHide,
}) {
  const [userPlaylistTracks, getUserPlaylistTracks] = useState([]);
  const [trigger2, startTrigger2] = useState(false);
  const [trigger3, startTrigger3] = useState(false);

  const spotifyApi = new SpotifyWebApi({
    clientId: "a3296c7d32264744a2a198e3ef62a255",
  });
  const accessToken = localStorage.getItem("access");
  spotifyApi.setAccessToken(accessToken);

  //Temp arrays
  const tempArtistArray = [];
  const tempAlbumsArray = [];
  const tempTagsArray = [];

  //Get data for songs from Spotify
  const trackMetadata = async () => {
    const accessToken = localStorage.getItem("access");
    spotifyApi.setAccessToken(accessToken);
    if (!accessToken) return;
    startTrigger2(!trigger2);

    spotifyApi.getPlaylistTracks(playlist.id).then((data) => {
      var userTracks = data.body.items.map(async (tracks) => {
        //Return object with needed track info
        var tagFunction = async () => {
          return axios
            .get(
              "http://ws.audioscrobbler.com/2.0/?method=track.gettoptags&artist=" +
                encodeURIComponent(tracks.track.album.artists[0].name) +
                "&track=" +
                encodeURIComponent(tracks.track.name) +
                "&autocorrect=1&api_key=205d2d20915ccacfdfd4e08c2a394872&format=json"
            )
            .then((res) => {
              return res.data.toptags.tag[0].name;
            })
            .catch((err) => {
              return "No tags found";
            });
        };

        var tagReturner = await tagFunction();

        return {
          name: tracks.track.name,
          album: tracks.track.album.name,
          artist: tracks.track.album.artists[0].name,
          artistID: tracks.track.album.artists[0].id,
          id: tracks.track.id,
          tag: tagReturner,
        };
      });
      Promise.all(userTracks).then((values) => {
        getUserPlaylistTracks(values);
      });
    });
  };

  // Get counts for atrists, albums, and tags
  useEffect(() => {
    var tempArtistCounts = userPlaylistTracks.reduce(
      (c, { artist: key }) => ((c[key] = (c[key] || 0) + 1), c),
      {}
    );

    console.log(tempArtistCounts);
    reconstructArtists(tempArtistCounts);

    var tempAlbumCounts = userPlaylistTracks.reduce(
      (c, { album: key }) => ((c[key] = (c[key] || 0) + 1), c),
      {}
    );

    console.log(tempAlbumCounts);
    reconstructAlbums(tempAlbumCounts);

    var tempTagCounts = userPlaylistTracks.reduce(
      (c, { tag: key }) => ((c[key] = (c[key] || 0) + 1), c),
      {}
    );

    reconstructTags(tempTagCounts);
    console.log(tempTagCounts);
  }, [userPlaylistTracks]);

  // Reconstruct to Nivo Chart format
  const reconstructArtists = (object) => {
    for (var [key, value] of Object.entries(object)) {
      tempArtistArray.push({ id: key, value: value });
    }
    getArtistCounts(tempArtistArray);
  };
  const reconstructAlbums = (object) => {
    for (var [key, value] of Object.entries(object)) {
      tempAlbumsArray.push({ id: key, value: value });
    }
    getAlbumCounts(tempAlbumsArray);
  };
  const reconstructTags = (object) => {
    for (var [key, value] of Object.entries(object)) {
      tempTagsArray.push({ id: key, value: value });
    }
    getTagCounts(tempTagsArray);
    console.log(tempTagsArray); //Undefined
  };

  return (
    <div className="playlistCardContainer">
      <Card className="playlistContainer float-left" onClick={trackMetadata}>
        {playlist.name}
        <div className="lightweight">{playlist.trackNum} tracks</div>
      </Card>
    </div>
  );
}
