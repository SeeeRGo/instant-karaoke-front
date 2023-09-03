import React from 'react'
import { Timeline } from '~/components/Timeline';

export default function Video() {
  return (
    <div className="container flex flex-col items-center justify-between gap-12 px-4 py-16 ">
      <video
        src="https://wkvsvhqxfoamibzzcrco.supabase.co/storage/v1/object/public/file_queue/Kitty%20In%20A%20Casket%20-%20Cold%20Black%20Heart.mp4"
        controls={true}
      />
      <div className="flex flex-row gap-x-2">
        <button className="rounded-lg bg-blue-500 px-4 py-2 text-blue-100 duration-300 hover:bg-blue-600">
          Download video
        </button>
        <button className="rounded-lg bg-gray-600 px-4 py-2 text-gray-100 duration-300 hover:bg-gray-700">
          Render video with edited timeline
        </button>
      </div>
      <Timeline />
    </div>
  );
}