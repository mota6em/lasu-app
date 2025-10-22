interface Translation {
  _id: string;
  sourceText: string;
  translationType: string;
  createdAt: string;
  result: {
    translations: Record<string, string>;
    example?: Record<string, string>;
  };
}

export default Translation;

export interface TranslateHook {
  text: string;
  setText: (val: string) => void;
  resultLoading: boolean;
  result: {
    translations?: Record<string, string>;
    example?: Record<string, string>;
  };
  handleTranslate: () => void;
  handlePasteInline: () => void;
  copiedLang: string | null;
  setCopiedLang: (val: string | null) => void;
  toggleSettingsDialog: () => void;
}
