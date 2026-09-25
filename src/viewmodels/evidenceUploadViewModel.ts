import config from "#config.js";
import type { Message } from "#src/viewmodels/components/message.js";
import type { ReusableDocument } from "#src/viewmodels/components/taskList.js";
import type { EvidenceItem } from "#src/types/Claim.js";
import { formatFileSize } from "#src/helpers/fileSizeFormatter.js";
import type { ErrorSummary } from "#src/viewmodels/components/errorSummary.js";

/**
 *
 */
export abstract class EvidenceUploadViewModel {
  abstract readonly title: string | Message;
  abstract readonly uploadUrl: string;
  abstract readonly deleteUrl: string;
  abstract readonly saveAndContinueHref: string;
  readonly reusableDocuments: ReusableDocument[];
  readonly uploadedFiles: ReusableDocument[];
  abstract readonly errorSummary?: ErrorSummary;
  readonly maxFileSize: string;

  protected constructor(
    evidence: EvidenceItem[],
    existingIds: Iterable<string>,
  ) {
    const ids = new Set(existingIds);

    this.reusableDocuments = evidence
      .filter(({ id }) => !ids.has(id))
      .map((evidence) =>
        EvidenceUploadViewModel.buildReusableDocument(evidence),
      );

    this.uploadedFiles = evidence
      .filter(({ id }) => ids.has(id))
      .map((evidence) =>
        EvidenceUploadViewModel.buildReusableDocument(evidence),
      );

    this.maxFileSize = formatFileSize(
      config.constants.maxEvidenceFileSizeBytes,
    );
  }

  private static buildReusableDocument(
    evidence: EvidenceItem,
  ): ReusableDocument {
    return {
      id: evidence.id,
      name: evidence.fileKey,
      size: formatFileSize(evidence.fileSize),
    };
  }
}
