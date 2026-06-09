/**
 * Trie (Prefix Tree) for O(k) prefix-based search.
 *
 * - All keys are lowercased for case-insensitive matching.
 * - Each leaf/intermediate node stores a Set of item IDs that pass through it.
 * - `search(prefix)` returns all unique items whose name starts with the prefix.
 */

export type SearchableItem = {
  id: string;
  title: string;
  price: number;
  currency: string;
  imageUrl: string;
  href: string;
  type: "product" | "keyring";
  isBestProduct: boolean;
  discount: any;
};

type TrieNode = {
  children: Map<string, TrieNode>;
  items: Set<string>; // item IDs stored at this node
};

function createNode(): TrieNode {
  return { children: new Map(), items: new Set() };
}

export class Trie {
  private root: TrieNode = createNode();
  private itemMap: Map<string, SearchableItem> = new Map();

  /**
   * Insert an item into the trie.
   * The item's title is used as the key (lowercased).
   * We also insert each word of the title separately so
   * searching "friday" matches "Blue Friday Shirt".
   */
  insert(item: SearchableItem): void {
    this.itemMap.set(item.id, item);
    const title = item.title.toLowerCase();

    // Insert the full title
    this._insertKey(title, item.id);

    // Insert each individual word for substring-word matching
    const words = title.split(/\s+/);
    for (const word of words) {
      if (word.length > 0) {
        this._insertKey(word, item.id);
      }
    }
  }

  private _insertKey(key: string, id: string): void {
    let node = this.root;
    for (const char of key) {
      if (!node.children.has(char)) {
        node.children.set(char, createNode());
      }
      node = node.children.get(char)!;
      node.items.add(id);
    }
  }

  /**
   * Search for all items whose title (or any word in the title)
   * starts with the given prefix.
   * Returns results in O(k + m) where k = prefix length, m = matches.
   */
  search(prefix: string): SearchableItem[] {
    if (!prefix) return [];

    const normalizedPrefix = prefix.toLowerCase().trim();
    if (!normalizedPrefix) return [];

    let node = this.root;
    for (const char of normalizedPrefix) {
      if (!node.children.has(char)) {
        return []; // No match
      }
      node = node.children.get(char)!;
    }

    // Collect all unique items from this subtree
    const results: SearchableItem[] = [];
    const seen = new Set<string>();

    for (const id of node.items) {
      if (!seen.has(id)) {
        seen.add(id);
        const item = this.itemMap.get(id);
        if (item) results.push(item);
      }
    }

    return results;
  }

  /** Clear all data from the trie */
  clear(): void {
    this.root = createNode();
    this.itemMap.clear();
  }

  /** Number of unique items in the trie */
  get size(): number {
    return this.itemMap.size;
  }
}
