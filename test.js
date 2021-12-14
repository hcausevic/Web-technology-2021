const text = 'We propose two novel model architectures for computing continuous vector representations of words from very large data sets. The quality of these representations is measured in a word similarity task, and the results are compared to the previously best performing techniques based on different types of neural networks. We observe large improvements in accuracy at much lower computational cost, i.e. it takes less than a day to learn high quality word vectors from a 1.6 billion words data set. Furthermore, we show that these vectors provide state-of-the-art performance on our test set for measuring syntactic and semantic word similarities.';

const sentences = text.split(/(?<=. )(?=[A-Z])/);
// console.log('################# SENTENCES ###################');
// console.log(sentences);
// console.log('###############################################');

const clearSentence = (s) => {
    return s.toLowerCase().replace(/[\.\-\,]/g, ' ').replace(/([^ ]*)(ies|y|ed|ing|s) /g, '$1 ');
};

// log10(1 + tft,d) ∗ log10(D/dft)

const documents = sentences.map((s) => clearSentence(s));

// console.log('CLEARED DOCUMENTS: ', documents);

// console.log('NINTH: ', documents[0].split(/\s/)[9]);

// for (const doc of documents) {
//     console.log(`DOC`, doc.split(/\s/g).filter((w) => w !== ''));
// }

const data = documents.map((doc) => {
    const words = doc.split(/\s/g).filter((w) => w !== '');
    let object = {};
    words.forEach((w) => {
        if(Object.keys(object).includes(w)) {
            object[w] += 1;
        } else {
            object[w] = 1;
        }
    });
    return object;
});

// console.log('DATA: ', data);

const arrays = [];

const uniques = new Set([...Object.keys(data[0]), ...Object.keys(data[1]), ...Object.keys(data[2]), ...Object.keys(data[3])]);
// word, doc

console.log('UNIQUES:', uniques);
const matrix = [];
const kurac = [];
for (let i = 0; i < 4; i++) {
    const dick = [];
    uniques.forEach((word) => {
        if (Object.keys(data[i]).includes(word)) {
            const tf = data[i][word];
            const df = data.filter((doc) => Object.keys(doc).includes(word)).length;
            const tf_idf = Math.log10(1 + tf) * Math.log10(4/df);
            if (i == 0) {
                // console.log('CURRENT DOC: ', i + 1);
                console.log('WORD: ', word, 'tf_idf: ', tf_idf);
                kurac.push(tf_idf);
            }
            dick.push(tf_idf);
        } else {
            dick.push(0);
        }
    });
    matrix.push(dick);
}

console.log('LEX KURAC: ', kurac.sort((a, b) => b - a).slice(0, 5));

// for (let doc in data) {
//     for (let key in doc) {
//         const tf = doc[key];
//         const df = data.filter((doc) => )
//     }
// }

const sumOfArray = (array) => {
    let sum = 0;
    array.forEach((el) => {
        sum += el;
    });
    return sum;
}

const productOfArray = (array) => {
    let prod = 1;
    array.forEach((el) => {
        prod *= el;
    });
    return prod;
}

const q = matrix[0];
const d = matrix[1];

const calcProd = (q, d) => {
    return q.map((el, index) => el *= d[index]);
};

const cosine = sumOfArray(calcProd(q, d)) / (Math.sqrt(sumOfArray(calcProd(q, q))) * Math.sqrt(sumOfArray(calcProd(d, d))));
console.log('KAZIN: ', cosine);




