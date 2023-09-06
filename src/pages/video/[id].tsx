import { useStore } from 'effector-react';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { Switch } from '~/components/Switch';
import { Timeline } from '~/components/Timeline';
import { apiUrl } from '~/constants';
import { $songs } from '~/store/songs';
import { $editedTimeline } from '~/store/timeline';
import { supabase } from '~/utils/db';

export default function Video() {
  const songs = useStore($songs)
  const timeline = useStore($editedTimeline)
  const { query } = useRouter();
  const [editMode, setEditMode] = useState(false)
  const song = songs.find(({ id }) => query.id === `${id}`)
  const link = editMode ? song?.editLink : song?.link;

  return (
    <div className="container flex flex-col items-center justify-between gap-12 px-4 py-16 ">
      <div className="flex flex-row items-center gap-2">
        <Switch
          isChecked={editMode}
          onChange={() => setEditMode((val) => !val)}
        />
        {editMode ? "Edit mode" : "Karaoke mode"}
      </div>
      {link && <video src={link} controls={true} />}
      <div className="flex flex-row gap-x-2">
        <button className="rounded-lg bg-blue-500 px-4 py-2 text-blue-100 duration-300 hover:bg-blue-600">
          <a href={link} target="_blank" download>
            Download video
          </a>
        </button>
        <button
          className="rounded-lg bg-gray-600 px-4 py-2 text-gray-100 duration-300 hover:bg-gray-700"
          onClick={() => {
            console.log('timeline', timeline);
            
            void fetch(`${apiUrl}/file-rerender`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Access-Control-Allow-Origin": "*",
              },
              body: JSON.stringify({
                id: query.id,
                new_timeline: timeline.map(
                  ({ start, end, words, ...rest }) => ({
                    ...rest,
                    start: parseFloat(`${start}`),
                    end: parseFloat(`${end}`),
                    words: words.map(
                      ({ start: wordStart, end: wordEnd, text: wordText, ...rest }) => ({
                        ...rest,
                        start: parseFloat(`${wordStart}`),
                        end: parseFloat(`${wordEnd}`),
                        text: wordText ?? '...',
                      }),
                    ),
                  }),
                ),
                link: song?.link ?? "link",
                artist: song?.artist ?? "artist",
                name: song?.name ?? "name",
                edit_link: song?.editLink ?? "edit_link",
              }),
            });
          }}
        >
          Render video with edited timeline
        </button>
        <button
          className="rounded-lg bg-gray-600 px-4 py-2 text-gray-100 duration-300 hover:bg-gray-700"
          onClick={() => {
            void supabase.from('songs').update({ timeline }).eq('id', query.id)
          }}
        >
          Save timeline
        </button>
      </div>
      <Timeline />
    </div>
  );
}