import type { SegmentEntry, TranscriptEntry } from "~/types";
import { nanoid } from "nanoid";

const nums = [
  { text: "one", start: 1, end: 2 },
  { text: "two", start: 2, end: 3 },
  { text: "three", start: 3, end: 4 },
  { text: "four", start: 4, end: 5 },
  { text: "five", start: 5, end: 6 },
  { text: "six", start: 6, end: 7 },
  { text: "seven", start: 7, end: 8 },
];
const nums_uneven_durations = [
  { text: "one", start: 0.5, end: 2 },
  { text: "two", start: 2, end: 3 },
  { text: "three", start: 3, end: 5 },
  { text: "four", start: 5, end: 5.5 },
  { text: "five", start: 5.5, end: 6 },
  { text: "six", start: 6, end: 7 },
  { text: "seven", start: 7, end: 10 },
];
const nums_uneven_durations_with_pauses = [
  { text: "one", start: 0.5, end: 2 },
  { text: "two", start: 2, end: 3 },
  { text: "three", start: 4, end: 5 },
  { text: "four", start: 5, end: 5.5 },
  { text: "five", start: 5.5, end: 6 },
  { text: "six", start: 6.5, end: 7 },
  { text: "seven", start: 8, end: 10 },
];

export const replaceSegment = (words: TranscriptEntry[], newText: string) => {
  const initalStart = words.at(0)?.start
  const lastEnd = words.at(-1)?.end
  const newWords = newText.trim().split(' ')
  const newLength = newWords.length
  const totalDuration = words.reduce((acc, word) => acc + word.end - word.start, 0)
  if (initalStart === undefined) return newWords.map(word => ({
    text: word,
    start: 0,
    end: 0,
  }))
  if (!newLength) return [{text: '', start: initalStart, end: lastEnd ?? totalDuration }]

  const lenAdjustment = newLength / words.length
  const pauses = []
  for (let i = 0; i < words.length; i++) {
    const nextStart = words.at(i + 1)?.start ?? 0;
    const currentEnd = words.at(i)?.end ?? 0
    if (
      nextStart - currentEnd > 0
    ) {
      pauses.push({
        index: Math.round(lenAdjustment * (i + 1)),
        wait: nextStart - currentEnd,
      });
    }
  }
  const res: TranscriptEntry[] = []
  for (let i = 0; i < newWords.length; i++) {
    const totalPause = pauses.filter(({ index }) => index === i).reduce((acc, { wait }) => acc + wait, 0)
    const lastEnd = i === 0 ? initalStart : res.at(i-1)?.end ?? initalStart
    const newStart = Math.max(i / lenAdjustment, 0);
    const newEnd = Math.min((i + 1) / lenAdjustment, words.length);
    console.log(newStart, newEnd);
    const duration = words.reduce(
      (total, {start, end}, i) => {
        const interpolated = interpolateInRange(newStart, newEnd, { start: i, end: i + 1, value: end - start })
        return total + interpolated;
      },
      0,
    );
    res.push({
      id: nanoid(),
      text: newWords.at(i) ?? "",
      start: lastEnd + totalPause,
      end: lastEnd + totalPause + duration,
    });
  }
  return res
}
interface Range {
  start: number
  end: number
  value: number
}
const interpolateInRange = (start: number, end: number, range: Range) => {
  if (start >= range.end || end <= range.start) return 0 // fucking awesome bug to debug
  if (start <= range.start && end >= range.end) return range.value
  else if (start >= range.start && end <= range.end) return range.value * (end - start) / (range.end - range.start)
  else if (start >= range.start && end >= range.end) return range.value * (range.end - start) / (range.end - range.start)
  else if (start <= range.start && end <= range.end) return range.value * (end - range.start) / (range.end - range.start)
  else return 0
}

export const createSegmentFromWords = (words: TranscriptEntry[]): Omit<SegmentEntry, 'id'> => ({
  words,
  start: words.at(0)?.start ?? 0,
  end: words.at(-1)?.end ?? 0,
  text: words.reduce((text, word) => `${text} ${word.text}`, '')
})
