<a name="readme-top"></a>

<div align="center">

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![NPM][npm-shield]][npm-url]

</div>

<br />
<div align="center">
  <a href="https://github.com/lottojs/lotto">
    <img src=".github/logo.png" alt="Logo" width="100" height="115">
  </a>

  <h3 align="center">@lottojs/lotto</h3>

  <p align="center">
    Simple, lightweight and dependency-free NodeJS web application framework.
    <br />
    <br />
    <a href="https://github.com/lottojs/lotto/blob/main/sample/index.ts">Sample</a>
    ·
    <a href="https://github.com/lottojs/lotto/issues">Report Bug</a>
    ·
    <a href="https://github.com/lottojs/lotto/issues">Request Feature</a>
  </p>
</div>


## About The Project

Lorenzo Lotto was a Venetian painter who lived in the [Serenissima Repubblica di Venezia][serenissima-url] and was one of the main exponents of the Venetian Renaissance of the early sixteenth century.

[@lottojs/lotto](https://github.com/lottojs/lotto) is a simple, lightweight and dependency-free NodeJS web application framework, thought to help building apis on a quickly way due to the provision of prefabricated middlewares and helpers.

## Documentation
Complete API documentation will be available soon at [lotto.dev](https://lotto.dev).

## Getting Started

### Installation
   ```sh
    npm i @lottojs/lotto
   ```
### Usage
Designed to be simple...
```typescript
    import { Lotto } from '@lottojs/lotto'

    const app = new Lotto()

    app.get('/ping', ({ res }) => res.text('pong.'))

    app.init()
```

## Features

- Fast 🚀 - Router based on RegExp.
- Lightweight 🪶 - Lotto has zero external dependencies and uses only the [node:http](https://nodejs.org/api/http.html) api.
- Prefabricated 📦 - Lotto has built-in middlewares ([@lottojs/body-parser](https://github.com/lottojs/body-parser) and [@lottojs/params-parser](https://github.com/lottojs/params-parser)), built-in helpers and supports custom middlewares.
- Route Nesting 🪹 - Give power to your application using the `Router` class.


## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


[contributors-shield]: https://img.shields.io/github/contributors/lottojs/lotto.svg?style=for-the-badge
[contributors-url]: https://github.com/lottojs/lotto/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/lottojs/lotto.svg?style=for-the-badge
[forks-url]: https://github.com/lottojs/lotto/network/members
[stars-shield]: https://img.shields.io/github/stars/lottojs/lotto.svg?style=for-the-badge
[stars-url]: https://github.com/lottojs/lotto/stargazers
[issues-shield]: https://img.shields.io/github/issues/lottojs/lotto.svg?style=for-the-badge
[issues-url]: https://github.com/lottojs/lotto/issues
[license-shield]: https://img.shields.io/github/license/lottojs/lotto.svg?style=for-the-badge
[license-url]: https://github.com/lottojs/lotto/blob/master/LICENSE.txt
[npm-shield]: https://img.shields.io/npm/v/@lottojs/lotto?style=for-the-badge&logo=npm&logoColor=FFFFFF&labelColor=555555&color=CB0001
[npm-url]: https://www.npmjs.com/package/@lottojs/lotto
[serenissima-url]: https://it.wikipedia.org/wiki/Repubblica_di_Venezia
