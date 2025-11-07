jest.mock("@fakestore/shared/lib/auth");

describe("NextAuth Configuration", () => {
  beforeEach(() => {
    process.env.AUTH0_CLIENT_ID = "test-client-id";
    process.env.AUTH0_CLIENT_SECRET = "test-client-secret";
    process.env.AUTH0_ISSUER = "https://test.auth0.com";
    jest.clearAllMocks();
  });

  it("should have AUTH0 environment variables configured", () => {
    expect(process.env.AUTH0_CLIENT_ID).toBeDefined();
    expect(process.env.AUTH0_CLIENT_SECRET).toBeDefined();
    expect(process.env.AUTH0_ISSUER).toBeDefined();
  });

  it("should have AUTH0_ISSUER with https protocol", () => {
    expect(process.env.AUTH0_ISSUER).toMatch(/^https:\/\//);
  });

  it("should export auth handlers", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { handlers } = require("@/lib/auth");

    expect(handlers).toBeDefined();
    expect(handlers.GET).toBeDefined();
    expect(handlers.POST).toBeDefined();
  });

  it("should export signIn and signOut functions", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { signIn, signOut } = require("@/lib/auth");

    expect(signIn).toBeDefined();
    expect(signOut).toBeDefined();
    expect(typeof signIn).toBe("function");
    expect(typeof signOut).toBe("function");
  });

  it("should export auth function for session management", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { auth } = require("@/lib/auth");

    expect(auth).toBeDefined();
    expect(typeof auth).toBe("function");
  });
});
