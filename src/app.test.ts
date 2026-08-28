import { describe, expect, test } from "vitest";
import { authenticate } from "./auth.js";
import { buildApp } from "./app.js";
describe("planted API bugs", () => {
  test("rejects inactive keys", () => {
    expect(authenticate("revoked-token")).toBeNull();
  });
  test("does not trust admin role from body", async () => {
    const app = buildApp();

    const res = await app.inject({
      method: "POST",
      url: "/api/admin/users",
      headers: {
        authorization: "Bearer live-token",
      },
      payload: { role: "admin" },
    });

    expect(res.json().ok).toBe(false);
  });

  test("rejects admin access without authentication", async () => {
    const app = buildApp();

    const res = await app.inject({
      method: "POST",
      url: "/api/admin/users",
      payload: { role: "admin" },
    });

    expect(res.statusCode).toBe(401);
  });

  test("server responds", async () => {
    const app = buildApp();
    const res = await app.inject({ method: "POST", url: "/api/tokens" });
    expect(res.statusCode).toBe(200);
  });
});
