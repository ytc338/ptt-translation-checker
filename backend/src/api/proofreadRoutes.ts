import { Router } from 'express';
import { translatePttPost, analyzeTranslation, getHistory } from './controllers/proofreadController';

const router = Router();

router.post('/translate', translatePttPost);
router.post('/analyze', analyzeTranslation);
router.get('/history', getHistory);

export default router;