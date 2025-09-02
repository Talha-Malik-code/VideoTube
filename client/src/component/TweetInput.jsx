import React, { useState } from "react";
import Button from "./Button";

const TweetInput = ({ onSubmit, className = "" }) => {
  const [tweetContent, setTweetContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tweetContent.trim()) return;

    try {
      setIsSubmitting(true);
      if (onSubmit) {
        await onSubmit(tweetContent);
        setTweetContent(""); // Clear input after successful submission
      }
    } catch (error) {
      console.error("Error submitting tweet:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={`mt-2 border pb-2 ${className}`}>
      <form onSubmit={handleSubmit}>
        <textarea
          className="mb-2 h-10 w-full resize-none border-none bg-transparent px-3 pt-2 outline-none text-black dark:text-white"
          placeholder="Write a tweet"
          value={tweetContent}
          onChange={(e) => setTweetContent(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={280}
          disabled={isSubmitting}
        />
        <div className="flex items-center justify-end gap-x-3 px-3">
          <button
            type="button"
            className="inline-block h-5 w-5 hover:text-[#ae7aff] transition-colors"
            title="Add emoji"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
              />
            </svg>
          </button>
          <button
            type="button"
            className="inline-block h-5 w-5 hover:text-[#ae7aff] transition-colors"
            title="More options"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
          </button>
          <Button
            type="submit"
            disabled={!tweetContent.trim() || isSubmitting}
            className="px-3 py-2 font-semibold text-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TweetInput;
