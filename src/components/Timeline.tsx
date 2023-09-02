import React, { useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { env } from '~/env.mjs'
import type { SegmentEntry } from '~/types'
import { Segment } from './Segment'
import { useStore } from 'effector-react'
import { $editedTimeline, setTimeline } from '~/store/timeline'
import { nanoid } from 'nanoid'

// Create a single supabase client for interacting with your database

interface IProps {
  segments: SegmentEntry[]
}
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_KEY, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export const Timeline = ({ segments }: IProps) => {
  const timeline = useStore($editedTimeline);

  useEffect(() => {
    void supabase.from("songs").select().limit(1).single().then(
      ({ data }) => setTimeline(data?.timeline?.segments.map(({ words, start, end, text }) => ({
        id: nanoid(),
        start,
        end,
        text,
        words: words.map(({ start, end, word }) => ({
          id: nanoid(),
          start,
          end,
          text: word,
        }))
      })) ?? [])
    )
  }, [])

  // console.log('timeline', timeline?.timeline ?? '');
  
  return (
    <div className="flex w-full flex-row overflow-auto">
      {timeline.map((segment, i) => (
        <Segment key={i} {...segment} />
      ))}
    </div>
  );
}