FROM node:24-alpine3.21

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    CYPRESS_INSTALL_BINARY=0 HUSKY=0 pnpm install --frozen-lockfile --store-dir=/pnpm/store

COPY . .

EXPOSE 5173

CMD ["pnpm", "run", "dev"]
