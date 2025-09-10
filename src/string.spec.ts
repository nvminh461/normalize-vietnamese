import Str from "./string";

describe("Str", () => {
  describe("normalizeVietnameseAccent", () => {
    it("should normalize single vowel words correctly", () => {
      // Rule 1: Single vowel - place accent on the vowel
      expect(Str.normalizeVietnameseAccent("á")).toBe("á");
      expect(Str.normalizeVietnameseAccent("tã")).toBe("tã");
      expect(Str.normalizeVietnameseAccent("nhà")).toBe("nhà");
      expect(Str.normalizeVietnameseAccent("nhãn")).toBe("nhãn");
      expect(Str.normalizeVietnameseAccent("gánh")).toBe("gánh");
      expect(Str.normalizeVietnameseAccent("ngáng")).toBe("ngáng");
    });

    it("should normalize diphthong words correctly", () => {
      // Rule 2: Two vowels (diphthong) - place accent on first vowel
      expect(Str.normalizeVietnameseAccent("òa")).toBe("òa");
      expect(Str.normalizeVietnameseAccent("oà")).toBe("òa");
      expect(Str.normalizeVietnameseAccent("tòa")).toBe("tòa");
      expect(Str.normalizeVietnameseAccent("toà")).toBe("tòa");
      expect(Str.normalizeVietnameseAccent("ủy")).toBe("ủy");
      expect(Str.normalizeVietnameseAccent("uỷ")).toBe("ủy");
      expect(Str.normalizeVietnameseAccent("thủy")).toBe("thủy");
      expect(Str.normalizeVietnameseAccent("thuỷ")).toBe("thủy");
    });

    it("should normalize triphthong words correctly", () => {
      // Rule 2: Three vowels (triphthong) - move accent to second vowel
      // "toàn" should stay as "toàn" because it's already correctly placed
      expect(Str.normalizeVietnameseAccent("toàn")).toBe("toàn");
      expect(Str.normalizeVietnameseAccent("tòan")).toBe("toàn");
      expect(Str.normalizeVietnameseAccent("khủyu")).toBe("khuỷu");
      expect(Str.normalizeVietnameseAccent("khuyủ")).toBe("khuỷu");
      expect(Str.normalizeVietnameseAccent("khuỷu")).toBe("khuỷu");
    });

    it("should handle exception rule for ê and ơ priority", () => {
      // Exception rule: 'ê' and 'ơ' have priority regardless of position
      expect(Str.normalizeVietnameseAccent("thủơ")).toBe("thuở");
      expect(Str.normalizeVietnameseAccent("thuở")).toBe("thuở");
      expect(Str.normalizeVietnameseAccent("chụyên")).toBe("chuyện");
      expect(Str.normalizeVietnameseAccent("chuỵên")).toBe("chuyện");
      expect(Str.normalizeVietnameseAccent("chuyện")).toBe("chuyện");
    });

    it("should handle mixed case correctly", () => {
      expect(Str.normalizeVietnameseAccent("Á")).toBe("Á");
      expect(Str.normalizeVietnameseAccent("TÃ")).toBe("TÃ");
      expect(Str.normalizeVietnameseAccent("tÃ")).toBe("tÃ");
      expect(Str.normalizeVietnameseAccent("NhÀ")).toBe("NhÀ");
    });

    it("should handle words without accents", () => {
      expect(Str.normalizeVietnameseAccent("toa")).toBe("toa");
      expect(Str.normalizeVietnameseAccent("toan")).toBe("toan");
    });

    it("should handle multiple words in a sentence", () => {
      expect(Str.normalizeVietnameseAccent("toà nhà tòan")).toBe(
        "tòa nhà toàn"
      );
      expect(Str.normalizeVietnameseAccent("tòa nhà toàn")).toBe(
        "tòa nhà toàn"
      );
      expect(Str.normalizeVietnameseAccent("thuỷ, thủơ, chuỵên")).toBe(
        "thủy, thuở, chuyện"
      );
      expect(Str.normalizeVietnameseAccent("thủy, thuở, chuyện")).toBe(
        "thủy, thuở, chuyện"
      );
    });

    it("should handle empty string and non-string input", () => {
      expect(Str.normalizeVietnameseAccent("")).toBe("");
      expect(Str.normalizeVietnameseAccent(null as any)).toBe(null);
      expect(Str.normalizeVietnameseAccent(undefined as any)).toBe(undefined);
    });

    it("should handle words with consonants only", () => {
      expect(Str.normalizeVietnameseAccent("xyz")).toBe("xyz");
      expect(Str.normalizeVietnameseAccent("123")).toBe("123");
    });

    it("should preserve whitespace", () => {
      expect(Str.normalizeVietnameseAccent("  toà  nhà  ")).toBe(
        "  tòa  nhà  "
      );
      expect(Str.normalizeVietnameseAccent("  tòa  nhà  ")).toBe(
        "  tòa  nhà  "
      );
      expect(Str.normalizeVietnameseAccent("toà\nnhà")).toBe("tòa\nnhà");
      expect(Str.normalizeVietnameseAccent("tòa\nnhà")).toBe("tòa\nnhà");
    });

    it("should handle real-world examples correctly", () => {
      // Test cases from the rules
      expect(Str.normalizeVietnameseAccent("toà")).toBe("tòa"); // diphthong: accent on first vowel
      expect(Str.normalizeVietnameseAccent("tòan")).toBe("toàn"); // triphthong: accent on second vowel
      expect(Str.normalizeVietnameseAccent("thuỷ")).toBe("thủy"); // diphthong: accent on first vowel
      expect(Str.normalizeVietnameseAccent("khủyu")).toBe("khuỷu"); // triphthong: accent on second vowel
      expect(Str.normalizeVietnameseAccent("thủơ")).toBe("thuở"); // exception: ơ has priority
      expect(Str.normalizeVietnameseAccent("chuỵên")).toBe("chuyện"); // exception: ê has priority
    });

    it("should handle incorrect accent placement and fix it", () => {
      // These should be corrected according to the rules
      expect(Str.normalizeVietnameseAccent("tòan")).toBe("toàn"); // Corrected from 'tòan' to 'toàn'
      expect(Str.normalizeVietnameseAccent("khủyu")).toBe("khuỷu"); // Already correct
    });

    it("should handle special consonant clusters gi and qu correctly", () => {
      // Special rule: "già" and "quạ" are not diphthongs but "gi" + "à" and "qu" + "ạ"
      expect(Str.normalizeVietnameseAccent("gì")).toBe("gì");
      expect(Str.normalizeVietnameseAccent("gìa")).toBe("già");
      expect(Str.normalizeVietnameseAccent("qụa")).toBe("quạ");
      expect(Str.normalizeVietnameseAccent("gía")).toBe("giá");
      expect(Str.normalizeVietnameseAccent("qủa")).toBe("quả");
      expect(Str.normalizeVietnameseAccent("gỉa")).toBe("giả");
      expect(Str.normalizeVietnameseAccent("qúa")).toBe("quá");
      expect(Str.normalizeVietnameseAccent("qủan")).toBe("quản");
      expect(Str.normalizeVietnameseAccent("qúan")).toBe("quán");
    });
  });

  describe("mask", () => {
    it("should mask text correctly with default parameters", () => {
      expect(Str.mask("hello")).toBe("*****");
    });

    it("should mask text correctly with start and end parameters", () => {
      expect(Str.mask("hello", 1, 4)).toBe("h***o");
    });

    it("should handle negative start parameter", () => {
      expect(Str.mask("hello", -2, 4)).toBe("hel*o");
    });

    it("should handle negative end parameter", () => {
      expect(Str.mask("hello", 1, -1)).toBe("h***o");
    });

    it("should return original text for invalid parameters", () => {
      expect(Str.mask("hello", 5, 3)).toBe("hello");
      expect(Str.mask("hello", -1, -1)).toBe("hello");
    });
  });

  describe("normalize", () => {
    it("should normalize text correctly", () => {
      expect(Str.normalize("Hello World!")).toBe("hello world");
    });

    it("should handle non-string input", () => {
      expect(Str.normalize(null as any)).toBe(null);
      expect(Str.normalize(undefined as any)).toBe(undefined);
    });
  });
});
