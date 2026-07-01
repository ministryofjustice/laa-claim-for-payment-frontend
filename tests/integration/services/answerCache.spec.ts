import { expect } from "chai";
import { createClient, RedisClientType } from "redis";
import { z } from "zod";
import { buildAnswersCache } from "#src/services/answersCache.js";

const redis = createClient({
  url: "redis://localhost:6379",
});

const cache = buildAnswersCache(redis as RedisClientType);

const sessionId = "test-session";
const claimId = 123;

describe("answersCache integration tests", () => {
  beforeEach(async () => {
    if (!redis.isOpen) {
      await redis.connect();
    }

    await cache.clear(sessionId, claimId);
  });

  after(async () => {
    if (redis.isOpen) {
      await redis.quit();
    }
  });

  it("sets and gets a string", async () => {
    const path = ["poa", "claimType"];

    await cache.set(sessionId, claimId, path, "expert-cost");

    const result = await cache.get(sessionId, claimId, path, z.string());

    expect(result).to.equal("expert-cost");
  });

  it("sets and gets a number", async () => {
    const path = ["poa", "amount"];

    await cache.set(sessionId, claimId, path, 123);

    const result = await cache.get(sessionId, claimId, path, z.number());

    expect(result).to.equal(123);
  });

  it("sets and gets a boolean", async () => {
    const path = ["poa", "bool"];

    await cache.set(sessionId, claimId, path, true);

    const result = await cache.get(sessionId, claimId, path, z.boolean());

    expect(result).to.equal(true);
  });

  it("sets and gets an object", async () => {
    const path = ["poa", "details"];

    const details = {
      amount: 100,
      description: "Report",
    };

    await cache.set(sessionId, claimId, path, details);

    const result = await cache.get(
      sessionId,
      claimId,
      path,
      z.object({
        amount: z.number(),
        description: z.string(),
      }),
    );

    expect(result).to.deep.equal(details);
  });

  it("sets and gets a complex object", async () => {
    const body = {
      amount: 100,
      description: "Report",
    };

    await cache.set(
      sessionId,
      claimId,
      ["poa", "expertCosts", 0, "details", 0],
      body,
    );

    const result = await cache.get(
      sessionId,
      claimId,
      ["poa", "expertCosts", 0, "details"],
      z.array(
        z.object({
          amount: z.number(),
          description: z.string(),
        })
      ),
    );

    expect(result).to.deep.equal([body]);
  });

  it("appends the first array element", async () => {
    const body = {
      amount: 100,
    };

    await cache.set(sessionId, claimId, ["poa", "expertCost", 0], body);

    const result = await cache.get(
      sessionId,
      claimId,
      ["poa", "expertCost"],
      z.array(
        z.object({
          amount: z.number(),
        }),
      ),
    );

    expect(result).to.deep.equal([body]);
  });

  it("fails to append the second array element in an empty array", async () => {
    await cache.set(sessionId, claimId, ["poa", "expertCost", 1], {
      amount: 100,
    });

    const result = await cache.get(
      sessionId,
      claimId,
      ["poa", "expertCost"],
      z.array(
        z.object({
          amount: z.number(),
        }),
      ),
    );

    expect(result).to.deep.equal([]);
  });

  it("appends multiple array elements", async () => {
    await cache.set(sessionId, claimId, ["poa", "expertCost", 0], {
      amount: 100,
    });

    await cache.set(sessionId, claimId, ["poa", "expertCost", 1], {
      amount: 200,
    });

    const result = await cache.get(
      sessionId,
      claimId,
      ["poa", "expertCost"],
      z.array(
        z.object({
          amount: z.number(),
        }),
      ),
    );

    expect(result).to.deep.equal([{ amount: 100 }, { amount: 200 }]);
  });

  it("updates an existing array element", async () => {
    await cache.set(sessionId, claimId, ["poa", "expertCost", 0], {
      amount: 100,
    });

    await cache.set(sessionId, claimId, ["poa", "expertCost", 0], {
      amount: 150,
    });

    const result = await cache.get(
      sessionId,
      claimId,
      ["poa", "expertCost", 0],
      z.object({
        amount: z.number(),
      }),
    );

    expect(result).to.deep.equal({
      amount: 150,
    });
  });

  it("updates a property on an existing array element", async () => {
    await cache.set(sessionId, claimId, ["poa", "expertCost", 0], {
      amount: 100,
    });

    await cache.set(
      sessionId,
      claimId,
      ["poa", "expertCost", 0, "approved"],
      true,
    );

    const result = await cache.get(
      sessionId,
      claimId,
      ["poa", "expertCost", 0],
      z.object({
        amount: z.number(),
        approved: z.boolean(),
      }),
    );

    expect(result).to.deep.equal({
      amount: 100,
      approved: true,
    });
  });

  it("returns null for a missing path", async () => {
    const result = await cache.get(
      sessionId,
      claimId,
      ["doesNotExist"],
      z.string(),
    );

    expect(result).to.be.null;
  });

  it("builds a complex document", async () => {
    await cache.set(sessionId, claimId, ["poa", "claimType"], "expert-cost");

    await cache.set(sessionId, claimId, ["poa", "expertCost", 0], {
      amount: 100,
    });

    await cache.set(
      sessionId,
      claimId,
      ["poa", "expertCost", 0, "approved"],
      true,
    );

    const result = await cache.get(
      sessionId,
      claimId,
      ["poa"],
      z.object({
        claimType: z.string(),
        expertCost: z.array(
          z.object({
            amount: z.number(),
            approved: z.boolean(),
          }),
        ),
      }),
    );

    expect(result).to.deep.equal({
      claimType: "expert-cost",
      expertCost: [
        {
          amount: 100,
          approved: true,
        },
      ],
    });
  });
});