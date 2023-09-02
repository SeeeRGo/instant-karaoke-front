import React, { useState } from "react";
import type { SegmentEntry } from "~/types";
import { Card } from "./Card";
import { addSegment, addWord, deleteSegment, deleteWord, editSegmentDuration, editSegmentText, editWord } from "~/store/timeline";

export const Segment = ({ start, end, text, words, id }: SegmentEntry) => {
  const [showWords, setShowWords] = useState(false);
  return (
    <div>
      <button onClick={() => setShowWords((val) => !val)}>Show words</button>
      <Card
        start={start}
        end={end}
        text={text}
        onAdd={() => addSegment({ prevSegmentId: id })}
        onDelete={() => deleteSegment(id)}
        onEditStart={(val) =>
          editSegmentDuration({
            id,
            start: val,
            end,
            text,
            words,
          })
        }
        onEditEnd={(val) =>
          editSegmentDuration({
            id,
            start,
            end: val,
            text,
            words,
          })
        }
        onEditText={(val) =>
          editSegmentText({
            id,
            text: val,
          })
        }
      />
      {showWords
        ? words.map((word, i) => (
            <Card
              key={i}
              {...word}
              onAdd={() => addWord({ segmentId: id, prevWordId: word.id })}
              onDelete={() => deleteWord({ segmentId: id, id: word.id })}
              onEditStart={(val) =>
                editWord({
                  segmentId: id,
                  word: {
                    ...word,
                    start: val,
                  },
                })
              }
              onEditEnd={(val) =>
                editWord({
                  segmentId: id,
                  word: {
                    ...word,
                    end: val,
                  },
                })
              }
              onEditText={(val) =>
                editWord({
                  segmentId: id,
                  word: {
                    ...word,
                    text: val,
                  },
                })
              }
            />
          ))
        : null}
    </div>
  );
};
