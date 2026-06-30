import { expect } from "chai";
import sinon from "sinon";
import { buildAnswersCache } from "#src/services/answersCache.js";

describe("answersCache", () => {
  const redisClient = {
    get: sinon.stub(),
    set: sinon.stub(),
    del: sinon.stub(),
  };

  beforeEach(() => {
    sinon.reset();
  });

  it("stores answers as JSON with a TTL", async () => {
    const answersCache = buildAnswersCache(redisClient as never);

    const answers = {
      fieldOne: "value",
      fieldTwo: ["a", "b"],
    };

    await answersCache.set("session-123", "claim-details", answers);

    expect(redisClient.set.calledOnceWithExactly(
      "answers:session-123:claim-details",
      JSON.stringify(answers),
      {
        EX: 60 * 60 * 3,
      },
    )).to.equal(true);
  });

  it("returns parsed cached answers", async () => {
    redisClient.get.resolves(JSON.stringify({ fieldOne: "value" }));

    const answersCache = buildAnswersCache(redisClient as never);

    const result = await answersCache.get<{ fieldOne: string }>(
      "session-123",
      "claim-details",
    );

    expect(redisClient.get.calledOnceWithExactly(
      "answers:session-123:claim-details",
    )).to.equal(true);

    expect(result).to.deep.equal({
      fieldOne: "value",
    });
  });

  it("returns null when there are no cached answers", async () => {
    redisClient.get.resolves(null);

    const answersCache = buildAnswersCache(redisClient as never);

    const result = await answersCache.get("session-123", "claim-details");

    expect(result).to.equal(null);
  });

  it("returns null when cached answers are not valid JSON", async () => {
    redisClient.get.resolves("not-json");

    const answersCache = buildAnswersCache(redisClient as never);

    const result = await answersCache.get("session-123", "claim-details");

    expect(result).to.equal(null);
    });

  it("clears cached answers", async () => {
    const answersCache = buildAnswersCache(redisClient as never);

    await answersCache.clear("session-123", "claim-details");

    expect(redisClient.del.calledOnceWithExactly(
      "answers:session-123:claim-details",
    )).to.equal(true);
  });
});