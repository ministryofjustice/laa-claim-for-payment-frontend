import { createProcessedError } from "#src/helpers/errorHandler.js";
import { getAnalysisDoc, getSearchResult } from "#src/services/demo/evidenceService.js";
import type { Request, Response, NextFunction } from "express";

/**
 * line items view
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 * @returns {Promise<void>} Page to be returned
 */
export async function lineItemsPage(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    res.render("main/demo/line-items.njk");
  } catch (error) {
    const processedError = createProcessedError(error, `Line items page failed`);
    next(processedError);
  }
}

const MOCK_EVIDENCE_LOOKUP: Record<
  string,
  { documentId: string; pageNumber?: number }
> = {
  db60f0989db7ca7bcfaf4681a4290489: {
    documentId: "mixed_expenses.pdf",
    pageNumber: 2,
  },
};


/**
 * evidence view
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Express next function
 * @returns {Promise<void>} Page to be returned
 */
export async function evidencePage(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const evidenceId =
    typeof req.query.evidenceId === "string" ? req.query.evidenceId : "";

    if (!evidenceId) {
    throw new Error("Missing evidenceId");
    }

    const searchResult = getSearchResult(evidenceId);

    // _id -> textract_block_ids[] -> analaysisJson.Id  == highlighted.
    const blockIds = searchResult._source.textract_block_ids ?? [];

    const analysisDoc = getAnalysisDoc(searchResult._source.document_id);
    const pages = Array.from(
    new Set(
        analysisDoc.Blocks
        .filter(
            (block) =>
            blockIds.includes(block.Id) && block.Page !== undefined,
        )
        .map((block) => block.Page as number),
    ),
    ).sort((a, b) => a - b);

    const pageNumber = pages[0];
    // MVP: served from /public/demo
    const pdfUrl = `/demo/${searchResult._source.document_id}`;

    res.render("main/demo/evidence.njk", {
      evidenceId,
      pdfUrl,
      pageNumber,
    });
  } catch (error) {
    const processedError = createProcessedError(error, `Evidence page failed`);
    next(processedError);
  }
}

