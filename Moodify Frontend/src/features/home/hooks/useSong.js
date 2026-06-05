import { getSongs } from "../services/song.api";
import { useContext } from "react";
import { SongContext } from "../song.context";


export const useSong = () => {
    const context = useContext(SongContext)

    const { loading, setLoading, song, setSong, songs, setSongs } = context

    async function handleGetSongs({ mood }) {
        setLoading(true)
        const data = await getSongs({ mood })
        const fetchedSongs = data.songs || []
        setSongs(fetchedSongs)
        
        if (fetchedSongs.length > 0) {
            setSong(fetchedSongs[0])
        }
        setLoading(false)
    }

    return ({ loading, song, songs, setSong, handleGetSongs })

}
