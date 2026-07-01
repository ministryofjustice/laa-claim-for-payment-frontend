import { expect } from "chai";
import sinon from "sinon";
import { buildAnswersCache } from "#src/services/answersCache.js";
import { z } from "zod";

describe("answersCache", () => {
  const redisClient = {
    get: sinon.stub(),
    set: sinon.stub(),
    del: sinon.stub(),
  };

  beforeEach(() => {
    redisClient.get.reset();
    redisClient.set.reset();
    redisClient.del.reset();
  });

  it("stores answers as JSON with a TTL", async () => {
    const answersCache = buildAnswersCache(redisClient as never);

    const answers = {
      fieldOne: "value",
      fieldTwo: ["a", "b"],
    };

    await answersCache.set("session-123", "claim-details", answers);

    expect(
      redisClient.set.calledOnceWithExactly(
        "answers:session-123:claim-details",
        JSON.stringify(answers),
        {
          EX: 60 * 60 * 3,
        },
      ),
    ).to.equal(true);
  });

  it("returns parsed cached string", async () => {
    const answer = "value";

    redisClient.get.resolves(JSON.stringify(answer));

    const answersCache = buildAnswersCache(redisClient as never);

    const result = await answersCache.get(
      "session-123",
      "claim-details",
      z.string(),
    );

    expect(
      redisClient.get.calledOnceWithExactly(
        "answers:session-123:claim-details",
      ),
    ).to.equal(true);

    expect(result).to.equal(answer);
  });

  it("returns parsed cached object", async () => {
    const answer = {
      fieldOne: "value",
      fieldTwo: 1
    };

    redisClient.get.resolves(JSON.stringify(answer));

    const schema = z.object({
      fieldOne: z.string(),
      fieldTwo: z.number(),
    });

    const answersCache = buildAnswersCache(redisClient as never);

    const result = await answersCache.get(
      "session-123",
      "claim-details",
      schema,
    );

    expect(
      redisClient.get.calledOnceWithExactly(
        "answers:session-123:claim-details",
      ),
    ).to.equal(true);

    expect(result).to.deep.equal(answer);
  });

  it("returns null when there are no cached answers", async () => {
    redisClient.get.resolves(null);

    const answersCache = buildAnswersCache(redisClient as never);

    const result = await answersCache.get(
      "session-123",
      "claim-details",
      z.string(),
    );

    expect(result).to.equal(null);
  });

  it("clears cached answers", async () => {
    const answersCache = buildAnswersCache(redisClient as never);

    await answersCache.clear("session-123", "claim-details");

    expect(
      redisClient.del.calledOnceWithExactly(
        "answers:session-123:claim-details",
      ),
    ).to.equal(true);
  });
});