# Scaffy

Scaffy is an AI-powered code scaffolding generator that helps developers quickly create project structures and boilerplate code using natural language prompts.

## Features

- 🤖 AI-powered code generation using OpenAI's GPT-4
- 🎨 Modern, responsive UI built with Next.js and Tailwind CSS
- 📦 Automatic zip file creation for generated code
- ✨ Real-time form validation and error handling
- 🚀 Easy deployment to Vercel

## Getting Started

### Prerequisites

- Node.js 18.18.0 or later
- npm or yarn package manager
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/scaffy.git
   cd scaffy
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/scaffy
├── app/             → Frontend pages + API routes
├── lib/             → OpenAI, code generation logic
├── utils/           → Helpers (e.g., zip file creation)
├── components/      → UI components
├── public/          → Static assets
├── styles/          → Global styles
├── package.json     → Dependencies and scripts
├── tsconfig.json    → TypeScript configuration
└── tailwind.config.js → Tailwind CSS configuration
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| OPENAI_API_KEY | Your OpenAI API key | Yes |

## Development

### Code Style

- Use TypeScript for type safety
- Follow the [Next.js](https://nextjs.org/docs/basic-features/pages) file structure
- Use Tailwind CSS for styling
- Implement proper error handling and loading states

### Best Practices

1. Keep components small and focused
2. Use TypeScript interfaces for props and data structures
3. Handle errors gracefully with user-friendly messages
4. Follow React hooks best practices
5. Write meaningful commit messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [OpenAI](https://openai.com/)
- [React Hot Toast](https://react-hot-toast.com/)
