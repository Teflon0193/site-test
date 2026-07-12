/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Temporary compatibility layer.
 *
 * Prisma was removed from the Next.js frontend. This permissive proxy keeps
 * legacy files type-checking while those features are migrated to Express/MySQL.
 * Any real Prisma operation throws at runtime instead of silently succeeding.
 */
const unsupported = (path: string): never => {
  throw new Error(
    `Prisma frontend operation "${path}" is disabled. Use the Node/Express API instead.`
  );
};

const makeProxy = (path = "prisma"): any =>
  new Proxy(function compatibilityProxy() {}, {
    get(_target, property) {
      if (property === "then") return undefined;
      if (property === "$disconnect") return async () => undefined;
      if (property === "$connect") return async () => undefined;
      if (property === "$transaction") {
        return async () => unsupported(`${path}.$transaction`);
      }

      return makeProxy(`${path}.${String(property)}`);
    },
    apply() {
      return unsupported(path);
    },
  });

const prisma = makeProxy();

export default prisma;
