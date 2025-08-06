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
