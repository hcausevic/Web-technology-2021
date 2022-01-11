const STOP_WORDS = [
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves',
    'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him',
    'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its',
    'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what',
    'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has',
    'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the',
    'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of',
    'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into',
    'through', 'during', 'before', 'after', 'above', 'below', 'to',
    'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under',
    'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where',
    'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most',
    'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
    'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don',
    'should', 'now'
];

const VECTOR_LENGTH = 300;

const removeStopWords = (text) => {
    const words = text.split(' ');
    const clearedWords = words.filter(w => !STOP_WORDS.includes(w));
    return clearedWords.reduce((prev, curr) => `${prev} ${curr}`);
};

export const preprocessDoc = (text) => {
    if (typeof text !== 'string') return;

    text = text.replace(/<.*?>/g, ''); // tags
    text = text.replace(/\d/g, ''); // words with numbers
    text = text.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}\[\]\\\/]/gi, ''); // spec chars
    text = text.replace(/\S*@\S*\s?/g, ' '); // emails and mentions
    text = text.replace(/http\S+/g, ''); // URL with http prefix
    text = text.replace(/www\S+/g, ''); // URL with www prefix
    text = text.replace(/[\s]+/g, ' '); // consecutive whitespaces

    return removeStopWords(text).toLowerCase().trim();
};

const calculateAverageVector = (vectors) => {
    if (vectors.length === 0) {
        return new Array(VECTOR_LENGTH).fill(0)
    }

    const average = new Array(VECTOR_LENGTH).fill(0);

    for (let i = 0, n = vectors.length; i < n; i++) {
        for (let j = 0, m = vectors[i].length; j < m; j++) {
            average[j] += vectors[i][j];
        }
    }

    return average.map(value => value / VECTOR_LENGTH);
}

export const embeddings = (model, cleanedString) => {
    const text = cleanedString.toLowerCase();
    const wordVectors = [];
    for (const w of text.split(' ')) {
        if (!STOP_WORDS.includes(w)) {
            const vector = model[w];
            if (vector) {
                wordVectors.push(vector);
            }
        }
    }
    return calculateAverageVector(wordVectors);
};