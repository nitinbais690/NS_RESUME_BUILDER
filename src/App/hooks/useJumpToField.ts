import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { FORM_STEPS } from '../../features/ResumeForm/formSteps';
import { usePaneMode } from './usePaneMode';

const stepFor = (field: string) =>
  field === 'Contact' ? 'personal' : FORM_STEPS.find((s) => s.title === field)?.id;

/** Focuses the matching form control once the step has rendered (≈1s max). */
const focusWhenReady = (selector: string | null) => {
  let tries = 0;
  const attempt = () => {
    const scope = document.querySelector('.form-content-area');
    const exact = selector ? scope?.querySelector<HTMLElement>(selector) : null;
    // Wait for the specific item to render before settling for the whole step
    // (the step wrapper exists immediately, even before navigation lands).
    if (selector && !exact && tries++ < 60) {
      requestAnimationFrame(attempt);
      return;
    }
    const target = exact ?? scope?.querySelector<HTMLElement>('.form-component-wrapper');
    if (!target) return;
    target.scrollIntoView({ block: 'center', behavior: 'smooth' });
    const field = target.querySelector<HTMLElement>('input:not([type=hidden]), textarea');
    // The step's enter animation can briefly make the field unfocusable, so
    // keep trying for a few frames until focus actually lands.
    let focusTries = 0;
    const tryFocus = () => {
      field?.focus({ preventScroll: true });
      if (field && document.activeElement !== field && focusTries++ < 30) {
        requestAnimationFrame(tryFocus);
      }
    };
    tryFocus();
    target.classList.remove('is-flash');
    void target.offsetWidth; // restart the animation if clicked twice
    target.classList.add('is-flash');
  };
  requestAnimationFrame(attempt);
};

/**
 * Click handler for the live preview: clicking any part of the resume opens the
 * form step for that section and focuses the exact item (experience card,
 * impact row, skill…) when one was clicked.
 */
export const useJumpToField = () => {
  const navigate = useNavigate();
  const [, setPane] = usePaneMode();

  return useCallback(
    (e: React.MouseEvent) => {
      const el = e.target as HTMLElement;
      // The preview is an editing surface: don't follow resume links from it.
      if (el.closest('a')) e.preventDefault();

      const section = el.closest<HTMLElement>('[data-jump]');
      const step = section && stepFor(section.dataset.jump ?? '');
      if (!step) return;

      const item = el.closest<HTMLElement>('[data-jump-id], [data-jump-index]');
      const selector = item?.dataset.jumpId
        ? `[data-edit-id="${CSS.escape(item.dataset.jumpId)}"]`
        : item?.dataset.jumpIndex
          ? `[data-edit-index="${item.dataset.jumpIndex}"]`
          : null;

      setPane('edit');
      navigate('/' + step);
      focusWhenReady(selector);
    },
    [navigate, setPane],
  );
};
