import { InternalServerError } from "infra/errors";
import authorization from "models/authorization";

describe("models/authorization.js", () => {
  describe(".can()", () => {
    test("without user", () => {
      expect(() => {
        authorization.can();
      }).toThrow(InternalServerError);
    });

    test("without user.features", () => {
      expect(() => {
        const createdUser = {
          username: "User without features",
        };
        authorization.can(createdUser);
      }).toThrow(InternalServerError);
    });

    test("with unknown 'feature'", () => {
      expect(() => {
        const createdUser = {
          features: [],
        };
        authorization.can(createdUser, "unknown:feature");
      }).toThrow(InternalServerError);
    });

    test("with valid user and known feature", () => {
      const createdUser = {
        features: ["create:user"],
      };

      expect(authorization.can(createdUser, "create:user")).toBe(true);
    });
  });

  describe(".filterOutput()", () => {
    test("without user", () => {
      expect(() => {
        authorization.filterOutput();
      }).toThrow(InternalServerError);
    });

    test("without user.features", () => {
      expect(() => {
        const createdUser = {
          username: "User without features",
        };
        authorization.filterOutput(createdUser);
      }).toThrow(InternalServerError);
    });

    test("with unknown 'feature'", () => {
      expect(() => {
        const createdUser = {
          features: [],
        };
        authorization.filterOutput(createdUser, "unknown:feature");
      }).toThrow(InternalServerError);
    });

    test("with valid 'user', known 'feature' but no 'resource'", () => {
      expect(() => {
        const createdUser = {
          features: [],
        };
        authorization.filterOutput(createdUser, "read:user");
      }).toThrow(InternalServerError);
    });

    test("with valid user, known feature and resource", () => {
      const createdUser = {
        features: ["read:user"],
      };

      const resource = {
        id: 1,
        username: "Resource",
        features: ["read:user"],
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-01T00:00:00.000Z",
        email: "resource@resource.com",
        password: "resource",
      };

      const result = authorization.filterOutput(
        createdUser,
        "read:user",
        resource,
      );

      expect(result).toEqual({
        id: 1,
        username: "Resource",
        features: ["read:user"],
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-01T00:00:00.000Z",
      });
    });
  });
});
