import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { translatePost, analyzePost, fetchProofreadByArticleId } from '../services/api';
import TextView from '../components/TextView';
import AnnotationList from '../components/AnnotationList';
import type { AnalysisResult } from '../types'; // Use frontend-specific types
import './AnalysisPage.css'; // Assuming a CSS file for styling

interface HighlightRange {
  start: number;
  end: number;
}

const AnalysisPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { articleId } = useParams<{ articleId: string }>();
  const [pttUrl, setPttUrl] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnnotationIndex, setSelectedAnnotationIndex] = useState<number | null>(null);
  const [originalHighlights, setOriginalHighlights] = useState<HighlightRange[]>([]);
  const [translatedHighlights, setTranslatedHighlights] = useState<HighlightRange[]>([]);
  const [analyzingAnnotations, setAnalyzingAnnotations] = useState<boolean>(false);

  const handleAnalyze = async () => {
    if (!pttUrl) {
      setError('Please enter a PTT URL.');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResult(null);
    setSelectedAnnotationIndex(null);
    setOriginalHighlights([]);
    setTranslatedHighlights([]);
    setAnalyzingAnnotations(false);

    try {
      // Extract Article ID from URL and format it (remove dots and extension)
      // Example: https://www.ptt.cc/bbs/NBA/M.1732614119.A.706.html -> M1732614119A706
      const match = pttUrl.match(/M\.\d+\.A\.[A-Z0-9]+/);
      const extractedArticleId = match ? match[0].replace(/\./g, '') : undefined;

      // Check for existing analysis
      if (extractedArticleId) {
        try {
          const existingData = await fetchProofreadByArticleId(extractedArticleId);
          if (existingData) {
            const useExisting = window.confirm('Analysis for this article already exists.\n\n[OK] Load existing result (Faster)\n[Cancel] Re-analyze (Overwrite)');
            
            if (useExisting) {
              const loadedResult = {
                originalContent: existingData.englishSource,
                translatedContent: existingData.googleTranslation,
                opTranslation: existingData.opTranslation,
                articleTitle: existingData.articleTitle,
                annotations: existingData.proofreadResult,
                articleId: existingData.articleId,
              };
              setAnalysisResult(loadedResult);
              setLoading(false);
              // Pass the result in state to avoid re-fetching
              navigate(`/analysis/${extractedArticleId}`, { state: { initialResult: loadedResult } });
              return; // Stop here if loading existing
            }
          }
        } catch (err: any) {
          // If 404 or other error, proceed to analysis
          console.log("Check for existing failed or not found, proceeding to analyze.", err);
        }
      }

      // Step 1: Translate (Fast)
      const translationResult = await translatePost(pttUrl);
      setAnalysisResult(translationResult);
      setLoading(false); // Stop main loading to show text

      // Step 2: Analyze (Background)
      setAnalyzingAnnotations(true);
      const analysisResponse = await analyzePost(
        translationResult.originalContent,
        translationResult.translatedContent,
        translationResult.opTranslation,
        translationResult.articleTitle,
        extractedArticleId
      );
      
      setAnalysisResult((prev) => prev ? { ...prev, annotations: analysisResponse.annotations, articleId: extractedArticleId } : null);

      // Step 3: Navigate to unique URL
      if (extractedArticleId) {
        // Pass the fresh result too
        const formattedResult = {
            ...translationResult,
             annotations: analysisResponse.annotations, 
             articleId: extractedArticleId
        };
        navigate(`/analysis/${extractedArticleId}`, { state: { initialResult: formattedResult } });
      }
    } catch (err: any) {
      setError(`Error: ${err.message || 'An unknown error occurred.'}`);
      setLoading(false);
    } finally {
      // Only set to false if we haven't already finished (e.g. via 'Use Existing')
      // Actually, if we 'Use Existing', we returned early.
      setAnalyzingAnnotations(false);
    }
  };

  useEffect(() => {
    const loadAnalysis = async () => {
      // Prioritize location state if available and matches the ID (or if we trust it)
      if (location.state && location.state.initialResult) {
          // Verify if the state ID matches the param ID to be safe, or just use it if param is absent?
          // If accessing /analysis/ID directly, location.state is undefined.
          // If navigating from input, it is defined.
          // If ID matches, use it.
          if (!articleId || location.state.initialResult.articleId === articleId) {
             setAnalysisResult(location.state.initialResult);
             return;
          }
      }

      if (articleId) {
        setLoading(true);
        try {
          const data = await fetchProofreadByArticleId(articleId);
          setAnalysisResult({
            originalContent: data.englishSource,
            translatedContent: data.googleTranslation,
            opTranslation: data.opTranslation,
            articleTitle: data.articleTitle,
            annotations: data.proofreadResult,
            articleId: data.articleId,
          });
        } catch (err) {
          setError('Failed to load analysis.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadAnalysis();
  }, [articleId, location.state]);

  useEffect(() => {
    if (analysisResult && selectedAnnotationIndex !== null) {
      const selectedAnnotation = analysisResult.annotations[selectedAnnotationIndex];
      if (selectedAnnotation) {
        // For simplicity, find the first occurrence of the snippet in the full text
        // This is a basic implementation and might need refinement for complex cases (e.g., multiple occurrences, partial matches)
        const findHighlights = (fullText: string, snippet: string): HighlightRange[] => {
          const highlights: HighlightRange[] = [];
          if (!snippet || !fullText) return highlights;

          let lastIndex = -1;
          while ((lastIndex = fullText.indexOf(snippet, lastIndex + 1)) !== -1) {
            highlights.push({ start: lastIndex, end: lastIndex + snippet.length });
          }
          return highlights;
        };

        setOriginalHighlights(findHighlights(analysisResult.originalContent, selectedAnnotation.originalSnippet));
        setTranslatedHighlights(findHighlights(analysisResult.translatedContent, selectedAnnotation.translatedSnippet));
      }
    } else {
      setOriginalHighlights([]);
      setTranslatedHighlights([]);
    }
  }, [selectedAnnotationIndex, analysisResult]);

  return (
    <div className="analysis-page">
      <h1>PTT Proofreading and Translation</h1>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter PTT URL"
          value={pttUrl}
          onChange={(e) => setPttUrl(e.target.value)}
          disabled={loading}
        />
        <button onClick={handleAnalyze} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {analysisResult && (
        <div className="results-section">
          <div className="text-panel">
            <h2>Original Content</h2>
            <TextView text={analysisResult.originalContent} highlightIndices={originalHighlights} />
          </div>
          <div className="text-panel">
            <h2>Translated Content</h2>
            <TextView text={analysisResult.translatedContent} highlightIndices={translatedHighlights} />
          </div>
          <div className="annotations-panel">
            {analyzingAnnotations ? (
              <div className="loading-annotations">
                <div className="spinner"></div>
                <p>Proofreading in progress...</p>
              </div>
            ) : (
              <AnnotationList
                annotations={analysisResult.annotations}
                selectedAnnotationIndex={selectedAnnotationIndex}
                onSelectAnnotation={setSelectedAnnotationIndex}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisPage;
