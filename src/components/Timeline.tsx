import React, { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { env } from '~/env.mjs'

// Create a single supabase client for interacting with your database

export const Timeline = () => {
  const [timeline, setTimeline] = useState()
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_KEY, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  useEffect(() => {
    void supabase.from("songs").select().limit(1).single().then(
      ({ data }) => setTimeline(data)
    )
  }, [])

  console.log('timeline', timeline?.timeline ?? '');
  
  return (
    <div>
      Timeline
    </div>
  )
}