import React, { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { Check, Copy, ExternalLink } from 'lucide-react';

import Modal from '../Modal';
import { useResumeStore } from '../../../store/useResumeStore';
import { buildShareUrl } from '../../../lib/share';

// Above this the QR gets so dense that phone cameras struggle with it on screen.
const MAX_QR_URL = 1200;

interface Props {
  open: boolean;
  onClose: () => void;
}

const ShareDialog: React.FC<Props> = ({ open, onClose }) => {
  const getActiveResume = useResumeStore((s) => s.getActiveResume);
  const [copied, setCopied] = useState(false);
  const [qr, setQr] = useState<string | null>(null);

  // Snapshot taken when the dialog opens; edits afterwards need a new link.
  const url = useMemo(() => {
    if (!open) return '';
    const { data, style } = getActiveResume();
    return buildShareUrl({ data, style });
  }, [open, getActiveResume]);

  const qrFits = url.length > 0 && url.length <= MAX_QR_URL;

  useEffect(() => {
    setCopied(false);
    setQr(null);
    if (!qrFits) return;
    QRCode.toDataURL(url, { margin: 1, width: 220 }).then(setQr).catch(() => setQr(null));
  }, [url, qrFits]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard can be blocked (non-HTTPS, permissions); the field is selectable.
      setCopied(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Share a read-only link">
      <p className="share__intro">
        Anyone with this link can view this resume. Everything is stored inside
        the link itself, so nothing is uploaded. It's a snapshot: make a new
        link after you edit.
      </p>

      <label className="form-label" htmlFor="share-url">
        Link ({url.length.toLocaleString()} characters)
      </label>
      <div className="share__row">
        <input
          id="share-url"
          className="form-input"
          readOnly
          value={url}
          onFocus={(e) => e.currentTarget.select()}
        />
        <button type="button" className="btn btn--primary" onClick={copy}>
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <a className="share__open" href={url} target="_blank" rel="noreferrer">
        Open preview <ExternalLink size={14} />
      </a>

      <div className="share__qr">
        {qrFits ? (
          qr && <img src={qr} alt="QR code for the share link" width={180} height={180} />
        ) : (
          <p className="share__hint">
            This resume is too long to fit in a scannable QR code. To print a
            QR code on the resume, open <strong>Customize → QR code</strong>{' '}
            and point it to your LinkedIn or GitHub instead.
          </p>
        )}
      </div>
    </Modal>
  );
};

export default ShareDialog;
