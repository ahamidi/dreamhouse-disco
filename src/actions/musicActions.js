import axios from 'axios';

export function fetchPlaylist() {
  return function(dispatch) {
    dispatch({type: 'FETCH_PLAYLIST'})
    return axios.get('/api/playlist')
      .then((response) => {
        dispatch({type: 'FETCH_PLAYLIST_FULFILLED', payload: response.data})
      })
      .catch((err) => {
        dispatch({type: 'FETCH_PLAYLIST_REJECTED', payload: err})
      })
  }
}

export function nextTrack() {
  return {
    type: 'NEXT_TRACK'
  }
}

export function togglePlay() {
  return {
    type: 'TOGGLE_PLAY'
  }
}
