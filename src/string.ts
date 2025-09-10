import slugify from "slugify";

export default class Str {
  static mask = (text: string, start: number = 0, end: number = 0): string => {
    const length = text.length;
    const _start = start < 0 ? length + start : start;
    const _end = end <= 0 ? length + end : end;

    if (
      !length ||
      _start < 0 ||
      _start >= length ||
      _end <= 0 ||
      _end > length ||
      _start >= _end
    ) {
      return text;
    }

    const maskedLength = _end - _start;

    return (
      text.substring(0, _start) +
      "*".repeat(maskedLength) +
      text.substring(_end)
    );
  };

  static normalize(text: string) {
    if (typeof text !== "string") {
      return text;
    }

    slugify.extend({
      ".": " ",
      "-": " ",
    });

    return slugify(text, {
      lower: true,
      locale: "vi",
      trim: true,
      replacement: " ",
      remove: /[^\w\s]+/g,
    });
  }

  /**
   * Normalize Vietnamese accent marks according to Vietnamese grammar rules
   * @param text - The text to normalize
   * @returns The normalized text with proper accent placement
   */
  static normalizeVietnameseAccent(text: string): string {
    if (typeof text !== "string") {
      return text;
    }

    // Map of characters with their base forms and accent marks
    const accentMap: Record<string, { base: string; marks: string[] }> = {
      a: { base: "a", marks: ["à", "á", "ả", "ã", "ạ"] },
      ă: { base: "ă", marks: ["ằ", "ắ", "ẳ", "ẵ", "ặ"] },
      â: { base: "â", marks: ["ầ", "ấ", "ẩ", "ẫ", "ậ"] },
      e: { base: "e", marks: ["è", "é", "ẻ", "ẽ", "ẹ"] },
      ê: { base: "ê", marks: ["ề", "ế", "ể", "ễ", "ệ"] },
      i: { base: "i", marks: ["ì", "í", "ỉ", "ĩ", "ị"] },
      o: { base: "o", marks: ["ò", "ó", "ỏ", "õ", "ọ"] },
      ô: { base: "ô", marks: ["ồ", "ố", "ổ", "ỗ", "ộ"] },
      ơ: { base: "ơ", marks: ["ờ", "ớ", "ở", "ỡ", "ợ"] },
      u: { base: "u", marks: ["ù", "ú", "ủ", "ũ", "ụ"] },
      ư: { base: "ư", marks: ["ừ", "ứ", "ử", "ữ", "ự"] },
      y: { base: "y", marks: ["ỳ", "ý", "ỷ", "ỹ", "ỵ"] },
      A: { base: "A", marks: ["À", "Á", "Ả", "Ã", "Ạ"] },
      Ă: { base: "Ă", marks: ["Ằ", "Ắ", "Ẳ", "Ẵ", "Ặ"] },
      Â: { base: "Â", marks: ["Ầ", "Ấ", "Ẩ", "Ẫ", "Ậ"] },
      E: { base: "E", marks: ["È", "É", "Ẻ", "Ẽ", "Ẹ"] },
      Ê: { base: "Ê", marks: ["Ề", "Ế", "Ể", "Ễ", "Ệ"] },
      I: { base: "I", marks: ["Ì", "Í", "Ỉ", "Ĩ", "Ị"] },
      O: { base: "O", marks: ["Ò", "Ó", "Ỏ", "Õ", "Ọ"] },
      Ô: { base: "Ô", marks: ["Ồ", "Ố", "Ổ", "Ỗ", "Ộ"] },
      Ơ: { base: "Ơ", marks: ["Ờ", "Ớ", "Ở", "Ỡ", "Ợ"] },
      U: { base: "U", marks: ["Ù", "Ú", "Ủ", "Ũ", "Ụ"] },
      Ư: { base: "Ư", marks: ["Ừ", "Ứ", "Ử", "Ữ", "Ự"] },
      Y: { base: "Y", marks: ["Ỳ", "Ý", "Ỷ", "Ỹ", "Ỵ"] },
    };

    // Function to extract accent mark from a character
    const extractAccent = (char: string): { base: string; mark: number } => {
      for (const [base, data] of Object.entries(accentMap)) {
        const markIndex = data.marks.indexOf(char);
        if (markIndex !== -1) {
          return { base, mark: markIndex };
        }
      }
      return { base: char, mark: -1 };
    };

    // Function to apply accent mark to a character
    const applyAccent = (base: string, mark: number): string => {
      if (mark === -1) return base;
      const data = accentMap[base];
      return data ? data.marks[mark] : base;
    };

    // Function to check if word has final consonant
    const hasFinalConsonant = (word: string): boolean => {
      const lastChar = word[word.length - 1];
      const { base } = extractAccent(lastChar);
      return !accentMap[base] && !accentMap[base.toLowerCase()];
    };

    // Function to normalize accent for a word
    const normalizeWord = (word: string): string => {
      // Correct accent on "gi" and "qu"
      const correctChars = [];

      const vowels: Array<{
        char: string;
        index: number;
        accent: number;
      }> = [];

      // Special consonant clusters that should be treated as single consonants
      const specialConsonants = ["gi", "qu"];
      let accentIndex = -1;

      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        const { base, mark } = extractAccent(char);
        let isSpecialConsonant = false;

        if (i === 0 && word.length > 2) {
          // Check if this is part of a special consonant cluster "gi" and "qu"
          const nextChar = extractAccent(word[i + 1]);
          const currentPair = char + nextChar.base;

          for (const special of specialConsonants) {
            if (currentPair.toLowerCase() === special) {
              isSpecialConsonant = true;
              // Skip the next character as it's part of the consonant cluster
              correctChars.push(currentPair);
              i++;

              if (nextChar.mark !== -1) {
                accentIndex = nextChar.mark;
              }
              break;
            }
          }
        }

        // Only add as vowel if it's not part of a special consonant cluster
        if (!isSpecialConsonant) {
          if (accentMap[base] || accentMap[base.toLowerCase()]) {
            vowels.push({
              char: base.toLowerCase(),
              index: i,
              accent: mark,
            });
            correctChars.push(
              applyAccent(base, accentIndex !== -1 ? accentIndex : mark)
            );
            accentIndex = -1;
          } else {
            correctChars.push(base);
          }
        }
      }

      const correctedWord = correctChars.join("");

      if (vowels.length === 0) return correctedWord;

      // Find the accent mark to preserve
      let accentToPreserve = -1;
      let currentAccentIndex = -1;
      for (let i = 0; i < vowels.length; i++) {
        if (vowels[i].accent !== -1) {
          accentToPreserve = vowels[i].accent;
          currentAccentIndex = i;
          break;
        }
      }

      // If no accent mark found, return original word
      if (accentToPreserve === -1) return correctedWord;

      // Determine target vowel position based on rules
      let targetIndex = 0;

      // Exception rule: 'ê' and 'ơ' have priority regardless of position
      const priorityVowels = ["ê", "ơ"];
      for (let i = 0; i < vowels.length; i++) {
        if (priorityVowels.includes(vowels[i].char)) {
          targetIndex = i;
          break;
        }
      }

      // If no priority vowel found, apply normal rules
      if (targetIndex === 0 && !priorityVowels.includes(vowels[0].char)) {
        if (vowels.length === 1) {
          // Rule 1: Single vowel - place accent on the vowel
          targetIndex = 0;
        } else if (vowels.length === 2) {
          // Rule 2: Two vowels (diphthong) - place accent on first vowel
          // But if there's a final consonant, treat as triphthong
          if (hasFinalConsonant(correctedWord)) {
            targetIndex = 1; // Move to second vowel
          } else {
            targetIndex = 0; // Stay on first vowel
          }
        } else if (vowels.length >= 3) {
          // Rule 2: Three vowels (triphthong) - move accent to second vowel
          targetIndex = 1;
        }
      }

      // If accent is already in the correct position, return original word
      if (currentAccentIndex === targetIndex) {
        return correctedWord;
      }

      // Apply accent to target vowel
      const result = correctedWord.split("");
      const targetVowel = vowels[targetIndex];
      const originalChar = result[targetVowel.index];
      const { base } = extractAccent(originalChar);
      result[targetVowel.index] = applyAccent(base, accentToPreserve);

      // Remove accents from other vowels
      for (let i = 0; i < vowels.length; i++) {
        if (i !== targetIndex) {
          const vowel = vowels[i];
          const originalChar = result[vowel.index];
          const { base } = extractAccent(originalChar);
          result[vowel.index] = base;
        }
      }

      return result.join("");
    };

    // Split text into words and normalize each word
    return text
      .normalize("NFC")
      .split(/(\s+|\p{P}+)/u)
      .map((part) => {
        // Only process non-whitespace parts
        if (/\s|\p{P}/u.test(part)) {
          return part;
        }
        return normalizeWord(part);
      })
      .join("");
  }
}
