import React from 'react';
import type { Annotation } from '../types'; // Use frontend-specific types
import './AnnotationList.css'; // Assuming a CSS file for styling

interface AnnotationListProps {
  annotations: Annotation[];
  selectedAnnotationIndex: number | null;
  onSelectAnnotation: (index: number | null) => void;
}

const AnnotationList: React.FC<AnnotationListProps> = ({
  annotations,
  selectedAnnotationIndex,
  onSelectAnnotation,
}) => {
  if (!annotations || annotations.length === 0) {
    return (
      <div className="annotation-list">
        <p className="no-annotations">No annotations found.</p>
      </div>
    );
  }

  return (
    <div className="annotation-list">
      <h2>Annotations ({annotations.length})</h2>
      {annotations.map((annotation, index) => (
        <div
          key={index}
          className={`annotation-item ${selectedAnnotationIndex === index ? 'selected' : ''}`}
          onClick={() => onSelectAnnotation(index)}
        >
          <div className="annotation-header">
            <span className="issue-type">{annotation.issueType}</span>
          </div>
          
          <div className="snippets-container">
            <div className="snippet-box original">
              <span className="label">Original:</span>
              <span className="text">"{annotation.originalSnippet}"</span>
            </div>
            <div className="snippet-box translated">
              <span className="label">Translated:</span>
              <span className="text">"{annotation.translatedSnippet}"</span>
            </div>
          </div>

          <p className="explanation">{annotation.explanation}</p>
          
          {annotation.suggestion && (
            <div className="suggestion-box">
              <span className="label">Suggestion:</span>
              <span className="text">{annotation.suggestion}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AnnotationList;
