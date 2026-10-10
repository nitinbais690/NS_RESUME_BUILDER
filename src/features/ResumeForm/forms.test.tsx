import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Experience from './sections/Experience';
import PersonalDetails from './sections/PersonalDetails';
import { ToolForm } from './common/TagForm';
import { useResumeStore } from '../../store/useResumeStore';
import { ResumeField } from '../../types';

beforeEach(() => {
  localStorage.clear();
  useResumeStore.setState(useResumeStore.getInitialState(), true);
});

describe('form accessibility', () => {
  it('links every Experience label to its input', () => {
    render(<Experience />);
    const count = useResumeStore.getState().resumeData[ResumeField.EXPERIENCE].length;
    for (const label of ['Title', 'Start', 'End', 'Company', 'Technologies', 'Description']) {
      expect(screen.getAllByLabelText(label)).toHaveLength(count);
    }
  });

  it('links personal detail labels to inputs', () => {
    render(<PersonalDetails />);
    expect(screen.getByLabelText('Email')).toHaveValue('alex.johnson@example.com');
  });

  it('gives drag handles and remove buttons descriptive names', () => {
    render(<ToolForm name={ResumeField.SKILLS} />);
    expect(screen.getByRole('button', { name: 'Reorder skill 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove skill 1' })).toBeInTheDocument();
  });
});

describe('list keyboard flow', () => {
  it('Enter adds the next row and focuses it; Backspace on empty removes it', async () => {
    const user = userEvent.setup();
    useResumeStore.getState().updateListField(ResumeField.SKILLS, ['Go']);
    render(<ToolForm name={ResumeField.SKILLS} />);

    await user.click(screen.getByLabelText('skill 1'));
    await user.keyboard('{Enter}');
    expect(screen.getByLabelText('skill 2')).toHaveFocus();

    await user.keyboard('Rust');
    expect(useResumeStore.getState().resumeData[ResumeField.SKILLS]).toEqual(['Go', 'Rust']);

    await user.keyboard('{Enter}{Backspace}');
    expect(useResumeStore.getState().resumeData[ResumeField.SKILLS]).toEqual(['Go', 'Rust']);
    expect(screen.getByLabelText('skill 2')).toHaveFocus();
  });

  it('Shift+Enter inserts a newline inside an impact instead of a new row', async () => {
    const user = userEvent.setup();
    useResumeStore.getState().updateListField(ResumeField.KEY_IMPACT, ['Line one']);
    render(<ToolForm name={ResumeField.KEY_IMPACT} />);

    await user.click(screen.getByLabelText('impact 1'));
    await user.keyboard('{Shift>}{Enter}{/Shift}two');
    expect(useResumeStore.getState().resumeData[ResumeField.KEY_IMPACT]).toEqual(['Line one\ntwo']);
  });

  it('shows writing tips for a weak impact', () => {
    useResumeStore.getState().updateListField(ResumeField.KEY_IMPACT, ['Worked on the dashboard redesign']);
    render(<ToolForm name={ResumeField.KEY_IMPACT} />);
    expect(screen.getByText(/sounds passive/)).toBeInTheDocument();
    expect(screen.getByText(/Add a number/)).toBeInTheDocument();
  });
});
