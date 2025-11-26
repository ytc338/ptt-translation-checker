import { Request, Response, NextFunction } from 'express';
import { AnalysisService } from '../../services/analysisService';
import prisma from '../../services/prismaClient';

const analysisService = new AnalysisService();

export const translatePttPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url } = req.body;

    if (!url) {
      res.status(400).json({ error: 'URL is required' });
      return;
    }

    const result = await analysisService.translatePttPost(url);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const analyzeTranslation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { englishSource, googleTranslation, opTranslation, articleTitle } = req.body;

    if (!englishSource || !googleTranslation) {
      res.status(400).json({ error: 'English source and Google translation are required' });
      return;
    }

    const annotations = await analysisService.analyzeTranslations(englishSource, googleTranslation, opTranslation);

    // Save to DB
    await prisma.proofreading.create({
      data: {
        englishSource,
        googleTranslation,
        opTranslation: opTranslation || '',
        proofreadResult: JSON.stringify(annotations),
        articleTitle: articleTitle || null,
      },
    });

    res.json({ annotations });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const history = await prisma.proofreading.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const parsedHistory = history.map((item: any) => ({
      ...item,
      proofreadResult: JSON.parse(item.proofreadResult),
    }));
    res.json(parsedHistory);
  } catch (error) {
    next(error);
  }
};
