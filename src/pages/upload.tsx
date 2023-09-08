import React, { useState } from 'react'
import { apiUrl } from '~/constants'

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [lyrics, setLyrics] = useState('')
  const [name, setName] = useState('')
  const [artist, setArtist] = useState('')
  return (
    <div className="bg-grey-lighter flex h-screen w-full flex-col items-center justify-start">
      <label className="text-blue border-blue hover:bg-blue flex w-64 cursor-pointer flex-col items-center rounded-lg border bg-white px-4 py-6 uppercase tracking-wide shadow-lg hover:text-white">
        <svg
          className="h-8 w-8"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
        </svg>
        <span className="mt-2 text-base leading-normal">Select a file</span>
        <input
          type="file"
          accept="audio/mpeg, audio/vnd.wav"
          onChange={(event) => {
            const files = event.currentTarget.files
            return setFile(files ? files[0] ?? null : null)
          }}
          className="hidden"
        />
      </label>
      <label
        htmlFor="name"
        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >
        Song name
      </label>
      <input id="name" value={name} onChange={(ev) => setName(ev.target.value)} />
      <label
        htmlFor="artist"
        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >
        Artist
      </label>
      <input id="artist" value={artist} onChange={(ev) => setArtist(ev.target.value)} />
      <label
        htmlFor="lyrics"
        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >
        Lyrics
      </label>
      <textarea
        id="lyrics"
        rows={24}
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        placeholder="Correct lyrics help generate more correct video"
        onChange={(ev) => setLyrics(ev.target.value)}
      >
        {lyrics}
      </textarea>
      <button
        onClick={() => {
          if (file) {
            const formData = new FormData();
            formData.append('file', file)
            formData.append('lyrics', lyrics)
            formData.append('name', name)
            formData.append('artist', artist)
            void fetch(`${apiUrl}/file-upload`, {
              method: "POST",
              body: formData,
            });
          }
        }}
        className="rounded-lg bg-blue-500 px-4 py-2 text-blue-100 duration-300 hover:bg-blue-600"
      >
        Create video
      </button>
    </div>
  );
}