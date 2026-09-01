import { Kazagumo } from "kazagumo";
import { Connectors } from "shoukaku";

let client;

export function setClient(c) {
  client = c;
}

export let kazagumo;

export function initKazagumo() {
  kazagumo = new Kazagumo(
    {
      defaultSearchEngine: "youtube"
    },
    new Connectors.DiscordJS(client),
    [
      {
        name: "main",
        url: "lavalinkv4.serenetia.com:443",
        auth: "https://seretia.link/discord", 
        secure: true
      }
    ]
  );
}