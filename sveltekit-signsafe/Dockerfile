FROM oven/bun:1.1.13

WORKDIR /app

COPY ./sveltekit-signsafe/package.json ./
COPY ./sveltekit-signsafe/bun.lock ./
RUN bun install

COPY ./sveltekit-signsafe ./

RUN bun run prepare - bun run build

EXPOSE 5173

CMD ["bun", "run", "preview"]

