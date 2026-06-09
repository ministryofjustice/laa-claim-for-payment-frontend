import type { Message } from '#src/viewmodels/components/message.js';
import { buildRoute, ROUTES } from '#routes/helper.js';

/**
 * View model for the POA claim type page.
 */
export class PoaClaimTypeViewModel {
  readonly title: Message;
  readonly saveAndComeBackLaterHref: string;

  /**
   * Creates a POA claim type view model.
   *
   * @param {number} claimId Claim identifier.
   */
  constructor(claimId: number) {
    this.title = {
      key: 'pages.poaClaimType.title',
    };

    this.saveAndComeBackLaterHref = buildRoute(
      ROUTES.VIEW_CLAIM,
      { claimId },
    );
  }
}