import { buildRoute, ROUTES } from '#routes/helper.js';
import { PoaClaimTypeViewModel } from '#src/viewmodels/poa/poatClaimTypeViewModel.js';
import { processError } from '#src/helpers/index.js';
import type { NextFunction, Request, Response } from 'express';

const PROFIT_COST = 'profit-cost';
const EXPERT_COST = 'expert-cost';
const NON_EXPERT_DISBURSEMENT = 'non-expert-disbursement';

/**
 * Displays the POA claim type page.
 *
 * @param {Request} req Express request object.
 * @param {Response} res Express response object.
 * @param {NextFunction} next Express next function.
 * @returns {void}
 */
export function poaClaimTypePage(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const claimId = Number(req.params.claimId);

    const vm = new PoaClaimTypeViewModel(claimId);

    res.render('main/poa/poaClaimTypeView.njk', {
      vm,
    });
  } catch (error) {
    next(processError(error, 'displaying POA claim type page'));
  }
}

/**
 * Handles submission of the POA claim type page.
 *
 * @param {Request} req Express request object.
 * @param {Response} res Express response object.
 * @param {NextFunction} next Express next function.
 * @returns {void}
 */
export function submitPoaClaimType(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const claimId = Number(req.params.claimId);

     
    const claimType = getClaimType(req.body);

    switch (claimType) {
      case PROFIT_COST:
        res.redirect(
          buildRoute(ROUTES.PROFIT_COST_DETAILS, {
            claimId,
          }),
        );
        return;

      case EXPERT_COST:
        res.redirect(
          buildRoute(ROUTES.EXPERT_COST_DETAILS, {
            claimId,
          }),
        );
        return;

      case NON_EXPERT_DISBURSEMENT:
        res.redirect(
          buildRoute(ROUTES.NON_EXPERT_COST_DETAILS, {
            claimId,
          }),
        );
        return;

      default: {
        const vm = new PoaClaimTypeViewModel(claimId);

        res.render('main/poa/poaClaimTypeView.njk', {
          vm,
          errorSummary: {
            items: [
              {
                text: 'Select what type of POA you are claiming',
                href: '#claimType',
              },
            ],
          },
        });
      }
    }
  } catch (error) {
    next(processError(error, 'submitting POA claim type'));
  }
}


function getClaimType(body: unknown): string | undefined {
  if (
    typeof body === 'object' &&
    body !== null &&
    'claimType' in body &&
    typeof body.claimType === 'string'
  ) {
    return body.claimType;
  }

  return undefined;
}