import { Router } from 'express';
import { translatePttPost, analyzeTranslation, getHistory, getProofreadByArticleId, deleteHistory } from './controllers/proofreadController';

const router = Router();

router.post('/translate', translatePttPost);
router.post('/analyze', analyzeTranslation);
router.get('/history', getHistory);
router.delete('/history/:id', deleteHistory);
router.get('/:articleId', getProofreadByArticleId);

export default router;