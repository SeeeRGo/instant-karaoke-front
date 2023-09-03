import React, { useEffect } from 'react'
import type { SegmentEntry } from '~/types'
import { Segment } from './Segment'
import { useStore } from 'effector-react'
import { $editedTimeline, setTimeline } from '~/store/timeline'
import { nanoid } from 'nanoid'
import { supabase } from '~/utils/db'
import { useRouter } from 'next/router'

// Create a single supabase client for interacting with your database

interface IProps {
  segments: SegmentEntry[]
}

export const Timeline = ({ segments }: IProps) => {
  const timeline = useStore($editedTimeline);
  const { query } = useRouter()

  useEffect(() => {
    void supabase.from("songs").select().eq('id', query.id).single().then(
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