import AR from 'country-flag-icons/react/3x2/AR';
import BR from 'country-flag-icons/react/3x2/BR';
import FR from 'country-flag-icons/react/3x2/FR';
import NL from 'country-flag-icons/react/3x2/NL';
import DE from 'country-flag-icons/react/3x2/DE';
import ES from 'country-flag-icons/react/3x2/ES';
import PT from 'country-flag-icons/react/3x2/PT';
import type { ComponentType, SVGAttributes } from 'react';

type FlagProps = SVGAttributes<SVGElement> & { title?: string };

const FLAGS: Record<string, ComponentType<FlagProps>> = {
  AR, BR, FR, NL, DE, ES, PT,
};

interface Props {
  code: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function Flag({ code, className, style }: Props) {
  const F = FLAGS[code];
  if (!F) return null;
  return <F className={className} style={style} />;
}
