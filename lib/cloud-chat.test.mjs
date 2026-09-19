import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url, { tsconfigPaths: true });
const {
  buildCloudChatDocument,
  cloudChatErrorKey,
  publishCloudChat,
  startGitHubDeviceLogin,
  pollGitHubDeviceLogin,
  startWebDavAccountLogin,
  pollWebDavAccountLogin,
  connectWebDavAccount,
  connectFeishuAccount,
  CloudChatError,
} = await jiti.import("./cloud-chat.ts");

test("builds a markdown transcript without leaking image bytes", () => {
  const document = buildCloudChatDocument("sess-1", [
    {
      type: "message",
      id: "1",
      parentId: null,
      timestamp: "2026-01-01T00:00:00.000Z",
      message: { role: "user", content: "Hello from the project" },
    },
    {
      type: "message",
      id: "2",
      parentId: "1",
      timestamp: "2026-01-01T00:00:01.000Z",
      message: {
        role: "assistant",
        model: "test",
        provider: "test",
        content: [
          { type: "text", text: "Reply" },
          { type: "image", source: { type: "base64", data: "SECRETIMAGE" } },
        ],
      },
    },
  ]);
  assert.equal(document.title, "Hello from the project");
  assert.match(document.markdown, /### User/);
  assert.match(document.markdown, /Reply/);
  assert.match(document.markdown, /\[image\]/);
  assert.doesNotMatch(document.markdown, /SECRETIMAGE/);
  assert.match(document.filename, /sess-1/);
});

test("maps unknown upstream codes to a generic localized error", () => {
  assert.equal(cloudChatErrorKey("MISSING_CREDENTIALS"), "cloud.errorMissingCredentials");
  assert.equal(cloudChatErrorKey("UPSTREAM_HTML_RESPONSE"), "cloud.errorUpstreamHtml");
  assert.equal(cloudChatErrorKey("token=secret"), "cloud.error");
});

const sampleDocument = {
  title: "Hello from the project",
  markdown: "# Hello from the project\n\nReply\n",
  filename: "pi-chat-sess-1.md",
};

test("publishes a GitHub gist without returning secrets", async () => {
  const fetches = [];
  const result = await publishCloudChat("sess-1", "github", {
    document: sampleDocument,
    store: { version: 1, github: { token: "ghp_secret", public: false } },
    fetchImpl: async (url, init) => {
      fetches.push({ url: String(url), init });
      const payload = JSON.parse(String(init.body));
      assert.equal(payload.public, false);
      assert.equal(payload.files["pi-chat-sess-1.md"].content.includes("Reply"), true);
      assert.equal(JSON.stringify(payload).includes("ghp_secret"), false);
      return new Response(JSON.stringify({ html_url: "https://gist.github.com/abc" }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    },
  });
  assert.equal(result.destination, "github");
  assert.equal(result.url, "https://gist.github.com/abc");
  assert.equal(fetches[0]?.url, "https://api.github.com/gists");
  const auth = fetches[0]?.init?.headers?.Authorization ?? fetches[0]?.init?.headers?.authorization;
  assert.equal(auth, "Bearer ghp_secret");
});

test("uploads markdown to a WebDAV folder", async () => {
  const fetches = [];
  const result = await publishCloudChat("sess-1", "webdav", {
    document: sampleDocument,
    store: {
      version: 1,
      webdav: {
        url: "https://dav.example/remote.php/webdav/",
        username: "alice",
        password: "pw",
      },
    },
    fetchImpl: async (url, init) => {
      fetches.push({ url: String(url), method: init.method, body: String(init.body) });
      return new Response(null, { status: 201 });
    },
  });
  assert.equal(result.destination, "webdav");
  assert.equal(result.url, "https://dav.example/remote.php/webdav/pi-chat-sess-1.md");
  assert.equal(fetches[0]?.method, "PUT");
  assert.match(fetches[0]?.body ?? "", /Reply/);
});

test("sends Feishu webhook text without echoing the webhook URL", async () => {
  const fetches = [];
  const result = await publishCloudChat("sess-1", "feishu", {
    document: sampleDocument,
    store: {
      version: 1,
      feishu: { mode: "webhook", webhookUrl: "https://open.feishu.cn/open-apis/bot/v2/hook/secret" },
    },
    fetchImpl: async (url, init) => {
      fetches.push({ url: String(url), body: String(init.body) });
      return new Response(JSON.stringify({ StatusCode: 0 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    },
  });
  assert.equal(result.destination, "feishu");
  assert.equal(result.url, undefined);
  assert.match(fetches[0]?.url ?? "", /feishu\.cn/);
  assert.match(fetches[0]?.body ?? "", /Hello from the project/);
  assert.equal(JSON.stringify(result).includes("secret"), false);
});

test("rejects missing credentials and non-Feishu webhook hosts", async () => {
  await assert.rejects(
    () => publishCloudChat("sess-1", "github", {
      document: sampleDocument,
      store: { version: 1 },
      fetchImpl: async () => new Response("no"),
    }),
    (error) => error instanceof CloudChatError && error.code === "MISSING_CREDENTIALS",
  );
  await assert.rejects(
    () => publishCloudChat("sess-1", "feishu", {
      document: sampleDocument,
      store: { version: 1, feishu: { mode: "webhook", webhookUrl: "https://example.com/hook" } },
      fetchImpl: async () => new Response("no"),
    }),
    (error) => error instanceof CloudChatError && error.code === "INVALID_CREDENTIALS",
  );
});

test("rejects HTML challenge bodies instead of treating them as success", async () => {
  await assert.rejects(
    () => publishCloudChat("sess-1", "github", {
      document: sampleDocument,
      store: { version: 1, github: { token: "ghp_secret" } },
      fetchImpl: async () => new Response("<html>challenge</html>", {
        status: 200,
        headers: { "Content-Type": "text/html", "cf-mitigated": "challenge" },
      }),
    }),
    (error) => error instanceof CloudChatError && error.code === "UPSTREAM_CHALLENGE",
  );
});

test("GitHub device login keeps the device code server-side and stores the account login", async (t) => {
  const { mkdtemp, readFile, rm } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const previous = process.env.PI_GITHUB_CLIENT_ID;
  process.env.PI_GITHUB_CLIENT_ID = "Iv1.testclient";
  t.after(() => {
    if (previous === undefined) delete process.env.PI_GITHUB_CLIENT_ID;
    else process.env.PI_GITHUB_CLIENT_ID = previous;
  });
  const dir = await mkdtemp(join(tmpdir(), "pi-github-login-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const storePath = join(dir, "cloud-chat.json");
  const fetches = [];
  const started = await startGitHubDeviceLogin(async (url, init) => {
    fetches.push({ url: String(url), body: String(init.body) });
    return new Response(JSON.stringify({
      device_code: "device-secret",
      user_code: "ABCD-EFGH",
      verification_uri: "https://github.com/login/device",
      expires_in: 900,
      interval: 5,
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  });
  assert.equal(started.userCode, "ABCD-EFGH");
  assert.equal(started.verificationUri, "https://github.com/login/device");
  assert.match(started.loginId, /[0-9a-f-]{36}/i);
  assert.equal(JSON.stringify(started).includes("device-secret"), false);

  const pending = await pollGitHubDeviceLogin(started.loginId, async (url, init) => {
    fetches.push({ url: String(url), body: String(init?.body ?? "") });
    return new Response(JSON.stringify({ error: "authorization_pending" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }, storePath);
  assert.equal(pending.pending, true);

  const linked = await pollGitHubDeviceLogin(started.loginId, async (url, init) => {
    fetches.push({ url: String(url), body: String(init?.body ?? "") });
    if (String(url).includes("/user")) {
      return new Response(JSON.stringify({ login: "octocat" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ access_token: "gho_secret" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }, storePath);
  assert.deepEqual(linked, { login: "octocat", authMode: "account" });
  const saved = JSON.parse(await readFile(storePath, "utf8"));
  assert.equal(saved.github.token, "gho_secret");
  assert.equal(saved.github.login, "octocat");
  assert.equal(saved.github.authMode, "account");
  assert.equal(fetches.some((item) => item.body?.includes("device-secret")), true);
});

test("WebDAV account login keeps the poll token server-side and stores the username", async (t) => {
  const { mkdtemp, readFile, rm } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const dir = await mkdtemp(join(tmpdir(), "pi-webdav-login-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const storePath = join(dir, "cloud-chat.json");
  const started = await startWebDavAccountLogin("https://cloud.example/remote.php/dav/files/alice/", async (url) => {
    assert.match(String(url), /\/index\.php\/login\/v2$/);
    return new Response(JSON.stringify({
      poll: { token: "poll-secret", endpoint: "https://cloud.example/index.php/login/v2/poll" },
      login: "https://cloud.example/index.php/login/v2/flow/abc",
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  });
  assert.match(started.loginId, /[0-9a-f-]{36}/i);
  assert.equal(started.loginUrl, "https://cloud.example/index.php/login/v2/flow/abc");
  assert.equal(JSON.stringify(started).includes("poll-secret"), false);

  const pending = await pollWebDavAccountLogin(started.loginId, async () => (
    new Response("", { status: 404 })
  ), storePath);
  assert.equal(pending.pending, true);

  const linked = await pollWebDavAccountLogin(started.loginId, async (url, init) => {
    assert.equal(String(url), "https://cloud.example/index.php/login/v2/poll");
    assert.equal(String(init?.body ?? "").includes("poll-secret"), true);
    return new Response(JSON.stringify({
      server: "https://cloud.example",
      loginName: "alice",
      appPassword: "app-secret",
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  }, storePath);
  assert.deepEqual(linked, {
    username: "alice",
    url: "https://cloud.example/remote.php/dav/files/alice/",
  });
  const saved = JSON.parse(await readFile(storePath, "utf8"));
  assert.equal(saved.webdav.username, "alice");
  assert.equal(saved.webdav.password, "app-secret");
});

test("WebDAV account login maps HTML endpoints to unsupported sign-in", async () => {
  await assert.rejects(
    () => startWebDavAccountLogin("https://dav.example/remote.php/webdav/", async () => (
      new Response("<html>not found</html>", {
        status: 404,
        headers: { "Content-Type": "text/html" },
      })
    )),
    (error) => error instanceof CloudChatError && error.code === "WEBDAV_LOGIN_UNSUPPORTED",
  );
});

test("WebDAV username/password connect verifies PROPFIND before storing", async (t) => {
  const { mkdtemp, readFile, rm } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const dir = await mkdtemp(join(tmpdir(), "pi-webdav-connect-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const storePath = join(dir, "cloud-chat.json");
  const linked = await connectWebDavAccount({
    url: "https://dav.example/remote.php/webdav/",
    username: "bob",
    password: "pw",
  }, async (url, init) => {
    assert.equal(String(url), "https://dav.example/remote.php/webdav/");
    assert.equal(init?.method, "PROPFIND");
    return new Response("<d:multistatus/>", { status: 207, headers: { "Content-Type": "application/xml" } });
  }, storePath);
  assert.equal(linked.username, "bob");
  const saved = JSON.parse(await readFile(storePath, "utf8"));
  assert.equal(saved.webdav.password, "pw");
});

test("Feishu bot connect verifies the tenant token before storing", async (t) => {
  const { mkdtemp, readFile, rm } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const dir = await mkdtemp(join(tmpdir(), "pi-feishu-connect-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const storePath = join(dir, "cloud-chat.json");
  const linked = await connectFeishuAccount({
    mode: "bot",
    appId: "cli_test",
    appSecret: "secret",
    receiveId: "oc_chat",
  }, async (url) => {
    assert.match(String(url), /tenant_access_token/);
    return new Response(JSON.stringify({ tenant_access_token: "t-secret" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }, storePath);
  assert.deepEqual(linked, { mode: "bot" });
  const saved = JSON.parse(await readFile(storePath, "utf8"));
  assert.equal(saved.feishu.appSecret, "secret");
  assert.equal(saved.feishu.receiveId, "oc_chat");
});
