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
      <h3>Annotations ({annotations.length})</h3>
      {annotations.map((annotation, index) => (
        <div
          key={index}
          className={`annotation-item ${selectedAnnotationIndex === index ? 'selected' : ''}`}
          onClick={() => onSelectAnnotation(index)}
        >
          <div className="annotation-header">
            <span className="issue-type">{annotation.issueType}</span>
            <span className="snippet">
              Original: "{annotation.originalSnippet}" / Translated: "{annotation.translatedSnippet}"
            </span>
          </div>
          <p className="explanation">{annotation.explanation}</p>
          {annotation.suggestion && (
            <p className="suggestion">Suggestion: {annotation.suggestion}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default AnnotationList;
