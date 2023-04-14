import express from "express";
import puppeteer from "puppeteer";
import bunyan from "bunyan";

const log = bunyan.createLogger({ name: "url-to-pdf" });

const app = express();
app.use(express.json());

// Handle invalid json requests gracefully.
app.use((err, _req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    log.error("received invalid json, aborting");
    return res.status(400).send({ error: "invalid json." });
  }
  next();
});

app.post("/", async (req, res) => {
  log.info("received request", req.body);
  const { url, headers } = req.body;

  if (!url) {
    log.error("request is missing url, aborting");
    return res.status(400).send({ error: "url is required." });
  }

  if (!url.startsWith("http") && !url.startsWith("https")) {
    log.error(`url "${url}" is not supported, aborting`);
    return res.status(400).send({ error: "only http and https urls are supported." });
  }

  if (headers && typeof headers !== "object") {
    log.error(`headers "${headers}" is not an object, aborting`);
    return res.status(400).send({ error: "headers must be an object." });
  }

  log.info("launching browser...");
  const browser = await puppeteer.launch();

  log.info("creating new page...");
  const page = await browser.newPage();

  log.info("setting viewport...");
  await page.setViewport({ width: 1920, height: 1080 });

  log.info("setting extra HTTP headers...");
  await page.setExtraHTTPHeaders(headers || {});

  log.info(`navigating to ${url}...`);
  try {
    await page.goto(url);
  } catch (e) {
    const message = `failed to navigate to ${url}. ${e}`;
    log.error(message);
    return res.status(400).send({ error: message });
  }

  log.info("waiting for network idle...");
  await page.waitForNetworkIdle();

  log.info("generating pdf...");
  const pdf = await page.pdf({
    format: "A4",
  });

  log.info("closing browser...");
  await browser.close();

  log.info("sending response...");
  res.contentType("application/pdf").send(pdf);
  log.info("done");
});

app.listen(process.env.PORT || 5555, () => log.info("server started"));
