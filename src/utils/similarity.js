import { embeddings } from './text-process.js';
import { WORD_MAPPER, ENTITIES } from '../index.js';
const DEFAULT_THRESHOLD = 0.65;

const sum = (arr) => {
    let sum = 0;
    for (let i = 0, n = arr.length; i < n; i++) {
        sum += arr[i];
    }
    return sum;
};

const prod = (q, d) => {
    const arr = [...q];
    for (let i = 0, n = d.length; i < n; i++) {
        arr[i] *= d[i];
    }
    return arr;
};

const cosine = (q, d) => (sum(prod(q, d)) / (Math.sqrt(sum(prod(q, q))) * Math.sqrt(sum(prod(d, d)))));

const calculateCosineSimilarity = (query, lookupTable, threshold = 0) => {
    const results = [];
    const queryVector = embeddings(WORD_MAPPER, query);
    const arrayOfEntries = Object.entries(lookupTable);
    for (let i = 0, n = arrayOfEntries.length; i < n; i++) {
        const [id, currVector] = arrayOfEntries[i];
        const score = cosine(queryVector, currVector);
        if (score > threshold) {
            results.push({ id, score});
        }
    }
    return results;
};

export const getSimilarResults = async (data, query, delimiter, threshold = DEFAULT_THRESHOLD) => {
    const similarityResult = calculateCosineSimilarity(query, ENTITIES, threshold);
    const sorted = similarityResult.sort((a, b) => b.score - a.score);

    const del = sorted.length < delimiter ? sorted.length : delimiter;
    return sorted.slice(0, del);
}