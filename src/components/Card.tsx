import React, { useState } from "react";
import type { TranscriptEntry } from "~/types";

interface IProps extends TranscriptEntry {
  onEditStart: (newStart: number) => void;
  onEditEnd: (newEnd: number) => void;
  onEditText: (newText: string) => void;
  onAdd: () => void;
  onDelete: () => void;
}
export const Card = ({
  start,
  end,
  text,
  id,
  onEditStart,
  onEditEnd,
  onDelete,
  onAdd,
  onEditText,
}: IProps) => {
  return (
    <div className="relative flex max-w-sm flex-col rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
      <div className="absolute flex end-1 flex-col w-min items-end">
        <button onClick={onAdd}>Add</button>
        <button onClick={onDelete}>Del</button>
      </div>
      <input
        type="number"
        value={start}
        onChange={(ev) => onEditStart(parseFloat(ev.target.value))}
      />
      <input
        type="number"
        value={end}
        onChange={(ev) => onEditEnd(parseFloat(ev.target.value))}
      />
      <input value={text} onChange={(ev) => onEditText(ev.target.value)} />
    </div>
  );
};
