import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchHistory } from '../services/api';
import './HistoryPage.css';

interface HistoryItem {
  id: number;
  createdAt: string;
  articleTitle: string | null;
  englishSource: string;
  googleTranslation: string;
  opTranslation: string;
  proofreadResult: any[]; // Using any[] for now as the structure is complex
  score: number | null;
}

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchHistory();
        setHistory(data);
      } catch (err) {
        setError('Failed to load history.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const handleView = (item: HistoryItem) => {
    // Navigate to AnalysisPage with state
    navigate('/', { state: { 
      initialResult: {
        originalContent: item.englishSource,
        translatedContent: item.googleTranslation || item.englishSource, // Fallback for old records
        opTranslation: item.opTranslation,
        annotations: item.proofreadResult
      }
    } });
  };

  if (loading) return <div className="history-page loading"><div className="spinner"></div></div>;
  if (error) return <div className="history-page error">{error}</div>;

  return (
    <div className="history-page">
      <div className="history-header">
        <h1>Analysis History</h1>
        <p>View your past proofreading sessions.</p>
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          <p>No history found. Start a new analysis!</p>
        </div>
      ) : (
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Issues Found</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id}>
                  <td>{new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString()}</td>
                  <td className="title-cell" title={item.articleTitle || 'No Title'}>
                    {item.articleTitle ? (item.articleTitle.length > 50 ? item.articleTitle.substring(0, 50) + '...' : item.articleTitle) : '-'}
                  </td>
                  <td>
                    <span className="badge issue-badge">
                      {item.proofreadResult.length} Issues
                    </span>
                  </td>
                  <td>
                    <button className="view-btn" onClick={() => handleView(item)}>
                      View Analysis
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
