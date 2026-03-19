# Canva AI Presentation Template

This is a standalone version of the Canva AI Presentation template. It provides a simple, clean interface for AI Presentation functionality.

This is a **Canva AI Template** - a starting point template for designers and developers to rapidly prototype and build LLM-powered design application experiments. It provides a clean, interactive whiteboard interface that simulates Canva's design experience with integrated AI chat capabilities.

**Key Purpose**: Enable rapid prototyping of AI-enabled design tools by providing a working foundation that demonstrates how to integrate conversational AI into design applications.

## Prerequisites

This will guide you through setting up Cursor, Node.js and NPM. If you already have done this you can go straight to Getting Started.

### Request access to Cursor

Firstly; if you have not requested access to Cursor go here #cursor-contributors and message the @cop

### Check if you have Node.js and NPM installed

Open Spotlight: Command (⌘) + Spacebar and search "terminal" and press Enter to open it.

Paste this in to Terminal and hit enter (make sure you copy the full string including quotes): `echo "Node: $(node --version 2>/dev/null)$(which node 2>/dev/null | sed 's/^/ (/' | sed 's/$/)/' || echo 'Not installed')" && echo "NPM: $(npm --version 2>/dev/null)$(which npm 2>/dev/null | sed 's/^/ (/' | sed 's/$/)/' || echo 'Not installed')" && echo "Brew: $(brew --version 2>/dev/null | head -1)$(which brew 2>/dev/null | sed 's/^/ (/' | sed 's/$/)/' || echo 'Not installed')" && echo "Xcode Tools: $(xcode-select -p 2>/dev/null || echo 'Not installed')"`

If you see a version next to Node and NPM then you can skip to Installing Cursor. If you see `not found` next to Node or NPM then continue.

### Install Node.js and NPM

Click this link (which should say `Ansible Enrolment (Opt In)`) and click `Run` or `Run Again` **ONCE** kandji-self-service://library/items/efc8bb1c-ccf2-4c0b-8c87-07b4b197f50e

Then click this link (which should say `Ansible Run`) and click `Run` or `Run Again` **ONCE** kandji-self-service://library/items/146a9a6d-b7a4-4e93-9a49-66061e00c11f

You won't see anything immediately happen, give it some time, it can take 15-20 minutes.

Accept any prompts that show up.

### Veryify installation

Open Spotlight: Command (⌘) + Spacebar and search "terminal" and press Enter to open it.

Paste this in to Terminal and hit enter (make sure you copy the full string including quotes): `echo "Node: $(node --version 2>/dev/null)$(which node 2>/dev/null | sed 's/^/ (/' | sed 's/$/)/' || echo 'Not installed')" && echo "NPM: $(npm --version 2>/dev/null)$(which npm 2>/dev/null | sed 's/^/ (/' | sed 's/$/)/' || echo 'Not installed')" && echo "Brew: $(brew --version 2>/dev/null | head -1)$(which brew 2>/dev/null | sed 's/^/ (/' | sed 's/$/)/' || echo 'Not installed')" && echo "Xcode Tools: $(xcode-select -p 2>/dev/null || echo 'Not installed')"`

If you see a version next to Node and NPM then it has worked! Now you can install Cursor.

### Installing Cursor

Now you can install Cursor (assuming it has been approved) kandji-self-service://library/items/887560a2-ec44-4daa-a7c2-db030655e269

Sign in with your Canva email and it should take you to Okta

You don't want to share data

You want privacy mode

## Getting Started

1. Drag the folder that contains all the files into Cursor

2. Click View > Terminal to open a new Terminal (at the bottom of the window)

3. Install dependencies. In the Terminal window run `npm install`

4. Start the development server. In the Terminal window run `npm start`

5. Open your browser and navigate to: http://localhost:5173 (you can also hold Alt + Click the link in the Terminal to open it in your browser)

## Build

To build the project, in Terminal run `npm run build`

The build output will be in the `dist` directory.

## Preview Build

To preview the build, in Terminal run `npm run preview`

## Project Structure

- `src/` - Source code
  - `components/` - React components
  - `styles/` - CSS styles
- `public/` - Static assets

## Quick Start with @canva-ct/genai

The template comes with pre-installed @canva-ct/genai package.

Unified AI service with intelligent routing for chat, image generation, and text-to-speech. Features multimodal support, autonomous tool execution, and comprehensive streaming capabilities.

### Key Features

- **Automatic Routing**: Requests with tools → Agentic service with Langgraph, requests without tools → OpenRouter (direct API)
- **Multimodal Support**: Process text, images, and audio in a single request
- **Image Capabilities**: Generate images and analyze visual content
- **Audio Analysis**: Transcribe and analyze audio files (WAV, MP3)
- **Unified Callbacks**: Consistent callback interface across all methods
- **Streaming & Non-Streaming**: Supports both modes with smart return types
- **Type Safe**: Full TypeScript support with comprehensive types

## What Models Are Available?
All AI-powered templates give you access to leading models from major providers, with no extra setup required. This includes models from Google, Anthropic, OpenAI, and Perplexity.


Google
- google/gemini-2.5-flash
- google/gemini-2.5-pro
- google/gemini-2.5-flash-lite

Anthropic
- anthropic/claude-sonnet-4.5
- anthropic/claude-sonnet-4
- anthropic/claude-opus-4.1

OpenAI
- openai/gpt-5
- openai/gpt-5-mini

Perplexity (for sophisticated live web data)
- perplexity/sonar-reasoning-pro
- perplexity/sonar-pro

All models use the OpenRouter notation, so you can easily switch between them when testing prototypes.
For a full list models and their capabilities have a look at [Open Router Models](https://openrouter.ai/models)

