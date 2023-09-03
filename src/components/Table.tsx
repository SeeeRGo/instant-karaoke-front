import { useStore } from "effector-react";
import { $songs, fetchSongsFx } from '~/store/songs'
import React, { useEffect } from "react";
import { useRouter } from "next/router";

export const Table = () => {
  const songs = useStore($songs)
  const { push } = useRouter()
  useEffect(() => {
    void fetchSongsFx()
  }, [])
  return (
    <table className="w-full table-auto text-sm">
      <thead>
        <tr className="text-sm leading-normal">
          <th className="bg-grey-lightest text-grey-light border-grey-light border-b px-4 py-2 text-sm font-bold uppercase">
            Song
          </th>
          <th className="bg-grey-lightest text-grey-light border-grey-light border-b px-4 py-2 text-sm font-bold uppercase">
            Artist
          </th>
        </tr>
      </thead>
      <tbody>
        {songs.map(({ name, artist, id }) => (
          <tr key={id} className="hover:bg-grey-lighter" onClick={() => {
            void push(`/video/${id}`)
          }}>
            <td className="border-grey-light border-b px-4 py-2">{name}</td>
            <td className="border-grey-light border-b px-4 py-2">{artist}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
