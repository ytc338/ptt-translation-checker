import React from 'react';
import './TextView.css'; // Assuming a CSS file for styling

interface HighlightRange {
  start: number;
  end: number;
}

interface TextViewProps {
  text: string;
  highlightIndices?: HighlightRange[];
}

const TextView: React.FC<TextViewProps> = ({ text, highlightIndices = [] }) => {
  const renderTextWithHighlights = () => {
    if (!highlightIndices.length) {
      return <>{text}</>;
    }

    const elements: (string | React.JSX.Element)[] = [];
    let currentIndex = 0;

    // Sort highlight indices to handle potential overlaps or unsorted input
    const sortedHighlights = [...highlightIndices].sort((a, b) => a.start - b.start);

    for (let i = 0; i < sortedHighlights.length; i++) {
      const { start, end } = sortedHighlights[i];

      // Add text before the current highlight
      if (start > currentIndex) {
        elements.push(<React.Fragment key={`pre-${currentIndex}`}>{text.substring(currentIndex, start)}</React.Fragment>);
      }

      // Add the highlighted text
      elements.push(
        <span key={`highlight-${i}`} className="highlight">
          {text.substring(start, end)}
        </span>
      );
      currentIndex = Math.max(currentIndex, end); // Ensure currentIndex only moves forward
    }

    // Add any remaining text after the last highlight
    if (currentIndex < text.length) {
      elements.push(<React.Fragment key={`post-${currentIndex}`}>{text.substring(currentIndex)}</React.Fragment>);
    }

    return <>{elements}</>;
  };

  return <div className="text-view">{renderTextWithHighlights()}</div>;
};

export default TextView;
