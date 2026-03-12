# Security Policy

## Supported Versions

Security updates are currently provided for the latest published version of `sigilid`.

As the project is still early, older versions may not receive patches. If you believe you have found a security issue, please test against the latest version before reporting it.

## Reporting a Vulnerability

Please do **not** open a public GitHub issue for suspected security vulnerabilities.

Instead, report security issues privately by contacting:

**Moritz Myrseth**  
GitHub: [@moritzmyrz](https://github.com/moritzmyrz)

If a dedicated security email is added later, this policy will be updated accordingly.

When reporting a vulnerability, please include as much of the following as possible:

- a clear description of the issue
- affected version(s)
- steps to reproduce
- proof of concept, if available
- potential impact
- any suggested mitigation or fix

## What to Expect

I will make a good-faith effort to:

- acknowledge receipt of the report within a reasonable time
- investigate and validate the issue
- determine the impact and scope
- prepare a fix if the report is valid
- coordinate disclosure responsibly

Please note that response times may vary depending on availability and the complexity of the issue.

## Scope

This policy covers security vulnerabilities in the `sigilid` codebase itself, including published package contents and core project infrastructure.

It does **not** generally cover:

- issues caused by insecure use of the library in downstream applications
- problems in third-party services or tools not maintained by this project
- feature requests framed as security issues without a concrete vulnerability

## Disclosure

Please allow time for the issue to be investigated and, where appropriate, fixed before any public disclosure.

Once a fix is available, the issue may be disclosed publicly in a responsible manner, along with any relevant upgrade guidance.

## Security Philosophy

`sigilid` aims to be small, predictable, and dependency-light. That means security is approached with a few simple principles:

- keep the public API small and understandable
- avoid unnecessary runtime dependencies
- use secure randomness appropriately in security-sensitive paths
- keep optional functionality isolated behind subpath exports
- prefer explicit behavior over hidden magic

If you believe any part of the package violates these principles in a way that creates risk, that feedback is welcome.
