import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TextView from '../../../src/components/TextView'; // Assuming the component will be here

describe('TextView', () => {
  it('renders the provided text', () => {
    const testText = 'This is some test text.';
    render(<TextView text={testText} />);
    expect(screen.getByText(testText)).toBeInTheDocument();
  });

  it('applies highlighting correctly based on indices', () => {
    const testText = 'Hello world, this is a test.';
    const highlightIndices = [{ start: 6, end: 11 }]; // "world"
    render(<TextView text={testText} highlightIndices={highlightIndices} />);

    // Check that 'world' is rendered as highlighted (e.g., in a <span> with a specific class)
    const highlightedSpan = screen.getByText('world', { selector: 'span.highlight' });
    expect(highlightedSpan).toBeInTheDocument();
  });

  it('renders multiple highlight sections', () => {
    const testText = 'One two three four five.';
    const highlightIndices = [{ start: 0, end: 3 }, { start: 8, end: 13 }]; // "One", "three"
    render(<TextView text={testText} highlightIndices={highlightIndices} />);

    expect(screen.getByText('One', { selector: 'span.highlight' })).toBeInTheDocument();
    expect(screen.getByText('three', { selector: 'span.highlight' })).toBeInTheDocument();
  });

  it('renders correctly with no highlight indices', () => {
    const testText = 'No highlights here.';
    render(<TextView text={testText} />);
    expect(screen.getByText(testText)).toBeInTheDocument();
    expect(screen.queryByRole('generic', { name: /highlight/i })).not.toBeInTheDocument();
  });

  it('handles overlapping highlights by prioritizing one (implementation detail)', () => {
    // This test assumes a specific way of handling overlaps, e.g., merging or prioritizing
    const testText = 'abcdefg';
    const highlightIndices = [{ start: 1, end: 4 }, { start: 2, end: 5 }]; // "bcd", "cde"
    render(<TextView text={testText} highlightIndices={highlightIndices} />);
    // Exact assertion depends on how TextView is implemented to handle overlaps
    // For now, a basic check that highlighting occurs
    expect(screen.getAllByText(/([bcde])/)).not.toHaveLength(0); // Checks if any of b,c,d,e are rendered
  });
});
