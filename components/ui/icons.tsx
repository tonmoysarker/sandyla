/**
 * Shared icon set — thin strokes (1.25) with rounded terminals, per the
 * Stitch design language ("organic icons that avoid sharp geometric endings").
 */

type IconProps = {
  className?: string;
  strokeWidth?: number;
};

function Icon({
  children,
  className = "h-5 w-5",
  strokeWidth = 1.25,
  label,
  testId,
}: IconProps & { children: React.ReactNode; label?: string; testId?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
      data-testid={testId}
    >
      {children}
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Icon {...props} testId="icon-menu">
      <path d="M4 7h16M4 12h16M4 17h10" />
    </Icon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props} testId="icon-close">
      <path d="M6 6l12 12M18 6L6 18" />
    </Icon>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <Icon {...props} testId="icon-sun">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" />
    </Icon>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <Icon {...props} testId="icon-moon">
      <path d="M20 13.5A8.5 8.5 0 0 1 10.5 4 7 7 0 1 0 20 13.5Z" />
    </Icon>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Icon {...props} testId="icon-search">
      <circle cx="11" cy="11" r="6" />
      <path d="M15.5 15.5 20 20" />
    </Icon>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Icon {...props} testId="icon-arrow-right">
      <path d="M4 12h15" />
      <path d="M14 7c1.5 2.2 3 4 5 5-2 1-3.5 2.8-5 5" />
    </Icon>
  );
}

export function SendIcon(props: IconProps) {
  return (
    <Icon {...props} testId="icon-send">
      <path d="M4 12 20 4l-4.5 16-4-6.5L4 12Z" />
      <path d="M11.5 13.5 20 4" />
    </Icon>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <Icon {...props} testId="icon-heart">
      <path d="M12 20c-4.5-3.2-8-6.1-8-9.6C4 7.7 6 6 8.2 6c1.6 0 3 .9 3.8 2.3C12.8 6.9 14.2 6 15.8 6 18 6 20 7.7 20 10.4c0 3.5-3.5 6.4-8 9.6Z" />
    </Icon>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <Icon {...props} testId="icon-instagram">
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="16.8" cy="7.2" r="0.6" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function PinterestIcon(props: IconProps) {
  return (
    <Icon {...props} testId="icon-pinterest">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M10 17.5c.5-2 1-4.2 1.3-5.7" />
      <path d="M9.4 11.2a3 3 0 1 1 4.9 2.3c-1 .9-2.4.7-2.9-.3" />
    </Icon>
  );
}

/** Art Nouveau leaf flourish — the recurring brand mark. */
export function FlourishIcon(props: IconProps) {
  return (
    <Icon {...props} testId="icon-flourish">
      <path d="M12 20c0-6 0-10 0-14" />
      <path d="M12 10C8.5 10 6 7.8 5.8 4.5 9.2 4.6 12 6.8 12 10Z" />
      <path d="M12 14c3.5 0 6-2.2 6.2-5.5C14.8 8.6 12 10.8 12 14Z" />
    </Icon>
  );
}

/** Quill for writing/poetry metadata. */
export function QuillIcon(props: IconProps) {
  return (
    <Icon {...props} testId="icon-quill">
      <path d="M5 19c8-1 12-5 14-13-6 1-11 4-12.5 11" />
      <path d="M5 19c.5-2 1.5-4 3-6" />
    </Icon>
  );
}
