import { splitEmphasis } from '../../../lib/emphasis';

/** Renders "**bold**" runs in resume text as <strong>. */
const Emphasis: React.FC<{ text: string }> = ({ text }) => (
  <>
    {splitEmphasis(text).map((part, i) =>
      part.bold ? <strong key={i}>{part.text}</strong> : part.text,
    )}
  </>
);

export default Emphasis;
