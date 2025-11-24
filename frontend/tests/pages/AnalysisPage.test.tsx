import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AnalysisPage from '../../../src/pages/AnalysisPage'; // Assuming the page will be here
import api from '../../../src/services/api'; // Assuming the API client will be here

vi.mock('../../../src/services/api'); // Mock the API client

describe('AnalysisPage', () => {
  const mockAnalysisResult = {
    originalContent: 'Original PTT content.',
    translatedContent: 'Translated formal content.',
    annotations: [
      {
        originalSnippet: 'PTT',
        translatedSnippet: '批踢踢',
        issueType: 'Slang',
        explanation: 'PTT is informal.',
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the input field and analyze button', () => {
    render(<AnalysisPage />);
    expect(screen.getByPlaceholderText('Enter PTT URL')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Analyze' })).toBeInTheDocument();
  });

  it('handles URL input and displays loading state', async () => {
    vi.mocked(api.post).mockReturnValue(new Promise(() => {})); // Mock a pending promise
    render(<AnalysisPage />);
    const urlInput = screen.getByPlaceholderText('Enter PTT URL');
    const analyzeButton = screen.getByRole('button', { name: 'Analyze' });

    fireEvent.change(urlInput, { target: { value: 'https://example.com/ptt' } });
    fireEvent.click(analyzeButton);

    expect(analyzeButton).toBeDisabled();
    expect(screen.getByText('Analyzing...')).toBeInTheDocument();

    // The API call is mocked to return a promise, so the loading state will persist until resolved
  });

  it('displays analysis results on successful API call', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: mockAnalysisResult });

    render(<AnalysisPage />);
    const urlInput = screen.getByPlaceholderText('Enter PTT URL');
    const analyzeButton = screen.getByRole('button', { name: 'Analyze' });

    fireEvent.change(urlInput, { target: { value: 'https://example.com/ptt' } });
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText('Original PTT content.')).toBeInTheDocument();
      expect(screen.getByText('Translated formal content.')).toBeInTheDocument();
      expect(screen.getByText('PTT is informal.')).toBeInTheDocument();
      expect(analyzeButton).not.toBeDisabled();
      expect(screen.queryByText('Analyzing...')).not.toBeInTheDocument();
    });
  });

  it('displays error message on failed API call', async () => {
    vi.mocked(api.post).mockRejectedValue(new Error('Network Error'));

    render(<AnalysisPage />);
    const urlInput = screen.getByPlaceholderText('Enter PTT URL');
    const analyzeButton = screen.getByRole('button', { name: 'Analyze' });

    fireEvent.change(urlInput, { target: { value: 'https://example.com/ptt' } });
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText('Error: Network Error')).toBeInTheDocument();
      expect(analyzeButton).not.toBeDisabled();
      expect(screen.queryByText('Analyzing...')).not.toBeInTheDocument();
    });
  });

  it('highlights text when an annotation is selected', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: mockAnalysisResult });

    render(<AnalysisPage />);
    const urlInput = screen.getByPlaceholderText('Enter PTT URL');
    const analyzeButton = screen.getByRole('button', { name: 'Analyze' });

    fireEvent.change(urlInput, { target: { value: 'https://example.com/ptt' } });
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText('Original PTT content.')).toBeInTheDocument(); // Ensure content is loaded
    });

    fireEvent.click(screen.getByText('PTT is informal.')); // Click on the annotation

    await waitFor(() => {
      // Assuming TextView highlights elements with a 'highlight' class
      // The exact implementation of TextView's highlighting needs to be considered
      const originalHighlighted = screen.getByText('PTT', { selector: 'span.highlight' });
      const translatedHighlighted = screen.getByText('批踢踢', { selector: 'span.highlight' });
      expect(originalHighlighted).toBeInTheDocument();
      expect(translatedHighlighted).toBeInTheDocument();
    });
  });
});
