import server from "./src/infra/server";

const port = process.env.SERVER_PORT ?? 3000;

(() => {
  try {
    server.listen(port, () => {
      console.info(`Server listening on http://localhost:${port}`);
    });
  } catch (err) {
    console.error(err);
  }
})();
