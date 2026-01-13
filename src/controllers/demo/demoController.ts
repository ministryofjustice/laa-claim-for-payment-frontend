import { createProcessedError } from "#src/helpers/errorHandler.js";
import { getAllSearchResults, getAnalysisDoc, getSearchResult } from "#src/services/demo/evidenceService.js";
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
    const results = getAllSearchResults();

    res.render("main/demo/line-items.njk", {
    results,
    });
  } catch (error) {
    const processedError = createProcessedError(error, `Line items page failed`);
    next(processedError);
  }
}


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


    const matchedBlocks = analysisDoc.Blocks.filter(
    (block) =>
        blockIds.includes(block.Id) &&
        block.Geometry?.BoundingBox &&
        block.Page !== undefined,
    );

    const boundingBoxes = matchedBlocks.map((block) => ({
    blockId: block.Id,
    page: block.Page,
    boundingBox: block.Geometry!.BoundingBox,
    }));

    console.log("Bounding boxes for evidence:", boundingBoxes);

    const highlightBox = boundingBoxes[0];

    const mergedBox = (() => {
        if (boundingBoxes.length === 0) return null;

        const left = Math.min(...boundingBoxes.map(b => b.boundingBox.Left));
        const top = Math.min(...boundingBoxes.map(b => b.boundingBox.Top));

        const right = Math.max(
            ...boundingBoxes.map(b => b.boundingBox.Left + b.boundingBox.Width),
        );

        const bottom = Math.max(
            ...boundingBoxes.map(b => b.boundingBox.Top + b.boundingBox.Height),
        );

        return {
            page: boundingBoxes[0].page,
            boundingBox: {
            Left: left,
            Top: top,
            Width: right - left,
            Height: bottom - top,
            },
        };
        })();


    res.render("main/demo/evidence.njk", {
      evidenceId,
      pdfUrl,
      pageNumber,
      highlightBox: mergedBox
    });
  } catch (error) {
    const processedError = createProcessedError(error, `Evidence page failed`);
    next(processedError);
  }
}

