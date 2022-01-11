import { getSimilarResults } from '../utils/similarity.js';
import { preprocessDoc } from '../utils/text-process.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 5;

export const paginate = (model) => {
    return async (req, res, next) => {
        const page = parseInt(req.query.page) || DEFAULT_PAGE;
        const limit = parseInt(req.query.limit) || DEFAULT_LIMIT;
        const q = req.query.q;

        let modelCopy;

        if (q) {
            // if there is query, retrieve model data by similarity to the query
            const similarityRank = await getSimilarResults(model, preprocessDoc(q), Object.keys(model).length, 0);
            modelCopy = similarityRank.map((el) => ({ id: el.id, ...model[el.id] }));
        } else {
            // if no query is provided, relevance is calculated by score
            modelCopy = Object.entries(model).map(([key, value]) => ({ id: key, ...value }))
                .sort((a, b) => b.Score - a.Score);
        }

        const start = (page - 1) * limit;
        const end = page * limit;

        res.pagination = {
            paginated: [...modelCopy.slice(start, end)],
            pagesNum: Math.ceil(modelCopy.length / limit),
            q,
            // include 'next' property if current page is not the last one
            ...(end < modelCopy.length) && {
                next: {
                    page: page + 1,
                    limit,
                }
            },
            // include 'previous' property if current page is not the first one
            ...(start > 0) && {
                previous: {
                    page: page - 1,
                    limit,
                }
            }
        };
        next(); 
    };
};