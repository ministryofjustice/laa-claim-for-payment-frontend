/**
 * @description Tests for the utility functions in escapehtml work as expected
 */

import { expect } from 'chai';
import { escapeHtml } from '#src/helpers/escapehtml.js';

describe('escapeHtml', () => {
  it('escapes ampersands', () => {
    expect(escapeHtml('Tom & Jerry')).to.equal('Tom &amp; Jerry');
  });

  it('escapes angle brackets', () => {
    expect(escapeHtml('<script>')).to.equal('&lt;script&gt;');
  });

  it('escapes quotes and apostrophes', () => {
    expect(escapeHtml(`"hello" 'world'`)).to.equal(
      '&quot;hello&quot; &#39;world&#39;',
    );
  });

  it('escapes multiple HTML-sensitive characters', () => {
    expect(escapeHtml(`<img src="x" onerror='alert(1)' />`)).to.equal(
      '&lt;img src=&quot;x&quot; onerror=&#39;alert(1)&#39; /&gt;',
    );
  });
});