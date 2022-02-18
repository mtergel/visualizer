export type UIArrayElement = {
  id: string;
  value: number;
};

export type UIArray = UIArrayElement[];

export const enum NodeType {
  "Normal",
  "Start",
  "End",
  "Wall",
  "Visited",
}
