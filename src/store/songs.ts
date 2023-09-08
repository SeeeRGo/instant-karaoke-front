import { createEffect, createStore } from "effector";
import { Songs } from "~/types";
import { supabase } from "~/utils/db";


export const fetchSongsFx = createEffect(async () => {
  const { data } = await supabase.from('songs').select()
  return data?.map(({ id, name, artist, link, edit_link}: { id: string, name: string, artist: string, link: string, edit_link: string}) => ({
    id,
    name,
    artist,
    link,
    editLink: edit_link
  })) ?? []
})

export const $songs = createStore<Songs[]>([])
  .on(fetchSongsFx.doneData, (_, songs) => songs)
