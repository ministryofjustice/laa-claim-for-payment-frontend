export interface AnalysisDoc {
  Blocks: TextractBlock[];
}

export type TextractBlock =
  | TextractPageBlock
  | TextractLineBlock
  | TextractGenericBlock;

interface TextractBaseBlock {
  Id: string;
  BlockType: string;
  Page?: number;
  Geometry?: Geometry;
  Relationships?: Relationship[];
}

export interface TextractPageBlock extends TextractBaseBlock {
  BlockType: "PAGE";
  Page: number;
}

export interface TextractLineBlock extends TextractBaseBlock {
  BlockType: "LINE";
  Text: string;
  Confidence?: number;
  Page: number;
}

export interface TextractGenericBlock extends TextractBaseBlock {
  // fallback for WORD, TABLE, CELL, etc.
}

export interface Geometry {
  BoundingBox: BoundingBox;
  Polygon?: Point[];
}

export interface BoundingBox {
  Width: number;
  Height: number;
  Left: number;
  Top: number;
}

export interface Point {
  X: number;
  Y: number;
}

export interface Relationship {
  Type: string;
  Ids: string[];
}
