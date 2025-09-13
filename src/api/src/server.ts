import createApp from "./app";

const server = createApp()


server.listen({ port: 3455 }, (err) => {
  if (err) {
    return console.error(err);
  }

  console.log(`Servidor iniciado`);
});