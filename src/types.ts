export interface TranscriptEntry {
  id: string;
  start: number;
  end: number;
  text: string;
} 

export interface SegmentEntry extends TranscriptEntry {
  words: TranscriptEntry[]
}

export interface Songs {
  id: string
  name: string
  artist: string
  link: string
}