export interface SearchResult {
  _index: string;
  _id: string;
  _version?: number;
  _score?: number | null;

  _source: {
    document_id: string;
    document_name?: string;
    s3_location?: string;

    chunk_id: string;
    chunk_index?: number;
    chunking_strategy?: string;

    chunk_text: string;
    chunk_size?: number;

    embedding_vector?: number[];

    pages?: number[];

    textract_block_ids?: string[];
    textract_job_id?: string;
    textract_json_key?: string;

    model_id?: string;
    timestamp?: string;
  };

  highlight?: {
    [field: string]: string[];
  };

  fields?: {
    [field: string]: unknown;
  };

  sort?: number[];
}
