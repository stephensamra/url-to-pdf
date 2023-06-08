# url-to-pdf

[![Docker](https://img.shields.io/badge/Docker-stephensamra%2Furl--to--pdf-blue)](https://hub.docker.com/r/stephensamra/url-to-pdf)

This is a Node.js API that generates a PDF from a given URL. The PDF is generated using [Puppeteer](https://pptr.dev).

## Installation

The application is available as a Docker image on Docker Hub: `stephensamra/url-to-pdf`.

Using `docker run`:

```bash
docker run --rm -p 5555:5555 --cap-add=SYS_ADMIN --name pdf-generator stephensamra/url-to-pdf
```

In a `docker-compose` file:

```yaml
version: '3.7'
services:
  pdf-generator:
    image: 'stephensamra/url-to-pdf'
    ports:
      - '5555:5555'
    cap_add:
      - SYS_ADMIN
```

`SYS_ADMIN` is required to run Puppeteer in a container.

## Usage

Once the container is running, you can generate a PDF by making a `POST` request to the root endpoint of the server (e.g. `http://localhost:5555`) with the following `JSON` payload:

```json
{
  "url": "https://example.com"
}
```

You can also pass headers to the request which will be included in the request to `url`:

```json
{
  "url": "https://example.com",
  "headers": {
    "Authorization": "Bearer xxx"
  }
}
```

The server will respond with the generated PDF document as the response body.

### cURL example

```bash
curl --request POST \
  --url http://localhost:5555 \
  --header 'content-type: application/json' \
  --data '{"url": "https://example.com"}'
```

## Request body

| Property | Type | Required | Description |
| - | - | - | - |
| `url` | `string` | Yes | The URL of the webpage to be converted to a PDF document. |
| `headers` | `object` | No | Headers to be passed with the HTTP request. |

## Responses

| Status code | Response |
| - | - |
| `200` | The generated PDF document. |
| `400` | `{"error": "invalid json."}`  |
| `400` | `{"error": "url is required."}` |
| `400` | `{"error": "only http and https urls are supported."}` |
| `400` | `{"error": "headers must be an object."}`
| `400` | `{"error": "failed to navigate to {{ url }}. {{ puppeteer error }}"}` |

## Development
```bash
# Clone the repository
git clone ssh://github.com/stephensamra/url-to-pdf.git
cd url-to-pdf

# Install dependencies
yarn

# Run the server
yarn dev
```

By default, the dev server will run on port `5555`. You can change this by setting the `PORT` environment variable before running the server.

```bash
# Run the server on port 3333 instead of 5555
PORT=3333 yarn dev
```
