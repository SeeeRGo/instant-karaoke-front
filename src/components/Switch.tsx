import React from "react";

interface IProps {
  isChecked: boolean
  onChange: () => void
}
export const Switch = ({ isChecked, onChange }: IProps) => {
  return (
    <>
      <label className="flex cursor-pointer select-none items-center">
        <div className="relative">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={onChange}
            className="sr-only"
          />
          <div
            className={`box block h-8 w-14 rounded-full ${
              isChecked ? "bg-white" : "bg-black"
            }`}
          ></div>
          <div
            className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full ${
              isChecked ? "bg-black" : "bg-white"
            } transition ${isChecked ? "translate-x-full" : ""}`}
          ></div>
        </div>
      </label>
    </>
  );
};
