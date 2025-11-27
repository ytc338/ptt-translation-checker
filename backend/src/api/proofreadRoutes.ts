import { Router } from 'express';
import { translatePttPost, analyzeTranslation, getHistory, getProofreadByArticleId } from './controllers/proofreadController';

const router = Router();

router.post('/translate', translatePttPost);
router.post('/analyze', analyzeTranslation);
router.get('/history', getHistory);
router.get('/:articleId', getProofreadByArticleId);

export default router;