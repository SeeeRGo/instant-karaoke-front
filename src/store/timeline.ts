import { createEvent, createStore } from "effector";
import { nanoid } from "nanoid";
import type { SegmentEntry, TranscriptEntry } from "~/types";
import { adjustLaterWordsInSegment, createSegmentFromWords, replaceSegment } from "~/utils/timeline";

export const editWord = createEvent<{
  segmentId: SegmentEntry["id"];
  word: TranscriptEntry;
}>();
export const editWordEnd = createEvent<{
  segmentId: SegmentEntry["id"];
  word: TranscriptEntry;
}>();
export const editSegmentText = createEvent<Pick<SegmentEntry, "id" | "text">>();
export const editSegmentDuration = createEvent<SegmentEntry>();
export const addWord = createEvent<{
  segmentId: SegmentEntry["id"];
  prevWordId: TranscriptEntry["id"];
}>();
export const addSegment = createEvent<{ prevSegmentId: SegmentEntry["id"] }>();
export const deleteWord = createEvent<{
  segmentId: SegmentEntry["id"];
  id: TranscriptEntry["id"];
}>();
export const deleteSegment = createEvent<SegmentEntry["id"]>();
export const setTimeline = createEvent<SegmentEntry[]>();

// export const $timeline = createStore<SegmentEntry[]>();
export const $editedTimeline = createStore<SegmentEntry[]>([])
  .on(setTimeline, (_, timeline) => timeline)
  .on(editWord, (timeline, { segmentId, word }) =>
    timeline.map(({ id, ...rest }) =>
      {
        return segmentId === id
          ? {
            id,
            ...createSegmentFromWords(rest.words.map((oldWord) => oldWord.id === word.id ? word : oldWord),
            ),
          }
          : { id, ...rest };
      },
    ),
  )
  .on(editWordEnd, (timeline, { segmentId, word }) =>
    timeline.map(({ id, ...rest }) =>
      {
        const newEnd = word.end
        const oldEnd =
          rest.words.find((oldWord) => oldWord.id === word.id)?.end ?? word.end;
        const shift = newEnd - oldEnd
        console.log();
        
        return segmentId === id
          ? {
              id,
              ...adjustLaterWordsInSegment(
                rest.words.map((oldWord) =>
                  oldWord.id === word.id ? word : oldWord,
                ), word.id, shift
              ),
            }
          : { id, ...rest };
      },
    ),
  )
  .on(deleteWord, (timeline, { segmentId, id }) => timeline.map((segment) =>
      segment.id === segmentId
        ? {
            ...segment,
            ...createSegmentFromWords(
              segment.words.filter((word) => word.id !== id),
            ),
          }
        : segment,
    ),
  )
  .on(editSegmentText, (timeline, { id, text }) =>
    timeline.map((segment) => {
      if (id === segment.id) {
        const newWords = replaceSegment(segment.words, text);
        return {
          ...segment,
          ...createSegmentFromWords(newWords),
        };
      }
      return segment;
    }),
  )
  .on(editSegmentDuration, (timeline, edit) =>
    timeline.map((segment) => (edit.id === segment.id ? edit : segment)),
  )
  .on(deleteSegment, (timeline, segmentId) => timeline.filter(({ id }) => id !== segmentId),
  )
  .on(addSegment, (timeline, { prevSegmentId }) =>
    timeline.flatMap((segment) =>
      segment.id === prevSegmentId
        ? [
            segment,
            {
              id: nanoid(),
              text: "...",
              start: segment.end,
              end: segment.end,
              words: [
                {
                  id: nanoid(),
                  start: segment.end,
                  end: segment.end,
                  text: "...",
                },
              ],
            },
          ]
        : [segment],
    ),
  )
  .on(addWord, (timeline, { segmentId, prevWordId }) =>
    timeline.map((segment) =>
      segment.id === segmentId
        ? {
            id: segment.id,
            ...createSegmentFromWords(
              segment.words.flatMap((word) =>
                word.id === prevWordId
                  ? [
                      word,
                      {
                        id: nanoid(),
                        start: word.end,
                        end: word.end,
                        text: "...",
                      },
                    ]
                  : [word],
              ),
            ),
          }
        : segment,
    ),
  );
