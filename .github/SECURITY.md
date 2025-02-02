# Security Policy

## Supported Versions

Currently, we maintain security updates for the following versions of the JavaScript/TypeScript Playground:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.0   | :white_check_mark: |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability within the JavaScript/TypeScript Playground, please follow these steps:

1. **Do Not** disclose the vulnerability publicly until it has been addressed by our team.
2. Send details of the vulnerability to [aakashdinkarh@gmail.com](mailto:aakashdinkarh@gmail.com)
   - Include a description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fixes (if any)

### What to Expect

- **Initial Response**: You will receive an initial response within 48 hours acknowledging receipt of your report.
- **Updates**: We will provide updates on the progress of addressing the vulnerability at least once every 5 days.
- **Resolution Timeline**: We aim to resolve critical vulnerabilities within 7 days of the initial report.

### Security Response Process

1. Your report will be acknowledged within 48 hours
2. Our team will investigate and validate the vulnerability
3. We will develop and test a fix
4. A security advisory will be prepared
5. The fix will be deployed and a new version released
6. Public disclosure will be coordinated with you

### Scope

The following are in scope for security reports:
- Code execution vulnerabilities
- Cross-site scripting (XSS)
- Cross-site request forgery (CSRF)
- Authentication/authorization vulnerabilities
- Data exposure vulnerabilities

### Out of Scope

- Issues without clear security impact
- Issues requiring physical access to the user's device
- Issues affecting unsupported versions
- Issues in dependencies that are already publicly known

## Best Practices

To help maintain the security of your playground instance:

1. Always use the latest version
2. Regularly update dependencies
3. Follow security best practices when implementing custom code
4. Do not expose sensitive data in the playground
5. Use content security policies when deploying

## Security-Related Configuration

The playground includes several security measures by default:
- Sandboxed code execution environment
- Input validation and sanitization
- Content Security Policy headers
- CORS protection

## Attribution

We believe in acknowledging security researchers who help improve our security. With your permission, we'll include your name in our security acknowledgments. 