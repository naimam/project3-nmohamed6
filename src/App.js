/* eslint-disable no-console, react/no-array-index-key,
 react-hooks/exhaustive-deps, react/jsx-filename-extension
*/

/* todo:
  - fix react rendered in jsx error - eslint-disable
  - fix once updated made, page not showing info until user refreshes
  - fix linting errors
  - add unit tests
  - deploy to heroku - fix workflow
  - fix sytling
  - update README
*/

import './App.css';
import { React, useState, useRef } from 'react';

function App() {
  const args = JSON.parse(document.getElementById('data').text);
  const currentUserIds = args.user_artist_ids;
  const [artistList, setartistList] = useState(currentUserIds);
  const textInput = useRef(null);
  console.log('current user ids:', currentUserIds);
  console.log('artist list:', artistList);

  function addArtist() {
    const toAdd = textInput.current.value;
    console.log('text input current val:', toAdd);
    setartistList([...artistList, toAdd]);
    textInput.current.value = '';
    console.log('add artist artist list:', artistList);
  }

  function deleteArtist(toDelete) {
    console.log('to delete:', toDelete);
    setartistList(artistList.filter((artist) => artist !== toDelete));
    console.log('delete artist list:', artistList);
  }

  function saveArtist() {
    const addList = artistList.filter((f) => !currentUserIds.includes(f));
    const deleteList = currentUserIds.filter((f) => !artistList.includes(f));
    const update = {
      add: addList,
      delete: deleteList,
    };
    console.log(JSON.stringify(update));
    fetch('/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(update),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setartistList(data.user_artists_server);
        window.location.reload();
      });
  }

  const userSavedArtists = artistList.map((item) => (
    <li>
      {item}
      <button type="button" onClick={() => { deleteArtist(item); }}>Remove</button>
    </li>
  ));

  return (
    <body>
      <div className="topnav">
        <h1>
          <a href="https://github.com/csc4350-f21/project2-nmohamed6">
            <i className="fab fa-github" />
          </a>
        </h1>
        <h1>
          {args.current_username}
          music!
        </h1>
        <h1>
          <a href="/logout">
            <i className="fas fa-sign-out-alt" />
          </a>
        </h1>
      </div>
      <main id="main">

        {args.has_artists_saved ? (
          <div className="row">
            <div className="column">
              <div className="card">
                <h1 id="title">
                  Your saved artists
                </h1>
                <ul>
                  {userSavedArtists}
                </ul>
                <div>
                  <input type="text" ref={textInput} placeholder="Artist ID" required />
                  <button type="button" onClick={addArtist}> Add artist</button>
                </div>
                <button type="button" onClick={saveArtist}> SAVE CHANGES</button>

              </div>

              <div className="card">
                <h1 id="title">
                  Artist:
                  {args.name}
                </h1>
                <img id="artistImg" alt="Profilepic" src={args.img} />
              </div>

            </div>

            <div className="column">
              <div className="card">
                <h1 id="title">
                  Now Playing:
                  {args.trackName}
                </h1>
                <img src={args.trackImg} alt="song" />
                <audio controls>
                  <source src={args.trackAudio} type="audio/mpeg" />
                  <track kind="captions" Track audio />
                </audio>
                <p>
                  NOTE: If audio player is not playing, the audio file is not available
                  for this specific track.
                  Refresh your browser to get new one!
                </p>
                <br />
                <a href="{args.lyricLink}">Genius Lyrics</a>
              </div>
            </div>
          </div>
        )
          : (
            <>
              <p> Looks like you haven&apos;t added any artists yet. Add some below:</p>

              <ul>
                {artistList.map((item) => <li>{item}</li>)}
              </ul>

              <div>
                <input type="text" ref={textInput} placeholder="Artist ID" required />
                <button type="button" onClick={addArtist}> Add artist</button>
              </div>
              <button type="button" onClick={saveArtist}>Save!</button>

            </>
          )}
      </main>
      <div className="footer">
        Created by Naima Mohamed
        <br />
        Icons by
        <a href="https://www.freepik.com" title="Freepik">Freepik</a>
        from
        <a
          href="https://www.flaticon.com/"
          title="Flaticon"
        >
          www.flaticon.com
        </a>
      </div>

    </body>
  );
}

export default App;
