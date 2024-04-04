import React, { ChangeEvent, useState, KeyboardEvent } from "react";
import { useSelector } from "react-redux";
import { Textarea } from "@nextui-org/react";
import { twMerge } from "tailwind-merge";
import { RootState } from "../store";
import useInputComposition from "../hooks/useInputComposition";
import { sendChatMessage } from "../services/chatService";

function Input() {
  const { initialized } = useSelector((state: RootState) => state.task);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      sendChatMessage(inputMessage);
      setInputMessage("");
    }
  };

  const { onCompositionEnd, onCompositionStart, isComposing } =
    useInputComposition();

  const handleChangeInputMessage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== "\n") {
      setInputMessage(e.target.value);
    }
  };

  const handleSendMessageOnEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Prevent "Enter" from sending during IME input (e.g., Chinese, Japanese)
      if (isComposing) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full relative text-base">
      <Textarea
        disabled={!initialized}
        className="py-4 px-4"
        classNames={{
          input: "pr-16 py-2",
        }}
        value={inputMessage}
        maxRows={10}
        minRows={1}
        variant="bordered"
        onChange={handleChangeInputMessage}
        onKeyDown={handleSendMessageOnEnter}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        placeholder="Send a message (won't interrupt the Assistant)"
      />
      <button
        type="button"
        className={twMerge(
          "bg-transparent border-none rounded py-2.5 px-5 hover:opacity-80 cursor-pointer select-none absolute right-5 bottom-6",
          !initialized && "cursor-not-allowed opacity-80",
        )}
        onClick={handleSendMessage}
        disabled={!initialized}
      >
        Send
      </button>
    </div>
  );
}

export default Input;