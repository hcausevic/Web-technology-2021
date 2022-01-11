import { preprocessDoc } from '../utils/text-process.js';
import { getSimilarResults} from '../utils/similarity.js';
import { QUESTIONS } from '../index.js';

export const getSearch = async (req, res) => {
    const { q, docId } = req.query;

    // docId has bigger priority if both query parameters are provided
    const query = preprocessDoc(QUESTIONS[docId]?.Title ?? q);
    const relevantNum = 11;

    let similarResults = await getSimilarResults(QUESTIONS, query, relevantNum);
    // if searched by docId, don't retrieve the same element which is used for
    // finding similar
    if (docId && similarResults.length > 1) {
        similarResults = similarResults.slice(1, similarResults.length)
    } 

    res.status(200).json(similarResults.map(el => ({ ...el, text: QUESTIONS[el.id].Title })));
};
