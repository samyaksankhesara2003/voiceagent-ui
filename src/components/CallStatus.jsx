import './CallStatus.css';

const STATUS_CONFIG = {
  idle: { label: 'Ready', className: 'status-idle' },
  connecting: { label: 'Connecting...', className: 'status-connecting' },
  active: { label: 'In Call', className: 'status-active' },
  ended: { label: 'Call Ended', className: 'status-ended' },
};

export default function CallStatus({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.idle;

  return (
    <span className={`call-status ${config.className}`}>
      {status === 'active' && <span className="pulse-dot" />}
      {config.label}
    </span>
  );
}
