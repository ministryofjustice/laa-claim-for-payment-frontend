import { expect } from "chai";
import sinon from "sinon";
import { buildAnswersCache } from "#src/services/answersCache.js";
import { z } from "zod";

const sessionId = "session-123";
const claimId = 1;

describe("answersCache", () => {
  const redisClient = {
    json: {
      get: sinon.stub(),
      set: sinon.stub(),
      arrAppend: sinon.stub(),
      arrLen: sinon.stub(),
    },
    expire: sinon.stub(),
    del: sinon.stub(),
  };

  beforeEach(() => {
    sinon.resetHistory();

    redisClient.json.get.reset();
    redisClient.json.set.reset();
    redisClient.json.arrAppend.reset();
    redisClient.json.arrLen.reset();
    redisClient.expire.reset();
    redisClient.del.reset();
  });

  it("sets a simple object value", async () => {
    const cache = buildAnswersCache(redisClient as never);

    await cache.set(sessionId, claimId, ["poa"], { field: "value" });

    expect(redisClient.json.set.called).to.equal(true);
    expect(redisClient.expire.calledOnce).to.equal(true);

    const [key1, path1, value1] = redisClient.json.set.firstCall.args;

    expect(key1).to.equal("answers:session-123:1");
    expect(path1).to.equal("$");
    expect(value1).to.deep.equal({});

    const [key2, path2, value2] = redisClient.json.set.secondCall.args;

    expect(key2).to.equal("answers:session-123:1");
    expect(path2).to.equal("$.poa");
    expect(value2).to.deep.equal({ field: "value" });
  });

  it("gets and parses a primitive value", async () => {
    const cache = buildAnswersCache(redisClient as never);

    redisClient.json.get.resolves(["expert-cost"]);

    const result = await cache.get(
      sessionId,
      claimId,
      ["poa", "claimType"],
      z.string(),
    );

    expect(redisClient.json.get.calledOnce).to.equal(true);
    expect(result).to.equal("expert-cost");
  });

  it("returns null when JSON path is missing", async () => {
    const cache = buildAnswersCache(redisClient as never);

    redisClient.json.get.resolves([]);

    const result = await cache.get(
      sessionId,
      claimId,
      ["does", "not", "exist"],
      z.string(),
    );

    expect(result).to.equal(null);
  });

  it("sets array element using ARRAPPEND when index is new", async () => {
    const cache = buildAnswersCache(redisClient as never);

    redisClient.json.get.resolves([]);

    await cache.set(sessionId, claimId, ["poa", "expertCost", 0], {
      amount: 100,
    });

    expect(redisClient.json.arrAppend.calledOnce).to.equal(true);

    const [key, path, value] = redisClient.json.arrAppend.firstCall.args;

    expect(key).to.equal("answers:session-123:1");
    expect(path).to.equal("$.poa.expertCost");
    expect(value).to.deep.equal({ amount: 100 });
  });

  it("overwrites existing array element using JSON.SET", async () => {
    const cache = buildAnswersCache(redisClient as never);

    redisClient.json.get
      .onFirstCall()
      .resolves([{}])
      .onSecondCall()
      .resolves([{ amount: 100 }]);

    await cache.set(sessionId, claimId, ["poa", "expertCost", 0], {
      amount: 200,
    });

    expect(redisClient.json.set.called).to.equal(true);
  });

  it("clears cached document", async () => {
    const cache = buildAnswersCache(redisClient as never);

    await cache.clear(sessionId, claimId);

    expect(
      redisClient.del.calledOnceWithExactly("answers:session-123:1"),
    ).to.equal(true);
  });

  it("validates with Zod on get", async () => {
    const cache = buildAnswersCache(redisClient as never);

    redisClient.json.get.resolves(["123"]);

    const result = await cache.get(
      sessionId,
      claimId,
      ["poa", "amount"],
      z.coerce.number(),
    );

    expect(result).to.equal(123);
  });
});