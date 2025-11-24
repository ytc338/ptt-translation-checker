import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AnnotationList from '../../../src/components/AnnotationList'; // Assuming the component will be here
import { Annotation } from '../../../backend/src/models'; // Assuming shared models

describe('AnnotationList', () => {
  const mockAnnotations: Annotation[] = [
    {
      originalSnippet: '錢',
      translatedSnippet: '金錢',
      issueType: 'Slang',
      explanation: 'Explanation 1',
      suggestion: 'Suggestion 1',
    },
    {
      originalSnippet: 'UCCU',
      translatedSnippet: '你看看你',
      issueType: 'Informal',
      explanation: 'Explanation 2',
    },
  ];

  it('renders a list of annotations', () => {
    render(<AnnotationList annotations={mockAnnotations} onSelectAnnotation={vi.fn()} />);

    expect(screen.getByText('Slang')).toBeInTheDocument();
    expect(screen.getByText('錢')).toBeInTheDocument();
    expect(screen.getByText('Explanation 1')).toBeInTheDocument();
    expect(screen.getByText('Informal')).toBeInTheDocument();
    expect(screen.getByText('UCCU')).toBeInTheDocument();
    expect(screen.getByText('Explanation 2')).toBeInTheDocument();
  });

  it('calls onSelectAnnotation with the correct index when an annotation is clicked', () => {
    const mockOnSelect = vi.fn();
    render(<AnnotationList annotations={mockAnnotations} onSelectAnnotation={mockOnSelect} />);

    fireEvent.click(screen.getByText('Slang'));
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith(0);

    fireEvent.click(screen.getByText('Informal'));
    expect(mockOnSelect).toHaveBeenCalledTimes(2);
    expect(mockOnSelect).toHaveBeenCalledWith(1);
  });

  it('highlights the selected annotation', () => {
    render(<AnnotationList annotations={mockAnnotations} onSelectAnnotation={vi.fn()} selectedAnnotationIndex={0} />);
    const firstAnnotation = screen.getByText('Slang').closest('div');
    expect(firstAnnotation).toHaveClass('selected');
  });

  it('does not highlight unselected annotations', () => {
    render(<AnnotationList annotations={mockAnnotations} onSelectAnnotation={vi.fn()} selectedAnnotationIndex={0} />);
    const secondAnnotation = screen.getByText('Informal').closest('div');
    expect(secondAnnotation).not.toHaveClass('selected');
  });

  it('renders gracefully with an empty list of annotations', () => {
    render(<AnnotationList annotations={[]} onSelectAnnotation={vi.fn()} />);
    expect(screen.queryByText('Slang')).not.toBeInTheDocument();
    expect(screen.queryByText('Informal')).not.toBeInTheDocument();
    expect(screen.getByText('No annotations found.')).toBeInTheDocument();
  });
});
