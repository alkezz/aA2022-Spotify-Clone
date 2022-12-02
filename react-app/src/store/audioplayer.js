const ADD_SONG = "audioPlayer/addSong"
const NEXT_SONG = "audioPlayer/nextSong"
const ADD_PLAYLIST = "audioPlay/addPlaylist"
const SKIP_SONG = "audioPlayer/skipSong"

//Action Creators for thunk reference
const actionAddSong = (song) => {
    return {
        type: ADD_SONG,
        song
    }
}

const actionNextSong = (song) => {
    return {
        type: NEXT_SONG,
        song
    }
}

const actionAddPlaylist = (playlist) => {
    return {
        type: ADD_PLAYLIST,
        playlist
    }
}

const actionSkipSong = () => {
    return {
        type: SKIP_SONG
    }
}

export const addSong = (id) => async (dispatch) => {
    const response = await fetch(`/api/songs/${id}`)
    console.log("RESPONSE IN ADD SONG THUNK", response)
    if (response.ok) {
        const data = await response.json()
        console.log("DATA IN ADD SONG THUNK", data)
        dispatch(actionAddSong(data))
        return data
    }
    return response
}

export const nextSong = (id) => async (dispatch) => {
    const response = await fetch(`/api/songs/${id}`)
    if (response.ok) {
        const data = await response.json()
        dispatch(actionNextSong(data))
        return data
    }
    return response
}

export const addPlaylist = (id) => async (dispatch) => {
    const response = await fetch(`/api/playlists/${id}`)
    if (response.ok) {
        const data = await response.json()
        dispatch(actionAddPlaylist(data))
        return data
    }
    return response
}

export const skipSong = () => async (dispatch) => {
    dispatch(actionSkipSong())
}

const initalState = { current_song_playing: [], queue: [] }

export default function audioReducer(state = initalState, action) {
    switch (action.type) {
        case ADD_SONG:
            console.log("ACTION.SONG", action.song)
            return { ...state, current_song_playing: [action.song] }
        case NEXT_SONG:
            if (state.current_song_playing.length === 0) {
                return { ...state, current_song_playing: [action.song] }
            } else if (!!state.queue) {
                return { ...state, queue: [...state.queue, action.song] }
            } else {
                return { ...state, queue: [action.song] }
            }
        case ADD_PLAYLIST:
            return { ...state, current_song_playing: [action.playlist.Songs[0]], queue: [...action.playlist.Songs.slice(1)] }

        case SKIP_SONG:
            if (state.queue.length === 0) {
                return { ...state, current_song_playing: [], queue: [] }
            } else {
                return { current_song_playing: [state.queue[0]], queue: [...state.queue.slice(1)] }
            }

        default:
            return state
    }
}
