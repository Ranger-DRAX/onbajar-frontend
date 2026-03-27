export type LocationMap = Record<string, string[]>;

export type Zilla = {
  name: string;
  bn: string; // Bangla name — future i18n ready
};

export type Thana = {
  name: string;
  bn: string;
  zilla: string; // parent zilla name
};
