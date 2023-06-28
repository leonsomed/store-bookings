'use client';

import { CopyClipboardIcon } from './icons/CopyClipboardIcon';

export interface IDProps {
  id?: string;
}

export default function ID({ id }: IDProps) {
  const shortId = id.split('-').pop();
  return (
    <div className="flex items-center">
      {shortId}
      <button
        className="text-primary-600 hover:text-primary-300 ml-1"
        title="Copy to clipboard"
        onClick={() => {
          navigator.clipboard.writeText(id);
        }}
      >
        <CopyClipboardIcon />
      </button>
    </div>
  );
}
