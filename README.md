# Normalize Vietnamese

A TypeScript library for Vietnamese text processing including accent normalization, text masking, and string utilities.

## Features

- ✅ **Vietnamese Accent Normalization**: Automatically correct Vietnamese accent placement according to grammar rules
- ✅ **Text Masking**: Mask sensitive information in strings
- ✅ **Text Normalization**: Convert text to lowercase, remove special characters
- ✅ **TypeScript Support**: Full TypeScript definitions included
- ✅ **Zero Dependencies**: Only requires `slugify` for text normalization

## Installation

```bash
npm install normalize-vietnamese
```

## Usage

### Import

```typescript
import Str from "normalize-vietnamese";
// or
import { Str } from "normalize-vietnamese";
```

### Vietnamese Accent Normalization

The `normalizeVietnameseAccent` method corrects Vietnamese accent placement according to Vietnamese grammar rules:

```typescript
// Correct diphthongs (2 vowels) - accent on first vowel
Str.normalizeVietnameseAccent("toà"); // returns 'tòa'
Str.normalizeVietnameseAccent("thuỷ"); // returns 'thủy'

// Correct triphthongs (3 vowels) - accent on second vowel
Str.normalizeVietnameseAccent("tòan"); // returns 'toàn'
Str.normalizeVietnameseAccent("khủyu"); // returns 'khuỷu'

// Exception: ê and ơ have priority regardless of position
Str.normalizeVietnameseAccent("thủơ"); // returns 'thuở'
Str.normalizeVietnameseAccent("chuỵên"); // returns 'chuyện'

// Handle special consonant clusters (gi, qu)
Str.normalizeVietnameseAccent("gìa"); // returns 'già'
Str.normalizeVietnameseAccent("qủa"); // returns 'quả'

// Process multiple words
Str.normalizeVietnameseAccent("tòa nhà toàn"); // returns 'tòa nhà toàn'
```

#### Vietnamese Accent Rules

1. **Single vowel**: Accent stays on the vowel
2. **Two vowels (diphthong)**: Accent on first vowel
3. **Three vowels (triphthong)**: Accent on second vowel
4. **Exception**: `ê` and `ơ` have priority regardless of position
5. **Special consonants**: `gi` and `qu` are treated as single consonants

### Text Masking

```typescript
// Mask entire string
Str.mask("hello"); // returns '*****'

// Mask with start and end positions
Str.mask("hello", 1, 4); // returns 'h***o'

// Negative positions (from end)
Str.mask("hello", -2, 4); // returns 'hel*o'
Str.mask("hello", 1, -1); // returns 'h***o'
```

### Text Normalization

```typescript
// Convert to lowercase, remove special characters
Str.normalize("Hello World!"); // returns 'hello world'

// Handles Vietnamese characters
Str.normalize("Xin chào thế giới!"); // returns 'xin chao the gioi'
```

## API Reference

### `Str.normalizeVietnameseAccent(text: string): string`

Normalizes Vietnamese accent marks according to Vietnamese grammar rules.

- **Parameters**: `text` - The text to normalize
- **Returns**: The normalized text with proper accent placement
- **Throws**: Returns original input if not a string

### `Str.mask(text: string, start?: number, end?: number): string`

Masks part of a string with asterisks.

- **Parameters**:
  - `text` - The text to mask
  - `start` - Start position (default: 0, supports negative values)
  - `end` - End position (default: 0, supports negative values)
- **Returns**: The masked string
- **Throws**: Returns original text for invalid parameters

### `Str.normalize(text: string): string`

Normalizes text by converting to lowercase and removing special characters.

- **Parameters**: `text` - The text to normalize
- **Returns**: The normalized text
- **Throws**: Returns original input if not a string

## Development

### Setup

```bash
git clone <repository-url>
cd normalize-vietnamese
npm install
```

### Scripts

```bash
# Build the library
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage
npm run test:coverage

# Development mode (watch for changes)
npm run dev
```

### Testing

The library includes comprehensive tests covering all functionality:

```bash
npm test
```

## Requirements

- Node.js >= 14.0.0
- TypeScript >= 4.0.0 (for development)

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Changelog

### 1.0.0

- Initial release
- Vietnamese accent normalization
- Text masking functionality
- Text normalization utilities
- Full TypeScript support
