import fs from 'fs';
import {embeddings, preprocessDoc, VECTOR_LENGTH} from './utils/text-process.js';
import path from 'path';
import w2v from 'word2vec';

const createCorpus = (inputFile, outputFile) => {
    const input = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
    const corpus =  Object.entries(input)
        .reduce((corpus, [_key, value]) => corpus + preprocessDoc(value.Body), '');
    fs.writeFileSync(outputFile, corpus);
}

const createEmbeddings = (inputFile, modelFile, outputFile) => {
    const input = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
    const model = JSON.parse(fs.readFileSync(modelFile, 'utf-8'));
    const embs = {};
    for (const [key, value] of Object.entries(input)) {
        embs[key] = embeddings(model, preprocessDoc(value.Title)).map(el => parseFloat(el.toFixed(6)));
    }
    fs.writeFileSync(outputFile, JSON.stringify(embs));
}

const createWordMapper = (modelFile, wordMapperPath) => {
    const modelLines = fs.readFileSync(modelFile, 'utf-8').split('\n');
    const wordMapper = {};
    for (let i = 2; i < modelLines.length; i++) {
        const tokens = modelLines[i].split(' ');
        const word = tokens[0];
        wordMapper[word] = tokens.slice(1, tokens.length - 1).map(el => +el );
    }
    fs.writeFileSync(wordMapperPath, JSON.stringify(wordMapper));
}

const prepareData = () => {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'questions.json');
    createCorpus(dataPath, 'corpus.txt');
    w2v.word2vec('corpus.txt', 'word_vectors.txt', { size: VECTOR_LENGTH, iter: 10 }, () => {
        createWordMapper(path.join(process.cwd(), 'word_vectors.txt'), 'wv.json');
        createEmbeddings(dataPath, 'wv.json', 'entities.json');
    });
}

const ePath = path.join(process.cwd(), 'entities.json');
const wvPath = path.join(process.cwd(), 'wv.json');

const args = process.argv.slice(2);

const NO_EXISTING_DATA = !(fs.existsSync(ePath) && fs.existsSync(wvPath));
const ASKED_RELOAD = args && args[0] === '--reload' && args[1] === 'yes';

if (NO_EXISTING_DATA || ASKED_RELOAD) {
    prepareData();
}
