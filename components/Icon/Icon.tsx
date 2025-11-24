import { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  name: string;
  className?: string;
};

export function Icon({ name, className, ...props }: IconProps) {
  return (
    <svg className={className} {...props}>
      <use href={`/icons/sprite.svg#${name}`} />
    </svg>
  );
}