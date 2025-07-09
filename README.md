# 🧠 Shurangama Sutra 2 - MagicPath

An interactive mind map visualization of the Shurangama Sutra (楞嚴經), built with modern web technologies for an immersive learning experience.

## ✨ Features

### 🎯 Interactive Mind Map
- **Progressive Disclosure**: Click to expand/collapse nodes individually
- **Smart Layout Algorithm**: Prevents node overlapping with intelligent subtree spacing
- **Balanced Flow**: Children nodes distributed above and below parents like Google NotebookLM
- **Auto-Viewport Adjustment**: Automatically centers and scales content when expanding nodes

### 🎨 Modern Design
- **Mint Theme**: Professional color scheme from tweakcn
- **Noodle Connections**: Smooth, curved connection lines inspired by jsMind
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Responsive Design**: Works seamlessly across different screen sizes

### 🚀 Technical Excellence
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations
- **Vite** for lightning-fast development
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/shurangama2-magicpath.git
cd shurangama2-magicpath

# Install dependencies
bun install
# or
npm install

# Start development server
bun run dev
# or
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the mind map.

## 🎮 Usage

- **Click** any node to expand/collapse its children
- **Drag** to pan around the mind map
- **Scroll** to zoom in/out
- **Use controls** in the bottom-right for zoom and reset functions
- **Keyboard navigation** with arrow keys and Enter/Space

## 📚 Content Structure

The mind map covers the Shurangama Sutra with:
- **Root**: 楞嚴經 (Shurangama Sutra)
- **Chapters**: Major sections like 七處徵心, 十番顯見, 辨識真妄
- **Sections**: Detailed subsections with page references and lecture numbers

## 🏗️ Architecture

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   └── generated/
│       └── MindMapCanvas.tsx  # Main mind map component
├── lib/
│   └── utils.ts           # Utility functions
└── index.css              # Global styles with Tailwind
```

## 🎨 Customization

### Adding New Nodes
Edit the `defaultData` in `MindMapCanvas.tsx`:

```typescript
const defaultData: MindMapNode[] = [{
  id: "unique-id",
  title: "Node Title",
  pageRef: "P.123",
  lectureNumber: 5,
  isExpanded: false,
  children: [...]
}];
```

### Styling
The project uses Tailwind CSS with a custom tangerine theme. Modify `src/index.css` for global styles.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Shurangama Sutra** - The profound Buddhist text that inspired this visualization
- **jsMind** - Inspiration for the connection line algorithms
- **Google NotebookLM** - UI/UX inspiration for the balanced flow layout
- **tweakcn** - Beautiful tangerine color theme

## 🔮 Future Enhancements

- [ ] Search functionality with highlighting
- [ ] Export to various formats (PNG, SVG, PDF)
- [ ] Multiple theme options
- [ ] Audio integration for lectures
- [ ] Collaborative editing features
- [ ] Mobile app version

---

Built with ❤️ for Buddhist studies and modern web development 
