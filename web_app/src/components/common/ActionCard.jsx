import { ChevronRightIcon } from "./Icons";

export const ActionCard = ({
  icon,
  title,
  subtitle,
  badge,
  onClick,
  variant = "default",
  audioTip
}) => {
  return (
    <button
      type="button"
      className={`action-card action-card--${variant}`}
      onClick={onClick}
      aria-label={`${title}: ${subtitle}`}
    >
      <div className="action-card__icon-wrapper">
        {icon}
      </div>

      <div className="action-card__content">
        <div className="action-card__header-row">
          <h3 className="action-card__title">{title}</h3>
          {badge && <span className="action-card__badge">{badge}</span>}
        </div>
        <p className="action-card__subtitle">{subtitle}</p>
        {audioTip && (
          <span className="action-card__audio-hint">
            <span className="audio-wave-dot"></span> {audioTip}
          </span>
        )}
      </div>

      <div className="action-card__arrow" aria-hidden="true">
        <ChevronRightIcon size={22} />
      </div>
    </button>
  );
};

