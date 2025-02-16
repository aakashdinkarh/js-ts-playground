# JavaScript/TypeScript Playground

A browser-based JavaScript/TypeScript playground with a Chrome DevTools-like console. Built with React and TypeScript, this playground allows you to experiment with code and see the results in real-time.

## Features

- 🚀 Real-time code execution
- 🎯 TypeScript support with live transpilation
- 🛠️ Chrome DevTools-style console output
- 🐛 Detailed error handling and stack traces
- 📊 Rich formatting for complex data types:
  - Promises with state tracking
  - Functions with full body display
  - Objects and Arrays
  - Primitive types with syntax highlighting
- ⚡ Auto-run capability
- 🎨 Syntax highlighting
- 📱 Progressive Web App (PWA) support
- 🔄 Offline capability with smart caching:
  - Monaco editor resources
  - Application assets
  - Intelligent cache management
  - Automatic cache updates

## Getting Started


### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/aakashdinkarh/js-ts-playground.git
   cd js-ts-playground
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npm run start
   # or
   yarn start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Write your JavaScript or TypeScript code in the editor
2. Code will auto-execute as you type (if enabled)
3. View results in the console output below
4. Use console methods like `console.log()`, `console.error()`, etc.
5. Toggle TypeScript support using the language selector

### Example

```typescript
// Basic example
console.log("Hello, World!");
// Promise example
async function fetchData() {
const response = await fetch('https://api.example.com/data');
const data = await response.json();
console.log(data);
}
// Object inspection
const user = {
name: 'John Doe',
age: 30,
roles: ['admin', 'user']
};
console.log(user);
```

## Offline Support

The playground implements a sophisticated caching strategy that enables:

- ⚡ Fast loading times with cached resources
- 🔌 Offline functionality
- 📦 Smart caching of Monaco editor resources
- 🔄 Automatic cache updates when new versions are available
- 💾 Two-tier caching system:
  - Short-term (2 hours) for application assets
  - Long-term (7 days) for stable CDN resources

The playground will work even without an internet connection once you've visited it at least once.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [React](https://reactjs.org/)
- Code editing powered by [Monaco Editor](https://microsoft.github.io/monaco-editor/)

## Support

If you find any bugs or have feature requests, please create an issue in the GitHub repository.
