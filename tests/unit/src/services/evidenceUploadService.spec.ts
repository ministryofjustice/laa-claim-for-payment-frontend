import { expect } from 'chai';
import sinon from 'sinon';
import { uploadLineItemEvidence } from '#src/services/evidenceUploadService.js';

describe('evidenceUploadService', () => {
  it('posts uploaded file to the backend and returns upload response', async () => {
    const post = sinon.stub().resolves({ data: {} });

    const file = {
      originalname: 'evidence.pdf',
      mimetype: 'application/pdf',
      size: 12345,
      buffer: Buffer.from('fake pdf content'),
    } as Express.Multer.File;

    const result = await uploadLineItemEvidence({
      axiosMiddleware: { post },
      claimId: 3,
      lineItemId: 2,
      file,
    });

    expect(post.calledOnce).to.equal(true);
    expect(post.firstCall.args[0]).to.equal(
      'http://localhost:8080/api/v1/claims/3/line-items/2/upload-evidence',
    );

    expect(result.file).to.deep.equal({
      filename: 'evidence.pdf',
      originalname: 'evidence.pdf',
    });

    expect(result.success.messageText).to.equal('evidence.pdf uploaded');
    expect(result.success.messageHtml).to.include('evidence.pdf');
    expect(result.success.messageHtml).to.include('12KB');
    expect(result.success.messageHtml).to.include('Uploaded');
  });

  it('escapes file names in the success HTML', async () => {
    const post = sinon.stub().resolves({ data: {} });

    const file = {
      originalname: '<script>.pdf',
      mimetype: 'application/pdf',
      size: 12345,
      buffer: Buffer.from('fake pdf content'),
    } as Express.Multer.File;

    const result = await uploadLineItemEvidence({
      axiosMiddleware: { post },
      claimId: 3,
      lineItemId: 2,
      file,
    });

    expect(result.success.messageHtml).to.include('&lt;script&gt;.pdf');
  });
});