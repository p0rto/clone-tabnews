import activation from "models/activation";
import orchestrator from "tests/orchestrator.js";
import webserver from "infra/webserver.js";
import user from "models/user";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/activations/[token]", () => {
  test("With expired token", async () => {
    jest.useFakeTimers({
      now: new Date(Date.now() - activation.EXPIRATION_IN_MILLISECONDS),
    });

    const createdUser = await orchestrator.createUser();
    const activationToken = await activation.create(createdUser.id);

    jest.useRealTimers();

    const activationTokenResponse = await fetch(
      `${webserver.origin}/api/v1/activations/${activationToken.id}`,
      {
        method: "PATCH",
      },
    );

    expect(activationTokenResponse.status).toBe(404);

    const activationTokenResponseBody = await activationTokenResponse.json();

    expect(activationTokenResponseBody).toEqual({
      name: "NotFoundError",
      message: "O token de ativação utilizado não foi encontrado ou expirou.",
      action: "Faça um novo cadastro.",
      status_code: 404,
    });
  });

  test("With used token", async () => {
    const createdUser = await orchestrator.createUser();
    const activationToken = await activation.create(createdUser.id);

    const activationTokenResponse = await fetch(
      `${webserver.origin}/api/v1/activations/${activationToken.id}`,
      {
        method: "PATCH",
      },
    );

    expect(activationTokenResponse.status).toBe(200);

    const usedActivationTokenResponse = await fetch(
      `${webserver.origin}/api/v1/activations/${activationToken.id}`,
      {
        method: "PATCH",
      },
    );

    expect(usedActivationTokenResponse.status).toBe(404);

    const usedActivationTokenResponseBody =
      await usedActivationTokenResponse.json();

    expect(usedActivationTokenResponseBody).toEqual({
      name: "NotFoundError",
      message: "O token de ativação utilizado não foi encontrado ou expirou.",
      action: "Faça um novo cadastro.",
      status_code: 404,
    });
  });

  test("With valid token", async () => {
    const createdUser = await orchestrator.createUser();
    const activationToken = await activation.create(createdUser.id);

    const activationTokenResponse = await fetch(
      `${webserver.origin}/api/v1/activations/${activationToken.id}`,
      {
        method: "PATCH",
      },
    );

    expect(activationTokenResponse.status).toBe(200);

    const activationTokenResponseBody = await activationTokenResponse.json();

    expect(activationTokenResponseBody.id).toEqual(activationToken.id);
    expect(activationTokenResponseBody.user_id).toEqual(createdUser.id);
    expect(Date.parse(activationTokenResponseBody.used_at)).not.toBeNaN();
    expect(Date.parse(activationTokenResponseBody.created_at)).not.toBeNaN();
    expect(
      activationTokenResponseBody.updated_at >
        activationTokenResponseBody.created_at,
    ).toBe(true);

    const activatedUser = await user.findOneById(createdUser.id);
    expect(activatedUser.features).toEqual([
      "create:session",
      "read:session",
      "update:user",
    ]);
  });
});
