import type { SerializedEditorState } from "lexical";

export type { SerializedEditorState };

export interface ContentEditorProps {
  value?: SerializedEditorState | null;
  onChange?: (state: SerializedEditorState) => void;
  placeholder?: string;
  editable?: boolean;
  namespace?: string;
  className?: string;
}

export interface ContentRendererProps {
  value: SerializedEditorState;
  className?: string;
}
