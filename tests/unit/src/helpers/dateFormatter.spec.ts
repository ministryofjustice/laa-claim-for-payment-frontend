/**
 * @description Tests for the utility function formatDate works as expected
 */

import { formatDate } from '#src/helpers/dateFormatter.js';
import { expect } from 'chai';


describe('formatDate()', () => {
  it('formats a valid ISO date string correctly', () => {
    expect(formatDate(new Date('1986-01-06T00:00:00Z'))).to.equal('06/01/1986');
    expect(formatDate(new Date('2023-07-28'))).to.equal('28/07/2023');
    expect(formatDate(new Date('2023/07/28'))).to.equal('28/07/2023');

  });

  it('formats dates with single-digit days with a leading zero', () => {
    expect(formatDate(new Date('2023-2-5'))).to.equal('05/02/2023');
    expect(formatDate(new Date('2023/2/5'))).to.equal('05/02/2023')
  });

    it('handles undefined date by returning empty string', () => {
    expect(formatDate(undefined)).to.equal('');
  });
});